import Card from '../components/ui/Card'

// Mock data
const kpiData = [
  { title: '平均スコア', value: '78.5', subtitle: '前月比 +2.3%' },
  { title: 'サンプル数', value: '1,234', subtitle: '今月の登録数' },
  { title: 'アクティブユーザー', value: '892', subtitle: '過去30日間' },
  { title: '完了率', value: '94.2%', subtitle: '目標: 90%' },
]

function Dashboard() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h2>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          教育データの概要を確認できます
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.map((item) => (
          <Card
            key={item.title}
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
          />
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            スコア推移
          </h3>
          <div className="h-64 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400 dark:text-gray-500">
              グラフ表示エリア
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            カテゴリ別分布
          </h3>
          <div className="h-64 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400 dark:text-gray-500">
              グラフ表示エリア
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Dashboard
