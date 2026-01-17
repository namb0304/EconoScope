interface ReliabilityIndicatorProps {
  sampleSize: number
}

type ReliabilityLevel = 'high' | 'medium' | 'low'

interface ReliabilityConfig {
  level: ReliabilityLevel
  label: string
  color: string
  bgColor: string
  borderColor: string
  message: string
}

/**
 * サンプルサイズに基づく信頼度を判定
 */
function getReliabilityLevel(sampleSize: number): ReliabilityConfig {
  if (sampleSize >= 100) {
    return {
      level: 'high',
      label: '高い',
      color: 'text-green-700 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      borderColor: 'border-green-300 dark:border-green-700',
      message: 'このサンプルサイズであれば、推定結果は統計的に安定しています。',
    }
  }
  if (sampleSize >= 30) {
    return {
      level: 'medium',
      label: '注意',
      color: 'text-amber-700 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      borderColor: 'border-amber-300 dark:border-amber-700',
      message: '中程度のサンプルサイズです。信頼区間の幅に注意して解釈してください。',
    }
  }
  return {
    level: 'low',
    label: '危険',
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    borderColor: 'border-red-300 dark:border-red-700',
    message: 'サンプルサイズが小さいため、推定結果は不安定です。判断材料として使う際は十分注意してください。',
  }
}

/**
 * 信頼度インジケーター
 * サンプルサイズに応じて推定の信頼性を視覚的に表示
 */
function ReliabilityIndicator({ sampleSize }: ReliabilityIndicatorProps) {
  const config = getReliabilityLevel(sampleSize)

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4 flex items-start gap-4`}
    >
      {/* アイコン */}
      <div className="flex-shrink-0">
        {config.level === 'high' && (
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        {config.level === 'medium' && (
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        )}
        {config.level === 'low' && (
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}
      </div>

      {/* コンテンツ */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-semibold ${config.color}`}>
            統計的信頼度: {config.label}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            (n = {sampleSize})
          </span>
        </div>
        <p className={`text-sm ${config.color} opacity-90`}>
          {config.message}
        </p>
      </div>

      {/* 信頼度バー */}
      <div className="flex-shrink-0 w-24">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 text-right">
          信頼度
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              config.level === 'high'
                ? 'bg-green-500 w-full'
                : config.level === 'medium'
                  ? 'bg-amber-500 w-2/3'
                  : 'bg-red-500 w-1/3'
            }`}
          />
        </div>
      </div>
    </div>
  )
}

export default ReliabilityIndicator
