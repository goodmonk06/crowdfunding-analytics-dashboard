import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "クラウドファンディング分析ダッシュボード",
  description: "複数クラファンプラットフォームのデータを集約してダッシュボード表示する解析ツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex gap-6">
            <a href="/" className="hover:text-gray-300">ホーム</a>
            <a href="/dashboard" className="hover:text-gray-300">ダッシュボード</a>
            <a href="/cohorts" className="hover:text-gray-300">コホート分析</a>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
