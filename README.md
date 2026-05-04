# PayPay+

2人向けの支払い管理アプリ。立替金額と PayPay 宛先の記録をURLを共有するだけで管理できる。ログイン不要。

---

## 技術スタック

- **フロントエンド**: React 18 + Vite 5 + TypeScript 5
- **スタイリング**: Tailwind CSS 3
- **データベース**: Firebase Firestore（リアルタイム同期）
- **ホスティング**: Vercel（ハッシュルーティング、設定不要）
- **アニメーション**: framer-motion 12
- **スワイプ操作**: react-swipeable 7
- **アイコン**: lucide-react 1

---

## セットアップ手順

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. Firebase 設定

`src/lib/firebase.ts` に Firebase プロジェクトの設定を記述する（APIキーは直書き）。

### 3. 環境変数（任意）

本番専用ルームIDを使用する場合は `.env` を作成する:

```
VITE_PROD_ROOM_ID=your_room_id
```

### 4. 開発サーバー起動

```bash
npm run dev
```

### 5. Firestore セキュリティルールのデプロイ

```bash
npm run firebase:deploy-rules
```

---

## デプロイ

### Vercel（フロントエンド）

```bash
# 本番デプロイ
npm run deploy

# プレビューデプロイ
npm run deploy:preview
```

`npm run deploy` は `npm run build && npx vercel --prod` を実行する。

### Firebase（セキュリティルールのみ）

```bash
npm run firebase:deploy-rules
```

---

## ディレクトリ構成

```
paypayplus/
├── src/
│   ├── App.tsx              # ルートコンポーネント（ハッシュルーティング）
│   ├── main.tsx             # エントリーポイント
│   ├── types.ts             # 共通型定義（Member / Room / Payment）
│   ├── components/          # 再利用コンポーネント
│   │   ├── AppLogo.tsx      # アプリロゴ
│   │   ├── Banner.tsx       # 上部通知バナー
│   │   ├── ConfirmDialog.tsx # 確認ダイアログ
│   │   ├── EditCard.tsx     # 支払い追加・編集フォーム
│   │   ├── HistorySection.tsx # 完了済み履歴アコーディオン
│   │   ├── PaymentCard.tsx  # 未完了支払いカード（スワイプ対応）
│   │   └── Toast.tsx        # 下部トースト通知
│   ├── pages/               # ページコンポーネント
│   │   ├── WelcomePage.tsx  # ようこそ画面（/）
│   │   ├── CreateRoomPage.tsx # ルーム作成画面（/#create）
│   │   ├── ShareLinkPage.tsx  # 共有リンク画面（/#share/{roomId}）
│   │   ├── SettingsPage.tsx   # メンバー編集画面（/#settings/{roomId}）
│   │   ├── RoomPage.tsx       # ルームダッシュボード（/#{roomId}）
│   │   └── NotFoundPage.tsx   # 404ページ
│   └── lib/                 # ユーティリティ
│       ├── firebase.ts      # Firebase 初期化
│       ├── firestore.ts     # Firestore CRUD・リアルタイム購読
│       ├── routing.ts       # ハッシュルーティング・ルームID生成
│       └── dateUtils.ts     # 日付分類・フォーマット
├── specs/
│   ├── spec.md              # 機能仕様・画面仕様・データ構造
│   └── sprints.md           # スプリント計画（Sprint 1〜11）
├── docs/
│   ├── design.md            # デザインガイド（カラー・アニメーション等）
│   ├── api.md               # API・データ仕様（Firestore・関数シグネチャ）
│   └── component-guide.md   # コンポーネント・ページ・ルーティング仕様
├── firestore.rules          # Firestore セキュリティルール
├── tailwind.config.js       # Tailwind カスタムカラー定義
└── package.json
```

---

## ドキュメント

| ファイル                       | 内容                                           |
| ------------------------------ | ---------------------------------------------- |
| [docs/design.md](docs/design.md) | カラーパレット・タイポグラフィ・アニメーション・アイコン一覧 |
| [docs/api.md](docs/api.md)       | Firestore データ構造・関数シグネチャ・セキュリティルール |
| [docs/component-guide.md](docs/component-guide.md) | コンポーネント・ページ・ルーティング・状態管理 |
| [specs/spec.md](specs/spec.md)   | 機能仕様・画面仕様・データ構造                 |
| [specs/sprints.md](specs/sprints.md) | スプリント計画（Sprint 1〜11）             |
