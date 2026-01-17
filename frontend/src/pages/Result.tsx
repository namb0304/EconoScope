import { useMemo } from 'react'
import { useApp, SCENARIOS, QUESTIONS } from '../contexts/AppContext'
import StepIndicator from '../components/ui/StepIndicator'
import UncertaintyChart from '../components/charts/UncertaintyChart'
import SampleComparison from '../components/charts/SampleComparison'
import ReliabilityIndicator from '../components/ui/ReliabilityIndicator'
import { useAnalysisData } from '../hooks/useAnalysisData'

/**
 * Step 3: 結果表示ページ
 * 選択されたシナリオと問いに応じたグラフを表示
 */
function Result() {
  const { scenario, question, reset, goToStep } = useApp()
  const { generateEstimation, comparisonData } = useAnalysisData()

  const selectedScenario = scenario ? SCENARIOS[scenario] : null
  const selectedQuestion = question ? QUESTIONS[question] : null

  // 選択されたシナリオに基づく推定結果
  const estimation = useMemo(() => {
    if (!selectedScenario) return null
    return generateEstimation(selectedScenario.sampleSize)
  }, [selectedScenario, generateEstimation])

  const handleRestart = () => {
    reset()
  }

  const handleChangeQuestion = () => {
    goToStep(2)
  }

  if (!selectedScenario || !selectedQuestion || !estimation) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <StepIndicator currentStep={3} />

        {/* 分析の問い表示 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {selectedQuestion.label}
            </span>
            <span className="text-gray-400 dark:text-gray-500">―</span>
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              {selectedQuestion.description}
            </span>
          </div>
        </div>

        {/* 信頼度インジケーター */}
        <div className="mb-8">
          <ReliabilityIndicator sampleSize={selectedScenario.sampleSize} />
        </div>

        {/* 問いに応じたコンテンツ */}
        {question === 'reliability' && (
          <ReliabilityContent estimation={estimation} scenario={selectedScenario} />
        )}
        {question === 'sample-effect' && (
          <SampleEffectContent comparisonData={comparisonData} />
        )}
        {question === 'small-sample' && (
          <SmallSampleContent estimation={estimation} scenario={selectedScenario} comparisonData={comparisonData} />
        )}

        {/* アクションボタン */}
        <div className="flex justify-center gap-4 mt-12">
          <button
            onClick={handleChangeQuestion}
            className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            別の問いを選ぶ
          </button>
          <button
            onClick={handleRestart}
            className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
          >
            最初からやり直す
          </button>
        </div>
      </div>
    </main>
  )
}

// =============================================================================
// 問いごとのコンテンツコンポーネント
// =============================================================================

interface ContentProps {
  estimation: ReturnType<ReturnType<typeof useAnalysisData>['generateEstimation']>
  scenario: (typeof SCENARIOS)[keyof typeof SCENARIOS]
}

interface SampleEffectContentProps {
  comparisonData: ReturnType<typeof useAnalysisData>['comparisonData']
}

/** 問い1: 推定の信頼性 */
function ReliabilityContent({ estimation, scenario }: ContentProps) {
  const marginOfError = estimation.credibleIntervalUpper - estimation.mean

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UncertaintyChart
          data={estimation}
          title={`${scenario.label}の推定結果`}
        />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            この結果をどう読む？
          </h3>
          <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <p>
              {scenario.sampleSize}人のデータから推定した平均点は
              <strong className="text-blue-600 dark:text-blue-400"> {estimation.mean.toFixed(1)}点</strong>
              です。
            </p>
            <p>
              ただし、これは「推定値」であり、真の平均は
              <strong> {estimation.credibleIntervalLower.toFixed(1)}点 〜 {estimation.credibleIntervalUpper.toFixed(1)}点</strong>
              の範囲にある可能性が95%です。
            </p>
            <p>
              つまり、<strong>±{marginOfError.toFixed(1)}点</strong>の誤差を見込む必要があります。
            </p>
          </div>
        </div>
      </div>

      <InsightBox
        title="ポイント"
        content={`サンプルサイズ n=${scenario.sampleSize} の場合、標準誤差は約 ${(estimation.standardDeviation / Math.sqrt(scenario.sampleSize)).toFixed(2)} です。これが信頼区間の幅を決定しています。`}
      />
    </div>
  )
}

/** 問い2: サンプル数の影響 */
function SampleEffectContent({ comparisonData }: SampleEffectContentProps) {
  return (
    <div className="space-y-8">
      <SampleComparison data={comparisonData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightBox
          title="観察してみよう"
          content="n=10 と n=1000 の信頼区間の幅を比べてみてください。サンプル数が100倍になると、信頼区間の幅は約1/10になります。"
        />
        <InsightBox
          title="数学的背景"
          content="標準誤差 = σ/√n なので、サンプル数を4倍にすると標準誤差は半分になります。これが「大数の法則」の直感的な理解につながります。"
        />
      </div>
    </div>
  )
}

/** 問い3: 少人数の判断 */
function SmallSampleContent({ estimation, scenario, comparisonData }: ContentProps & SampleEffectContentProps) {
  const isSmallSample = scenario.sampleSize < 50

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UncertaintyChart
          data={estimation}
          title={`${scenario.label}の推定結果`}
        />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {isSmallSample ? '少人数データの限界' : 'このデータ規模なら'}
          </h3>
          <div className="space-y-4 text-gray-600 dark:text-gray-300">
            {isSmallSample ? (
              <>
                <p>
                  n={scenario.sampleSize} は統計的に「少ない」サンプルです。
                </p>
                <p>
                  信頼区間が <strong>±{(estimation.credibleIntervalUpper - estimation.mean).toFixed(1)}点</strong> と広いため、
                  「平均点は70点台」程度の粗い判断にとどめるべきです。
                </p>
                <p className="text-amber-600 dark:text-amber-400">
                  このデータだけで重要な意思決定をするのは危険です。
                </p>
              </>
            ) : (
              <>
                <p>
                  n={scenario.sampleSize} は十分なサンプルサイズです。
                </p>
                <p>
                  信頼区間が <strong>±{(estimation.credibleIntervalUpper - estimation.mean).toFixed(1)}点</strong> と比較的狭く、
                  推定値はある程度信頼できます。
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <SampleComparison data={comparisonData} />

      <InsightBox
        title="意思決定への示唆"
        content={isSmallSample
          ? "少人数クラスの成績で「今年は例年より悪い」と判断するのは早計です。ばらつきが大きいため、偶然の範囲内かもしれません。"
          : "このサンプルサイズであれば、前年度との比較や他クラスとの比較に一定の意味があります。ただし、信頼区間は常に意識しましょう。"
        }
      />
    </div>
  )
}

// =============================================================================
// 共通コンポーネント
// =============================================================================

interface InsightBoxProps {
  title: string
  content: string
}

function InsightBox({ title, content }: InsightBoxProps) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
      <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
        {title}
      </h4>
      <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
        {content}
      </p>
    </div>
  )
}

export default Result
