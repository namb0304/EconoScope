import { useCallback } from 'react'
import type { SampleComparisonData } from '../../types/analysis'
import { cardStyles } from '../../lib/styles'

interface SampleComparisonProps {
  data: SampleComparisonData[]
}

// グラフの表示範囲（コンポーネント外で定義して再生成を防ぐ）
const CHART_MIN = 50
const CHART_MAX = 100
const CHART_RANGE = CHART_MAX - CHART_MIN

/**
 * サンプル数による不確実性の違いを比較表示するコンポーネント
 * 「サンプル数が増えると信頼区間が狭くなる」ことを直感的に示す
 */
function SampleComparison({ data }: SampleComparisonProps) {
  // パーセンテージ変換関数（メモ化）
  const toPercent = useCallback(
    (value: number) => ((value - CHART_MIN) / CHART_RANGE) * 100,
    []
  )

  return (
    <div className={cardStyles.full}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        サンプル数と不確実性の関係
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        サンプル数が増えると、推定の信頼区間が狭くなります
      </p>

      {/* 比較グラフ */}
      <div className="space-y-4">
        {data.map((item) => {
          const { estimation } = item
          const meanPercent = toPercent(estimation.mean)
          const lowerPercent = toPercent(estimation.credibleIntervalLower)
          const upperPercent = toPercent(estimation.credibleIntervalUpper)
          const intervalWidth = upperPercent - lowerPercent

          return (
            <div key={item.label} className="flex items-center gap-4">
              {/* ラベル */}
              <div className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300 text-right">
                {item.label}
              </div>

              {/* バー */}
              <div className="flex-1 relative h-8">
                {/* 背景 */}
                <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded" />

                {/* 信頼区間 */}
                <div
                  className="absolute h-full bg-blue-200 dark:bg-blue-900/60 rounded transition-all duration-300"
                  style={{
                    left: `${Math.max(0, lowerPercent)}%`,
                    width: `${Math.min(100, intervalWidth)}%`,
                  }}
                />

                {/* 平均値マーカー */}
                <div
                  className="absolute h-full w-1 bg-blue-600 dark:bg-blue-400 rounded transition-all duration-300"
                  style={{
                    left: `${meanPercent}%`,
                    transform: 'translateX(-50%)',
                  }}
                />
              </div>

              {/* 信頼区間の幅 */}
              <div className="w-24 text-right">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ±{((estimation.credibleIntervalUpper - estimation.mean)).toFixed(1)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* 軸ラベル */}
      <div className="flex items-center gap-4 mt-4">
        <div className="w-20" />
        <div className="flex-1 flex justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>{CHART_MIN}</span>
          <span>{(CHART_MIN + CHART_MAX) / 2}</span>
          <span>{CHART_MAX}</span>
        </div>
        <div className="w-24" />
      </div>

      {/* 凡例 */}
      <div className="mt-6 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded" />
          <span className="text-gray-600 dark:text-gray-400">平均値</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-3 bg-blue-200 dark:bg-blue-900/60 rounded" />
          <span className="text-gray-600 dark:text-gray-400">95%信頼区間</span>
        </div>
      </div>

      {/* 教育的な補足 */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <strong>ポイント:</strong> 同じ母集団からサンプリングしても、
          サンプル数が少ないと推定値の不確実性（ばらつき）が大きくなります。
          標準誤差は <code className="px-1 bg-gray-200 dark:bg-gray-600 rounded">σ/√n</code> で計算され、
          nが大きくなると小さくなります。
        </p>
      </div>
    </div>
  )
}

export default SampleComparison
