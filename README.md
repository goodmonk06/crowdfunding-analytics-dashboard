# Crowdfunding Analytics Dashboard

複数のクラウドファンディングプラットフォームのデータを集約して分析するダッシュボードアプリケーション。

## Overview

このプロジェクトは、Makuake、Campfire、Kickstarterなどの複数のクラウドファンディングプラットフォームのキャンペーンデータを統合管理し、包括的な分析を提供するWebアプリケーションです。

### 主な機能

- **キャンペーン管理**: CRUD操作によるキャンペーンの作成・閲覧・更新・削除
- **ダッシュボード**: 総支援額、支援者数、平均支援額、達成率などの主要指標の可視化
- **コホート分析**: リターン別分析、支援時期別のグルーピング
- **リアルタイムチャート**: Rechartsによる美しいデータ可視化

## Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS** - スタイリング
- **Recharts** - データ可視化

### Backend
- **Next.js API Routes**
- **Prisma** - ORM
- **PostgreSQL** - データベース
- **Zod** - バリデーション

### Development
- **Vitest** - テストフレームワーク
- **Docker** - コンテナ化
- **TypeScript** - 型安全性

## Domain Model

### エンティティとリレーション

```
Campaign (キャンペーン)
├── id: string
├── title: string
├── goalAmount: number
├── startDate: DateTime
├── endDate: DateTime
├── platform: string
├── description?: string
└── Relations:
    ├── backers: Backer[]
    ├── rewards: Reward[]
    └── dailyStats: DailyStats[]

Reward (リターン)
├── id: string
├── name: string
├── price: number
├── description?: string
├── backerCount: number
└── Relations:
    ├── campaign: Campaign
    └── backers: Backer[]

Backer (支援者)
├── id: string
├── amount: number
├── backedAt: DateTime
├── rewardId: string
└── Relations:
    ├── campaign: Campaign
    └── reward: Reward

DailyStats (日別統計)
├── id: string
├── date: Date
├── backers: number
├── totalAmount: number
├── cumulativeAmount: number
├── cumulativeBackers: number
└── Relations:
    └── campaign: Campaign
```

## Getting Started

### Requirements

- **Node.js**: 18.17以上
- **Docker**: 20.10以上（オプション）
- **PostgreSQL**: 14以上（ローカル開発の場合）

### セットアップ手順

#### 1. リポジトリのクローン

```bash
git clone https://github.com/goodmonk06/crowdfunding-analytics-dashboard.git
cd crowdfunding-analytics-dashboard
```

#### 2. 依存関係のインストール

```bash
npm install
```

#### 3. 環境変数の設定

```bash
cp .env.example .env
```

`.env` ファイルを編集してデータベース接続情報を設定します：

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crowdfunding_db?schema=public"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

#### 4. データベースのセットアップ

##### Option A: Docker Composeを使用（推奨）

```bash
# PostgreSQLとアプリケーションを起動
docker compose up

# アプリケーションは http://localhost:3000 で利用可能
```

Docker Composeが自動的に以下を実行します：
- PostgreSQLコンテナの起動
- データベースマイグレーション
- Seedデータの投入
- アプリケーションの起動

##### Option B: ローカルPostgreSQLを使用

```bash
# Prisma Clientの生成
npm run db:generate

# マイグレーションの実行
npm run db:migrate

# Seedデータの投入
npm run db:seed

# 開発サーバーの起動
npm run dev
```

#### 5. アプリケーションにアクセス

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## Available Scripts

### 開発

```bash
npm run dev          # 開発サーバーを起動
npm run build        # プロダクションビルド
npm run start        # プロダクションサーバーを起動
npm run lint         # ESLintによるコードチェック
```

### テスト

```bash
npm test             # テストを実行
npm run test:watch   # ウォッチモードでテスト実行
```

### データベース

```bash
npm run db:generate       # Prisma Clientを生成
npm run db:migrate        # マイグレーションを実行（開発環境）
npm run db:migrate:deploy # マイグレーションを実行（本番環境）
npm run db:push           # スキーマをデータベースに同期
npm run db:seed           # Seedデータを投入
npm run db:studio         # Prisma Studioを起動
npm run db:reset          # データベースをリセット
```

## Example Flow - エンドツーエンドの使用例

以下は、Campaign（キャンペーン）の完全なCRUDフローの例です：

### 1. キャンペーンの作成 (Create)

```bash
# ブラウザで http://localhost:3000/campaigns にアクセス
# 「新規作成」ボタンをクリック
```

または、APIを直接呼び出す：

```bash
curl -X POST http://localhost:3000/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "title": "革新的なスマートウォッチ",
    "goalAmount": 5000000,
    "startDate": "2025-10-01T00:00:00Z",
    "endDate": "2025-12-31T00:00:00Z",
    "platform": "Makuake",
    "description": "最新技術を搭載したスマートウォッチ"
  }'
```

### 2. キャンペーン一覧の取得 (List)

```bash
curl http://localhost:3000/api/campaigns?page=1&limit=10
```

### 3. キャンペーン詳細の取得 (Read)

```bash
curl http://localhost:3000/api/campaigns/{campaign_id}
```

### 4. キャンペーンの更新 (Update)

```bash
curl -X PATCH http://localhost:3000/api/campaigns/{campaign_id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新されたタイトル",
    "goalAmount": 6000000
  }'
```

