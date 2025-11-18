export default function Home() {
  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold mb-4">クラウドファンディング分析ダッシュボード</h1>
      <p className="text-lg mb-6">
        複数のクラウドファンディングプラットフォームのデータを集約して分析します。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <a
          href="/dashboard"
          className="p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-2">ダッシュボード →</h2>
          <p>総支援額、支援者数、平均支援額、日別推移などを確認できます。</p>
        </a>

        <a
          href="/cohorts"
          className="p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-2">コホート分析 →</h2>
          <p>リターン別の分析や、支援時期別のグルーピングなどを確認できます。</p>
        </a>
      </div>
    </div>
  );
}
