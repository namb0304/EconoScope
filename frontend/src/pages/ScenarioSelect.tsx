import { useApp, SCENARIOS } from '../contexts/AppContext'
import type { ScenarioType } from '../contexts/AppContext'
import StepIndicator from '../components/ui/StepIndicator'

/**
 * Step 1: シナリオ選択ページ
 * 「どんな状況を想定しますか？」
 */
function ScenarioSelect() {
  const { setScenario } = useApp()

  const handleSelect = (scenarioId: ScenarioType) => {
    setScenario(scenarioId)
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <StepIndicator currentStep={1} />

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            どんな状況を想定しますか？
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            分析したいデータの規模を選んでください
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(SCENARIOS).map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              icon={scenario.icon}
              label={scenario.label}
              description={scenario.description}
              sampleSize={scenario.sampleSize}
              onClick={() => handleSelect(scenario.id)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            サンプル数が小さいほど、推定の不確実性は大きくなります
          </p>
        </div>
      </div>
    </main>
  )
}

interface ScenarioCardProps {
  icon: string
  label: string
  description: string
  sampleSize: number
  onClick: () => void
}

function ScenarioCard({
  icon,
  label,
  description,
  sampleSize,
  onClick,
}: ScenarioCardProps) {
  return (
    <button
      onClick={onClick}
      className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all text-left"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {label}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        {description}
      </p>
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          サンプル数
        </span>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          n = {sampleSize}
        </span>
      </div>
    </button>
  )
}

export default ScenarioSelect
