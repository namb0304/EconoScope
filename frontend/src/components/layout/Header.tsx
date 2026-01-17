import { useState, useRef, useEffect } from 'react'
import { useApp, SCENARIOS } from '../../contexts/AppContext'
import type { ScenarioType } from '../../contexts/AppContext'

// シナリオリストをコンポーネント外で定数化（再生成を防ぐ）
const SCENARIO_LIST = Object.values(SCENARIOS)

function Header() {
  const { started, scenario, currentStep, reset, goToStep, setScenario } = useApp()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLogoClick = () => {
    reset()
  }

  const handleBack = () => {
    if (currentStep === 3) {
      goToStep(2)
    } else if (currentStep === 2) {
      goToStep(1)
    }
  }

  const handleScenarioChange = (newScenario: ScenarioType) => {
    setScenario(newScenario)
    setIsDropdownOpen(false)
  }

  const selectedScenario = scenario ? SCENARIOS[scenario] : null

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 左側: ロゴ + 戻るボタン */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ES</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                EconoScope
              </h1>
            </button>

            {/* 戻るボタン（Step 2, 3で表示） */}
            {started && currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                戻る
              </button>
            )}
          </div>

          {/* 右側: シナリオ選択ドロップダウン */}
          <div className="flex items-center gap-4">
            {started && selectedScenario && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-4 px-5 py-2.5 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-xl transition-colors"
                >
                  <span className="text-3xl">{selectedScenario.icon}</span>
                  <div className="text-left">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {selectedScenario.label}
                    </div>
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      サンプル数 n={selectedScenario.sampleSize}
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-blue-500 dark:text-blue-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* ドロップダウンメニュー */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        シナリオを変更
                      </span>
                    </div>
                    {SCENARIO_LIST.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleScenarioChange(s.id)}
                        className={`w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                          scenario === s.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                        }`}
                      >
                        <span className="text-2xl">{s.icon}</span>
                        <div className="text-left flex-1">
                          <div className={`text-base font-semibold ${
                            scenario === s.id
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {s.label}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            n={s.sampleSize}
                          </div>
                        </div>
                        {scenario === s.id && (
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!started && (
              <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                統計的不確実性を可視化する教育ツール
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
