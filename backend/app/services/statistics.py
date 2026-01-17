"""
統計計算ロジック
外部ライブラリ（sklearn, pymc等）は使用せず、numpy/mathのみで実装

教育目的のため、数式とコメントを丁寧に記述
"""

import math
import random
from typing import List, Tuple

import numpy as np


def calculate_basic_statistics(data: List[float]) -> dict:
    """
    基本統計量を計算

    Parameters:
        data: 観測データのリスト

    Returns:
        mean: 標本平均
        variance: 不偏分散
        standard_deviation: 標準偏差
        standard_error: 標準誤差

    数式:
        標本平均: x̄ = (1/n) * Σxᵢ
        不偏分散: s² = (1/(n-1)) * Σ(xᵢ - x̄)²
        標準偏差: s = √s²
        標準誤差: SE = s / √n
    """
    n = len(data)
    if n < 2:
        raise ValueError("サンプルサイズは2以上必要です")

    # 標本平均
    mean = sum(data) / n

    # 不偏分散（n-1で割る：ベッセルの補正）
    squared_diff_sum = sum((x - mean) ** 2 for x in data)
    variance = squared_diff_sum / (n - 1)

    # 標準偏差
    std_dev = math.sqrt(variance)

    # 標準誤差（平均の推定誤差）
    standard_error = std_dev / math.sqrt(n)

    return {
        "mean": mean,
        "variance": variance,
        "standard_deviation": std_dev,
        "standard_error": standard_error,
        "sample_size": n,
    }


def calculate_confidence_interval(
    mean: float,
    standard_error: float,
    confidence_level: float = 0.95
) -> Tuple[float, float]:
    """
    信頼区間を計算（正規分布近似）

    Parameters:
        mean: 標本平均
        standard_error: 標準誤差
        confidence_level: 信頼水準（デフォルト95%）

    Returns:
        (下限, 上限) のタプル

    数式:
        95%信頼区間: x̄ ± z * SE
        z = 1.96 (95%信頼水準の場合)

    注意:
        本来はt分布を使うべきだが、教育目的で正規近似を使用
        サンプルサイズが大きければ十分な近似となる
    """
    # 信頼水準に対応するz値（簡易版）
    z_values = {
        0.90: 1.645,
        0.95: 1.96,
        0.99: 2.576,
    }
    z = z_values.get(confidence_level, 1.96)

    margin_of_error = z * standard_error
    lower = mean - margin_of_error
    upper = mean + margin_of_error

    return (lower, upper)


def estimate_from_sample(data: List[float]) -> dict:
    """
    データから推定結果を計算
    フロントの EstimationResult 型に対応する辞書を返す
    """
    stats = calculate_basic_statistics(data)
    lower, upper = calculate_confidence_interval(
        stats["mean"],
        stats["standard_error"]
    )

    return {
        "mean": stats["mean"],
        "variance": stats["variance"],
        "standard_deviation": stats["standard_deviation"],
        "credible_interval_lower": lower,
        "credible_interval_upper": upper,
        "sample_size": stats["sample_size"],
    }


# =============================================================================
# 簡易MCMC（Metropolis-Hastings アルゴリズム）
# =============================================================================

def log_likelihood(data: List[float], mu: float, sigma: float) -> float:
    """
    対数尤度を計算

    データが正規分布 N(μ, σ²) から生成されたと仮定

    数式:
        log L(μ|x) = -n/2 * log(2π) - n * log(σ) - (1/2σ²) * Σ(xᵢ - μ)²
    """
    n = len(data)
    squared_diff = sum((x - mu) ** 2 for x in data)

    return -0.5 * n * math.log(2 * math.pi) - n * math.log(sigma) - squared_diff / (2 * sigma ** 2)


def log_prior(mu: float, prior_mean: float = 50.0, prior_std: float = 30.0) -> float:
    """
    事前分布の対数密度（正規事前分布）

    無情報に近い広い事前分布を設定
    μ ~ N(prior_mean, prior_std²)
    """
    return -0.5 * ((mu - prior_mean) / prior_std) ** 2


def metropolis_hastings(
    data: List[float],
    iterations: int = 1000,
    burn_in: int = 200,
    proposal_std: float = 1.0,
    seed: int | None = None
) -> Tuple[List[float], float]:
    """
    Metropolis-Hastings アルゴリズムによるMCMCサンプリング

    平均μの事後分布をサンプリングする

    Parameters:
        data: 観測データ
        iterations: イテレーション数
        burn_in: バーンイン期間（最初に捨てるサンプル数）
        proposal_std: 提案分布の標準偏差
        seed: 乱数シード（再現性のため）

    Returns:
        (事後サンプルのリスト, 採択率)

    アルゴリズム:
        1. 初期値 μ₀ を設定
        2. 提案分布 N(μ_current, proposal_std²) から μ* を生成
        3. 採択確率 α = min(1, p(μ*|data) / p(μ_current|data)) を計算
        4. 確率 α で μ* を採択、そうでなければ μ_current を維持
        5. 2-4 を繰り返す
    """
    if seed is not None:
        random.seed(seed)
        np.random.seed(seed)

    # データの基本統計量
    sample_mean = sum(data) / len(data)
    sample_std = math.sqrt(sum((x - sample_mean) ** 2 for x in data) / (len(data) - 1))

    # 初期値（標本平均から開始）
    mu_current = sample_mean

    samples = []
    accepted = 0

    for i in range(iterations + burn_in):
        # 提案分布からサンプル
        mu_proposed = random.gauss(mu_current, proposal_std)

        # 対数事後確率の差を計算（対数で計算してオーバーフロー防止）
        log_posterior_current = log_likelihood(data, mu_current, sample_std) + log_prior(mu_current)
        log_posterior_proposed = log_likelihood(data, mu_proposed, sample_std) + log_prior(mu_proposed)

        # 採択確率
        log_alpha = log_posterior_proposed - log_posterior_current

        # Metropolis-Hastings ステップ
        if math.log(random.random()) < log_alpha:
            mu_current = mu_proposed
            if i >= burn_in:
                accepted += 1

        # バーンイン期間後のサンプルを保存
        if i >= burn_in:
            samples.append(mu_current)

    acceptance_rate = accepted / iterations if iterations > 0 else 0.0

    return samples, acceptance_rate


def estimate_from_mcmc(
    data: List[float],
    iterations: int = 1000,
    burn_in: int = 200
) -> Tuple[dict, List[float], float]:
    """
    MCMCによる推定結果を計算

    Returns:
        (推定結果の辞書, 事後サンプル, 採択率)
    """
    samples, acceptance_rate = metropolis_hastings(
        data,
        iterations=iterations,
        burn_in=burn_in
    )

    # 事後サンプルから統計量を計算
    n = len(samples)
    posterior_mean = sum(samples) / n
    posterior_var = sum((s - posterior_mean) ** 2 for s in samples) / (n - 1)
    posterior_std = math.sqrt(posterior_var)

    # 95%信用区間（事後分布の2.5%点と97.5%点）
    sorted_samples = sorted(samples)
    lower_idx = int(0.025 * n)
    upper_idx = int(0.975 * n)
    credible_lower = sorted_samples[lower_idx]
    credible_upper = sorted_samples[upper_idx]

    result = {
        "mean": posterior_mean,
        "variance": posterior_var,
        "standard_deviation": posterior_std,
        "credible_interval_lower": credible_lower,
        "credible_interval_upper": credible_upper,
        "sample_size": len(data),
    }

    return result, samples, acceptance_rate
