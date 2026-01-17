import { createContext, useContext, useState, ReactNode } from 'react'

/**
 * シナリオ定義
 * 各シナリオはサンプルサイズと表示設定を持つ
 */
export type ScenarioType = 'small-test' | 'midterm' | 'grade-wide'

export interface ScenarioConfig {
  id: ScenarioType
  label: string
  description: string
  sampleSize: number
  icon: string
}

export const SCENARIOS: Record<ScenarioType, ScenarioConfig> = {
  'small-test': {
    id: 'small-test',
    label: '小テスト',
    description: '少人数クラスの小テスト',
    sampleSize: 20,
    icon: '🧪',
  },
  'midterm': {
    id: 'midterm',
    label: '中間試験',
    description: '1クラス分の定期試験',
    sampleSize: 100,
    icon: '📝',
  },
  'grade-wide': {
    id: 'grade-wide',
    label: '学年全体',
    description: '学年全体の統一テスト',
    sampleSize: 300,
    icon: '🏫',
  },
}

/**
 * 問い（分析の目的）定義
 */
export type QuestionType = 'reliability' | 'sample-effect' | 'small-sample'

export interface QuestionConfig {
  id: QuestionType
  label: string
  description: string
}

export const QUESTIONS: Record<QuestionType, QuestionConfig> = {
  'reliability': {
    id: 'reliability',
    label: '推定の信頼性',
    description: 'この平均点の推定は、どれくらい信頼できる？',
  },
  'sample-effect': {
    id: 'sample-effect',
    label: 'サンプル数の影響',
    description: 'サンプル数が変わると、推定の精度はどう変わる？',
  },
  'small-sample': {
    id: 'small-sample',
    label: '少人数の判断',
    description: '少人数のデータで判断しても大丈夫？',
  },
}

/**
 * アプリ全体の状態
 */
interface AppState {
  started: boolean
  scenario: ScenarioType | null
  question: QuestionType | null
  currentStep: 1 | 2 | 3
}

interface AppContextType extends AppState {
  start: () => void
  setScenario: (scenario: ScenarioType) => void
  setQuestion: (question: QuestionType) => void
  reset: () => void
  goToStep: (step: 1 | 2 | 3) => void
}

const initialState: AppState = {
  started: false,
  scenario: null,
  question: null,
  currentStep: 1,
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState)

  const start = () => {
    setState((prev) => ({ ...prev, started: true }))
  }

  const setScenario = (scenario: ScenarioType) => {
    setState((prev) => ({ ...prev, scenario, currentStep: 2 }))
  }

  const setQuestion = (question: QuestionType) => {
    setState((prev) => ({ ...prev, question, currentStep: 3 }))
  }

  const reset = () => {
    setState(initialState)
  }

  const goToStep = (step: 1 | 2 | 3) => {
    setState((prev) => ({ ...prev, currentStep: step }))
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        start,
        setScenario,
        setQuestion,
        reset,
        goToStep,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
