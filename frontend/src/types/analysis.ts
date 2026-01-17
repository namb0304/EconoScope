/**
 * 分析データの型定義
 * 将来APIからこの形式でデータが返却される想定
 */

/** 単一の推定結果 */
export interface EstimationResult {
  /** 推定された平均値 */
  mean: number
  /** 分散 */
  variance: number
  /** 標準偏差 */
  standardDeviation: number
  /** 95%信頼区間の下限 */
  credibleIntervalLower: number
  /** 95%信頼区間の上限 */
  credibleIntervalUpper: number
  /** サンプルサイズ */
  sampleSize: number
}

/** サンプル数ごとの比較データ */
export interface SampleComparisonData {
  /** ラベル（例: "n=10", "n=100"） */
  label: string
  /** 推定結果 */
  estimation: EstimationResult
}

/**
 * APIレスポンスの想定形式
 * @todo バックエンドAPI連携時に使用予定
 * 現在は未使用だが、将来のAPI実装時のスキーマとして保持
 */
export interface AnalysisResponse {
  /** 分析結果 */
  result: EstimationResult
  /** メタデータ */
  metadata: {
    analyzedAt: string
    dataSource: string
  }
}
