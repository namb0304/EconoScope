import { useApp } from '../../contexts/AppContext'

function Header() {
  const { reset } = useApp()

  const handleLogoClick = () => {
    reset()
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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
          <div className="text-sm text-gray-500 dark:text-gray-400">
            統計的不確実性を可視化する教育ツール
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
