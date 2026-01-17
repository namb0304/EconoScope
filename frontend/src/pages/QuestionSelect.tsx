import { useApp, QUESTIONS, SCENARIOS } from '../contexts/AppContext'
import type { QuestionType } from '../contexts/AppContext'
import StepIndicator from '../components/ui/StepIndicator'

/**
 * Step 2: 問い選択ページ
 * 「何を確かめたいですか？」
 */
function QuestionSelect() {
  const { scenario, setQuestion, goToStep } = useApp()

  const handleSelect = (questionId: QuestionType) => {
    setQuestion(questionId)
  }

  const handleBack = () => {
    goToStep(1)
  }

  // シナリオ未選択の場合のフォールバック
  const selectedScenario = scenario ? SCENARIOS[scenario] : null

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <StepIndicator currentStep={2} />

        {/* 選択中のシナリオ表示 */}
        {selectedScenario && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-2xl">{selectedScenario.icon}</span>
            <span className="text-gray-600 dark:text-gray-400">
              {selectedScenario.label}（n={selectedScenario.sampleSize}）を選択中
            </span>
            <button
              onClick={handleBack}
              className="ml-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              変更
            </button>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            何を確かめたいですか？
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            分析の目的を選んでください
          </p>
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          {Object.values(QUESTIONS).map((question) => (
            <QuestionCard
              key={question.id}
              label={question.label}
              description={question.description}
              onClick={() => handleSelect(question.id)}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

interface QuestionCardProps {
  label: string
  description: string
  onClick: () => void
}

function QuestionCard({ label, description, onClick }: QuestionCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all text-left group"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 group-hover:border-blue-500 dark:group-hover:border-blue-400 group-hover:bg-blue-500 dark:group-hover:bg-blue-400 transition-colors flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-white transition-colors" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {label}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </button>
  )
}

export default QuestionSelect
