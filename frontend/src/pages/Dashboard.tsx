import Card from '../components/ui/Card'
import UncertaintyChart from '../components/charts/UncertaintyChart'
import SampleComparison from '../components/charts/SampleComparison'
import { useAnalysisData } from '../hooks/useAnalysisData'

// Mock KPI data（将来的にはAPIから取得）
const kpiData = [
  { title: '平均スコア', value: '75.0', subtitle: '推定値' },
  { title: 'サンプル数', value: '100', subtitle: '現在のデータ' },
  { title: '標準偏差', value: '15.0', subtitle: '母集団推定' },
  { title: '95%信頼区間', value: '±2.9', subtitle: '推定精度' },
]

function Dashboard() {
  const { comparisonData, currentEstimation } = useAnalysisData()

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h2>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          教育データの不確実性を可視化します
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

      {/* Uncertainty Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 現在の推定結果 */}
        <UncertaintyChart
          data={currentEstimation}
          title="現在の推定結果（n=100）"
        />

        {/* サンプル数比較 */}
        <SampleComparison data={comparisonData} />
      </div>

      {/* 補足説明 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          このダッシュボードについて
        </h3>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300">
            このダッシュボードは、学業成績データの統計的推論における
            <strong>不確実性（Uncertainty）</strong>を可視化しています。
          </p>
          <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
            <li>
              <strong>95%信頼区間</strong>: 真の平均値がこの範囲に含まれる確率が95%
            </li>
            <li>
              <strong>サンプルサイズの影響</strong>: データ数が増えると推定の精度が向上
            </li>
            <li>
              <strong>標準誤差</strong>: σ/√n で計算され、nが大きいほど小さくなる
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}

export default Dashboard
