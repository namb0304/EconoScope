import type { EstimationResult } from '../../types/analysis'
import { cardStyles } from '../../lib/styles'

interface UncertaintyChartProps {
  data: EstimationResult
  title?: string
}

/**
 * 単一の推定結果を不確実性付きで表示するコンポーネント
 * 棒グラフ + エラーバー形式で信頼区間を可視化
 */
function UncertaintyChart({ data, title = '推定結果' }: UncertaintyChartProps) {
  // グラフの表示範囲（0-100点想定）
  const minValue = 0
  const maxValue = 100
  const range = maxValue - minValue

  // 各値をパーセンテージに変換
  const meanPercent = ((data.mean - minValue) / range) * 100
  const lowerPercent = ((data.credibleIntervalLower - minValue) / range) * 100
  const upperPercent = ((data.credibleIntervalUpper - minValue) / range) * 100
  const intervalWidth = upperPercent - lowerPercent

  return (
    <div className={cardStyles.full}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>

      {/* グラフエリア */}
      <div className="relative h-32 mb-6">
        {/* 背景グリッド */}
        <div className="absolute inset-0 flex">
          {[0, 25, 50, 75, 100].map((tick) => (
            <div
              key={tick}
              className="flex-1 border-l border-gray-200 dark:border-gray-700 first:border-l-0"
            />
          ))}
        </div>

        {/* 信頼区間バー */}
        <div className="absolute top-1/2 -translate-y-1/2 h-12 w-full">
          {/* 95%信頼区間（薄い色の帯） */}
          <div
            className="absolute h-full bg-blue-200 dark:bg-blue-900/50 rounded"
            style={{
              left: `${lowerPercent}%`,
              width: `${intervalWidth}%`,
            }}
          />

          {/* 平均値（濃い色の線） */}
          <div
            className="absolute h-full w-1 bg-blue-600 dark:bg-blue-400 rounded"
            style={{
              left: `${meanPercent}%`,
              transform: 'translateX(-50%)',
            }}
          />

          {/* エラーバーの端点 */}
          <div
            className="absolute h-full w-0.5 bg-blue-400 dark:bg-blue-500"
            style={{ left: `${lowerPercent}%` }}
          />
          <div
            className="absolute h-full w-0.5 bg-blue-400 dark:bg-blue-500"
            style={{ left: `${upperPercent}%` }}
          />
        </div>

        {/* 軸ラベル */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>

      {/* 数値サマリー */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">下限</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {data.credibleIntervalLower.toFixed(1)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">平均</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {data.mean.toFixed(1)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">上限</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {data.credibleIntervalUpper.toFixed(1)}
          </p>
        </div>
      </div>

      {/* 補足情報 */}
      <p className="mt-4 text-xs text-gray-400 dark:text-gray-500 text-center">
        95%信頼区間 | サンプルサイズ: {data.sampleSize}
      </p>
    </div>
  )
}

export default UncertaintyChart
