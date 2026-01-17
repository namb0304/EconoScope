"""
EconoScope バックエンド API
FastAPI によるエンドポイント実装

エンドポイント:
    GET  /health   - ヘルスチェック
    POST /simulate - ダミーデータ生成と基本統計
    POST /analyze  - サンプルサイズ比較分析
    POST /mcmc     - MCMCによるベイズ推定
"""

from datetime import datetime
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import (
    SimulateRequest,
    AnalyzeRequest,
    MCMCRequest,
    EstimationResult,
    SampleComparisonData,
    AnalysisResponse,
    AnalysisMetadata,
    MCMCResponse,
)
from app.services.data_generator import generate_student_scores, generate_comparison_data
from app.services.statistics import estimate_from_sample, estimate_from_mcmc


app = FastAPI(
    title="EconoScope API",
    description="教育データの不確実性を可視化するためのAPI",
    version="1.0.0",
)

# CORS設定（フロントエンドからのアクセスを許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================================
# エンドポイント
# =============================================================================

@app.get("/health")
def health_check():
    """
    ヘルスチェック
    サーバーが正常に稼働しているか確認
    """
    return {"status": "ok"}


@app.post("/simulate", response_model=AnalysisResponse)
def simulate(request: SimulateRequest):
    """
    ダミーデータを生成し、推定結果を返す

    リクエスト例:
        {
            "sample_size": 100,
            "num_questions": 10,
            "true_mean": 75.0,
            "true_std": 15.0
        }

    レスポンス:
        EstimationResult 型（フロント準拠）
    """
    # データ生成
    data = generate_student_scores(
        sample_size=request.sample_size,
        num_questions=request.num_questions,
        true_mean=request.true_mean,
        true_std=request.true_std,
    )

    # 推定
    estimation_dict = estimate_from_sample(data)

    # レスポンス構築
    result = EstimationResult(
        mean=estimation_dict["mean"],
        variance=estimation_dict["variance"],
        standardDeviation=estimation_dict["standard_deviation"],
        credibleIntervalLower=estimation_dict["credible_interval_lower"],
        credibleIntervalUpper=estimation_dict["credible_interval_upper"],
        sampleSize=estimation_dict["sample_size"],
    )

    metadata = AnalysisMetadata(
        analyzedAt=datetime.now().isoformat(),
        dataSource="simulated",
    )

    return AnalysisResponse(result=result, metadata=metadata)


@app.post("/analyze", response_model=List[SampleComparisonData])
def analyze(request: AnalyzeRequest):
    """
    複数のサンプルサイズで推定を行い、比較データを返す

    リクエスト例:
        {
            "sample_sizes": [10, 30, 100, 300, 1000],
            "true_mean": 75.0,
            "true_std": 15.0
        }

    レスポンス:
        SampleComparisonData[] 型（フロント準拠）

    教育的ポイント:
        サンプル数が増えると信頼区間が狭くなることを確認できる
    """
    # サンプルサイズのバリデーション
    for size in request.sample_sizes:
        if size < 2:
            raise HTTPException(
                status_code=400,
                detail=f"サンプルサイズは2以上である必要があります: {size}"
            )

    # 比較データ生成
    comparison_results = generate_comparison_data(
        sample_sizes=request.sample_sizes,
        true_mean=request.true_mean,
        true_std=request.true_std,
    )

    # レスポンス構築
    response = []
    for item in comparison_results:
        est = item["estimation"]
        estimation = EstimationResult(
            mean=est["mean"],
            variance=est["variance"],
            standardDeviation=est["standard_deviation"],
            credibleIntervalLower=est["credible_interval_lower"],
            credibleIntervalUpper=est["credible_interval_upper"],
            sampleSize=est["sample_size"],
        )
        response.append(SampleComparisonData(
            label=item["label"],
            estimation=estimation,
        ))

    return response


@app.post("/mcmc", response_model=MCMCResponse)
def mcmc_estimation(request: MCMCRequest):
    """
    MCMCによるベイズ推定を実行

    リクエスト例:
        {
            "data": [72.5, 81.3, 68.9, ...],
            "iterations": 1000,
            "burn_in": 200
        }

    レスポンス:
        推定結果 + 事後サンプル + 採択率

    教育的ポイント:
        - Metropolis-Hastingsアルゴリズムの動作を理解
        - 採択率が0.2-0.5程度であれば良好
    """
    if len(request.data) < 2:
        raise HTTPException(
            status_code=400,
            detail="データは2件以上必要です"
        )

    # MCMC実行
    estimation_dict, posterior_samples, acceptance_rate = estimate_from_mcmc(
        data=request.data,
        iterations=request.iterations,
        burn_in=request.burn_in,
    )

    # レスポンス構築
    result = EstimationResult(
        mean=estimation_dict["mean"],
        variance=estimation_dict["variance"],
        standardDeviation=estimation_dict["standard_deviation"],
        credibleIntervalLower=estimation_dict["credible_interval_lower"],
        credibleIntervalUpper=estimation_dict["credible_interval_upper"],
        sampleSize=estimation_dict["sample_size"],
    )

    return MCMCResponse(
        result=result,
        posterior_samples=posterior_samples,
        acceptance_rate=acceptance_rate,
    )


# =============================================================================
# 開発用: ルート確認
# =============================================================================

@app.get("/")
def read_root():
    """ルートエンドポイント"""
    return {
        "message": "EconoScope API is running",
        "docs": "/docs",
        "endpoints": ["/health", "/simulate", "/analyze", "/mcmc"],
    }
