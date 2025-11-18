# crowdfunding-analytics-dashboard

複数クラファンプラットフォームのデータを集約してダッシュボード表示する解析ツール。

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Visualization**: Recharts
- **Date Utilities**: date-fns
- **Future**: PostgreSQL, ETLスクリプト(Node)

## Features

### 現在実装済み

- **ダッシュボード** (`/dashboard`)
  - 総支援額、支援者数、平均支援額、達成率の表示
  - 日別支援額推移チャート（折れ線グラフ）
  - 累積支援額推移チャート
  - 日別支援者数（棒グラフ）
  - 累積支援者数推移

- **コホート分析** (`/cohorts`)
  - リターン別支援額・支援者数の分析
  - リターン別詳細テーブル
  - 週別支援額・平均支援額の分析
  - 週別詳細テーブル

- **ダミーデータ**
  - `data/sample-campaign.json` からデータを読み込み

## Getting Started

### 前提条件

- Node.js 18.17以上

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く。

### ビルド

```bash
npm run build
npm start
```

## プロジェクト構造

```
crowdfunding-analytics-dashboard/
├── app/                      # Next.js App Router
│   ├── dashboard/           # ダッシュボードページ
│   ├── cohorts/             # コホート分析ページ
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # ホームページ
│   └── globals.css          # グローバルCSS
├── components/              # 再利用可能なUIコンポーネント
│   ├── Card.tsx            # カードコンポーネント
│   └── ChartWrapper.tsx    # チャートラッパーコンポーネント
├── lib/                     # ユーティリティとヘルパー
│   ├── types.ts            # TypeScript型定義
│   └── utils.ts            # ユーティリティ関数
├── data/                    # データファイル
│   └── sample-campaign.json # サンプルキャンペーンデータ
└── public/                  # 静的ファイル
```

## 将来のAPI連携の想定

現在はJSONファイルからデータを読み込んでいますが、将来的には以下のような拡張を想定しています。

### 1. API Routes の実装

Next.js API Routes を使用して、バックエンドAPIを実装します。

```typescript
// app/api/campaigns/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // データベースまたは外部APIからデータを取得
  const campaign = await fetchCampaignData(params.id);
  return Response.json(campaign);
}
```

### 2. 外部クラウドファンディングプラットフォームAPIとの連携

以下のプラットフォームのAPIと連携することを想定：

#### Makuake API（想定）
```typescript
// lib/integrations/makuake.ts
export async function fetchMakuakeProject(projectId: string) {
  const response = await fetch(`https://api.makuake.com/v1/projects/${projectId}`);
  return transformMakuakeData(await response.json());
}
```

#### Campfire API（想定）
```typescript
// lib/integrations/campfire.ts
export async function fetchCampfireProject(projectId: string) {
  const response = await fetch(`https://api.camp-fire.jp/v1/projects/${projectId}`);
  return transformCampfireData(await response.json());
}
```

#### Kickstarter API
```typescript
// lib/integrations/kickstarter.ts
export async function fetchKickstarterProject(projectId: string) {
  const response = await fetch(`https://api.kickstarter.com/v1/projects/${projectId}`);
  return transformKickstarterData(await response.json());
}
```

### 3. データ標準化レイヤー

各プラットフォームのデータ構造を共通の `Campaign` 型に変換する：

```typescript
// lib/integrations/transformer.ts
export interface PlatformAdapter {
  fetchProject(projectId: string): Promise<any>;
  transform(data: any): Campaign;
}

export function createAdapter(platform: string): PlatformAdapter {
  switch (platform) {
    case 'makuake':
      return new MakuakeAdapter();
    case 'campfire':
      return new CampfireAdapter();
    case 'kickstarter':
      return new KickstarterAdapter();
    default:
      throw new Error(`Unknown platform: ${platform}`);
  }
}
```

### 4. データベース統合（PostgreSQL）

ETLスクリプトで定期的にデータを取得し、データベースに保存：

```typescript
// scripts/etl/sync-campaigns.ts
export async function syncCampaigns() {
  const campaigns = await fetchAllCampaigns();

  for (const campaign of campaigns) {
    await db.campaigns.upsert({
      where: { id: campaign.id },
      update: campaign,
      create: campaign,
    });
  }
}
```

### 5. 認証・認可

プラットフォームAPIへのアクセスに必要な認証情報の管理：

```typescript
// lib/auth/platform-credentials.ts
export function getPlatformCredentials(platform: string) {
  return {
    apiKey: process.env[`${platform.toUpperCase()}_API_KEY`],
    apiSecret: process.env[`${platform.toUpperCase()}_API_SECRET`],
  };
}
```

### 6. キャッシング戦略

API呼び出しの負荷を減らすため、Next.jsのキャッシング機能を活用：

```typescript
// app/api/campaigns/[id]/route.ts
export const revalidate = 3600; // 1時間ごとに再検証

export async function GET(request: Request) {
  // キャッシュされたデータまたは新しいデータを返す
}
```

### 環境変数の例

```env
# .env.local
MAKUAKE_API_KEY=your_api_key_here
CAMPFIRE_API_KEY=your_api_key_here
KICKSTARTER_API_KEY=your_api_key_here

DATABASE_URL=postgresql://user:password@localhost:5432/crowdfunding_db
```

## 開発ロードマップ

- [x] 基本的なダッシュボードUI
- [x] ダミーデータでの可視化
- [ ] API Routes の実装
- [ ] 外部APIとの連携（Makuake）
- [ ] PostgreSQLデータベースの統合
- [ ] ETLスクリプトの実装
- [ ] 複数キャンペーンの比較機能
- [ ] リアルタイム更新機能
- [ ] エクスポート機能（CSV、PDF）

## License

MIT
