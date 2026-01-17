"""
Pydantic スキーマ定義
フロントエンドの types/analysis.ts に完全準拠
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


# =============================================================================
# レスポンス型（フロント準拠）
# =============================================================================

class EstimationResult(BaseModel):
    """
    単一の推定結果
    フロント: EstimationResult インターフェースに対応
    """
    mean: float = Field(..., description="推定された平均値")
    variance: float = Field(..., description="分散")
    standard_deviation: float = Field(..., description="標準偏差", alias="standardDeviation")
    credible_interval_lower: float = Field(..., description="95%信頼区間の下限", alias="credibleIntervalLower")
    credible_interval_upper: float = Field(..., description="95%信頼区間の上限", alias="credibleIntervalUpper")
    sample_size: int = Field(..., description="サンプルサイズ", alias="sampleSize")

    class Config:
        populate_by_name = True


class SampleComparisonData(BaseModel):
    """
    サンプル数ごとの比較データ
    フロント: SampleComparisonData インターフェースに対応
    """
    label: str = Field(..., description="ラベル（例: 'n=10'）")
    estimation: EstimationResult = Field(..., description="推定結果")


class AnalysisMetadata(BaseModel):
    """分析メタデータ"""
    analyzed_at: str = Field(..., description="分析日時", alias="analyzedAt")
    data_source: str = Field(..., description="データソース", alias="dataSource")

    class Config:
        populate_by_name = True


class AnalysisResponse(BaseModel):
    """
    分析APIレスポンス
    フロント: AnalysisResponse インターフェースに対応
    """
    result: EstimationResult
    metadata: AnalysisMetadata


# =============================================================================
# リクエスト型
# =============================================================================

class SimulateRequest(BaseModel):
    """POST /simulate リクエスト"""
    sample_size: int = Field(default=100, ge=2, le=10000, description="生成するサンプル数")
    num_questions: int = Field(default=10, ge=1, le=100, description="問題数（スコア計算用）")
    true_mean: float = Field(default=75.0, ge=0, le=100, description="母集団の真の平均")
    true_std: float = Field(default=15.0, ge=1, le=50, description="母集団の真の標準偏差")


class AnalyzeRequest(BaseModel):
    """POST /analyze リクエスト"""
    sample_sizes: List[int] = Field(
        default=[10, 30, 100, 300, 1000],
        description="比較するサンプルサイズのリスト"
    )
    true_mean: float = Field(default=75.0, ge=0, le=100)
    true_std: float = Field(default=15.0, ge=1, le=50)


class MCMCRequest(BaseModel):
    """POST /mcmc リクエスト"""
    data: List[float] = Field(..., min_length=2, description="観測データ")
    iterations: int = Field(default=1000, ge=100, le=10000, description="MCMCイテレーション数")
    burn_in: int = Field(default=200, ge=0, description="バーンイン期間")


class MCMCResponse(BaseModel):
    """POST /mcmc レスポンス"""
    result: EstimationResult
    posterior_samples: List[float] = Field(..., description="事後分布サンプル")
    acceptance_rate: float = Field(..., description="採択率")
