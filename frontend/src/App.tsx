import { AppProvider, useApp } from './contexts/AppContext'
import Header from './components/layout/Header'
import Landing from './pages/Landing'
import ScenarioSelect from './pages/ScenarioSelect'
import QuestionSelect from './pages/QuestionSelect'
import Result from './pages/Result'

/**
 * ステップに応じたページを表示
 */
function AppContent() {
  const { started, currentStep, scenario, question } = useApp()

  // Landingページ（未開始状態）
  if (!started) {
    return <Landing />
  }

  // Step 1: シナリオ選択
  if (currentStep === 1) {
    return <ScenarioSelect />
  }

  // Step 2: 問い選択
  if (currentStep === 2) {
    return <QuestionSelect />
  }

  // Step 3: 結果表示
  if (currentStep === 3 && scenario && question) {
    return <Result />
  }

  // フォールバック
  return <Landing />
}

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <AppContent />
      </div>
    </AppProvider>
  )
}

export default App
