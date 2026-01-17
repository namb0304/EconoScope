"""
ダミーデータ生成モジュール
学業成績データを模擬生成する

使用ライブラリ: numpy, random のみ（外部ベイズライブラリは禁止）
"""

import random
from typing import List

import numpy as np


def generate_student_scores(
    sample_size: int,
    num_questions: int = 10,
    true_mean: float = 75.0,
    true_std: float = 15.0,
    seed: int | None = None
) -> List[float]:
    """
    学生のテストスコアを生成

    Parameters:
        sample_size: 生成する学生数
        num_questions: 問題数（今回は使用しないが将来の拡張用）
        true_mean: 母集団の真の平均点
        true_std: 母集団の真の標準偏差
        seed: 乱数シード（再現性のため）

    Returns:
        スコアのリスト（0-100の範囲にクリップ）

    生成モデル:
        score_i ~ N(true_mean, true_std²)
        ただし 0 ≤ score ≤ 100 にクリップ
    """
    if seed is not None:
        np.random.seed(seed)
        random.seed(seed)

    # 正規分布からスコアを生成
    scores = np.random.normal(loc=true_mean, scale=true_std, size=sample_size)

    # 0-100の範囲にクリップ（テストスコアとして妥当な範囲）
    scores = np.clip(scores, 0, 100)

    return scores.tolist()


def generate_comparison_data(
    sample_sizes: List[int],
    true_mean: float = 75.0,
    true_std: float = 15.0
) -> List[dict]:
    """
    サンプルサイズ比較用のデータセットを生成

    同じ母集団パラメータから異なるサンプルサイズでデータを生成し、
    「サンプル数が増えると推定精度が上がる」ことを示す

    Parameters:
        sample_sizes: 比較するサンプルサイズのリスト
        true_mean: 母集団の真の平均
        true_std: 母集団の真の標準偏差

    Returns:
        各サンプルサイズのデータと推定結果のリスト
    """
    from app.services.statistics import estimate_from_sample

    results = []

    for n in sample_sizes:
        # データ生成（サンプルサイズごとに異なるシードで再現性を持たせる）
        data = generate_student_scores(
            sample_size=n,
            true_mean=true_mean,
            true_std=true_std,
            seed=n * 42  # サンプルサイズに基づく決定論的シード
        )

        # 推定
        estimation = estimate_from_sample(data)

        results.append({
            "label": f"n={n}",
            "estimation": estimation,
            "raw_data": data,  # 必要に応じて使用
        })

    return results
