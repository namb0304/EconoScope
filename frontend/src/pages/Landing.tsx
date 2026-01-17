import { useApp } from '../contexts/AppContext'

/**
 * ランディングページ
 * アプリのコンセプトを伝え、体験への導入を行う
 */
function Landing() {
  const { start } = useApp()

  const handleStart = () => {
    start()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-8">
          <span>📊</span>
          <span>教育データ分析ツール</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          その平均点、
          <br />
          <span className="text-blue-600 dark:text-blue-400">どこまで信じていい？</span>
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          テストの平均点が「72点」と出たとき、それは本当に72点なのでしょうか？
          <br />
          サンプル数によって、推定の「信頼性」は大きく変わります。
        </p>

        <button
          onClick={handleStart}
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
        >
          体験してみる
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>

      {/* Feature Cards */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon="🎯"
            title="不確実性を可視化"
            description="推定値だけでなく、その「ばらつき」を視覚的に理解できます"
          />
          <FeatureCard
            icon="📈"
            title="サンプル数の影響"
            description="データ数が変わると推定精度がどう変わるか、体験的に学べます"
          />
          <FeatureCard
            icon="🧠"
            title="意思決定に活かす"
            description="統計的な不確実性を、判断材料としてどう扱うべきかを考えます"
          />
        </div>
      </div>

      {/* Quote Section */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <blockquote className="text-xl text-gray-700 dark:text-gray-300 italic mb-4">
            「推定値そのもの」ではなく
            <br />
            「推定の不確実性を意思決定にどう反映するか」
            <br />
            を体験的に理解する
          </blockquote>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            — EconoScope のコンセプト
          </p>
        </div>
      </div>
    </main>
  )
}

interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}

export default Landing