### 5. キャンペーンの削除 (Delete)

```bash
curl -X DELETE http://localhost:3000/api/campaigns/{campaign_id}
```

### デモデータ

Seedスクリプトを実行すると、以下のデモデータが投入されます：

- **3つのキャンペーン**
  - 革新的なスマートウォッチ開発プロジェクト (Makuake)
  - エコフレンドリーな水筒プロジェクト (Campfire)
  - 次世代ノートPCスタンド (Readyfor)
- **8つのリターン**
- **30件の支援データ**
- **日別統計データ**

デモデータを確認するには：

1. [http://localhost:3000/campaigns](http://localhost:3000/campaigns) - キャンペーン一覧
2. 任意のキャンペーンをクリック - 詳細ページで支援データ、リターン、チャートを確認

## Project Structure

```
crowdfunding-analytics-dashboard/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   ├── campaigns/          # Campaign CRUD API
│   │   ├── rewards/            # Reward API
│   │   └── backers/            # Backer API
│   ├── campaigns/              # キャンペーン管理ページ
│   │   ├── [id]/              # キャンペーン詳細
│   │   └── new/               # キャンペーン作成
│   ├── dashboard/              # ダッシュボードページ
│   ├── cohorts/                # コホート分析ページ
│   ├── layout.tsx              # ルートレイアウト
│   ├── page.tsx                # ホームページ
│   └── globals.css             # グローバルCSS
├── components/                  # 再利用可能なUIコンポーネント
│   ├── Card.tsx                # カードコンポーネント
│   └── ChartWrapper.tsx        # チャートラッパー
├── lib/                         # ユーティリティとヘルパー
│   ├── types.ts                # TypeScript型定義
│   ├── utils.ts                # ユーティリティ関数
│   ├── validations.ts          # Zodバリデーションスキーマ
│   ├── api-response.ts         # APIレスポンスヘルパー
│   └── prisma.ts               # Prismaクライアント
├── prisma/                      # Prisma設定
│   ├── schema.prisma           # データベーススキーマ
│   └── seed.ts                 # Seedスクリプト
├── __tests__/                   # テストファイル
│   └── lib/                    # ライブラリのテスト
├── data/                        # 静的データファイル
│   └── sample-campaign.json    # サンプルデータ
├── docker-compose.yml           # Docker Compose設定
├── Dockerfile                   # Docker設定
└── vitest.config.ts            # Vitest設定
```

## API Endpoints

### Campaigns

- `GET /api/campaigns` - キャンペーン一覧取得
  - Query params: `page`, `limit`, `platform`
- `POST /api/campaigns` - キャンペーン作成
- `GET /api/campaigns/[id]` - キャンペーン詳細取得
- `PATCH /api/campaigns/[id]` - キャンペーン更新
- `DELETE /api/campaigns/[id]` - キャンペーン削除

### Rewards

- `POST /api/rewards` - リターン作成

### Backers

- `POST /api/backers` - 支援者作成

## Testing

テストフレームワークとしてVitestを使用しています。

```bash
# 全テストを実行
npm test

# ウォッチモードでテスト実行
npm run test:watch
```

テストファイルは `__tests__/` ディレクトリに配置されています。

主なテスト：
- ユーティリティ関数のテスト (`__tests__/lib/utils.test.ts`)
- バリデーションのテスト (`__tests__/lib/validations.test.ts`)

## Future Extensions

現在実装済みの機能に加え、以下の拡張を予定しています：

### 短期的な拡張

- [ ] **認証・認可**: NextAuth.jsによるユーザー認証
- [ ] **ダッシュボードのカスタマイズ**: ユーザーごとのダッシュボード設定
- [ ] **エクスポート機能**: CSV、PDF形式でのデータエクスポート
- [ ] **リアルタイム更新**: WebSocketによるリアルタイムデータ更新

### 中期的な拡張

- [ ] **外部API連携**:
  - Makuake API連携
  - Campfire API連携
  - Kickstarter API連携
- [ ] **ETLスクリプト**: 定期的なデータ同期
- [ ] **アラート機能**: 目標達成率に基づくアラート通知
- [ ] **複数キャンペーン比較**: キャンペーン間のパフォーマンス比較

### 長期的な拡張

- [ ] **機械学習による予測**: 支援額の予測モデル
- [ ] **モバイルアプリ**: React Native版の開発
- [ ] **マルチテナント対応**: 複数組織のサポート
- [ ] **高度な分析機能**:
  - RFM分析
  - クラスター分析
  - チャーン予測

## Database Migrations

新しいマイグレーションを作成する場合：

```bash
# スキーマを変更後、以下を実行
npm run db:migrate

# マイグレーション名を指定する場合
npx prisma migrate dev --name add_new_field
```

本番環境へのデプロイ時：

```bash
npm run db:migrate:deploy
```

## Docker Deployment

### 開発環境

```bash
docker compose up
```

### 本番環境

```bash
docker compose -f docker-compose.prod.yml up -d
```

## Contributing

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## License

MIT

## Support

問題が発生した場合は、GitHubのIssuesページで報告してください。

---

**Note**: このプロジェクトは現在Phase 2のレベルにあり、本番利用に向けて継続的に改善されています。
