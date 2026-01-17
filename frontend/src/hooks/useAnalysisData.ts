import { useMemo } from 'react'
import type { EstimationResult, SampleComparisonData } from '../types/analysis'

/**
 * ダミーの推定結果を生成
 * 将来的には POST /analyze のレスポンスに置き換える
 *
 * 統計的背景:
 * - 標準誤差 = 標準偏差 / √n
 * - サンプル数が増えると信頼区間が狭くなる（不確実性が減少）
 */
function generateEstimation(sampleSize: number, trueMean = 75, trueStd = 15): EstimationResult {
  // サンプルサイズに応じた標準誤差を計算
  const standardError = trueStd / Math.sqrt(sampleSize)

  // 95%信頼区間 (正規分布近似: ±1.96 * SE)
  const marginOfError = 1.96 * standardError

  return {
    mean: trueMean,
    variance: trueStd * trueStd,
    standardDeviation: trueStd,
    credibleIntervalLower: trueMean - marginOfError,
    credibleIntervalUpper: trueMean + marginOfError,
    sampleSize,
  }
}

/**
 * サンプルサイズ比較用のデータを提供するhook
 * 「サンプル数が増えると不確実性が減る」ことを視覚的に示すためのデータ
 */
export function useAnalysisData() {
  // 比較用のサンプルサイズ一覧
  const sampleSizes = [10, 30, 100, 300, 1000]

  const comparisonData: SampleComparisonData[] = useMemo(() => {
    return sampleSizes.map((size) => ({
      label: `n=${size}`,
      estimation: generateEstimation(size),
    }))
  }, [])

  // 現在選択中のデータ（デフォルトはn=100）
  const currentEstimation = useMemo(() => {
    return generateEstimation(100)
  }, [])

  return {
    comparisonData,
    currentEstimation,
    sampleSizes,
  }
}
