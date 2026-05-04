# デザインガイド

## カラーパレット

`tailwind.config.js` に定義されたカスタムカラーと用途。

| トークン名       | カラーコード | 用途                                                   |
| ---------------- | ------------ | ------------------------------------------------------ |
| `background`     | `#F5F5F5`    | 全画面の背景色                                         |
| `card`           | `#FFFFFF`    | カードコンポーネントの背景色                           |
| `paypay`         | `#FF0033`    | PayPayボタン・AppLogo のブランドカラー                 |
| `primary`        | `#2196F3`    | プライマリボタン・FAB・フォーカスリング・メンバー1の色  |
| `primary-dark`   | `#1976D2`    | プライマリボタンのホバー状態                           |
| `primary-darker` | `#1565C0`    | プライマリボタンのアクティブ状態                       |
| `amount`         | `#111111`    | 未完了カードの金額・タイトルテキスト                   |
| `done`           | `#AAAAAA`    | 完了済みカードのテキスト色（予約定義）                 |
| `swipe-complete` | `#4CAF50`    | 左スワイプ（完了操作）時のビジュアルフィードバック背景 |

### コード内直書きカラー（tailwind トークン外）

| カラーコード | 用途                                     |
| ------------ | ---------------------------------------- |
| `#F44336`    | メンバー2のカード縁色・削除ボタン背景    |
| `#E0E0E0`    | creatorId=null 時のカード縁色（グレー）  |
| `#EF4444`    | 右スワイプ削除エリア背景                 |
| `#3B82F6`    | 右スワイプ編集エリア背景                 |
| `#16a34a`    | バナー（save/success/complete）のアクセント色 |
| `#6b7280`    | バナー（delete/info）のアクセント色      |
| `#ef4444`    | バナー（error）のアクセント色            |
| `#1B5E20`    | トースト（success/complete）背景         |
| `#B71C1C`    | トースト（delete）背景                   |
| `#37474F`    | トースト（error）背景                    |
| `#4CAF50`    | 完了済みカードの左ボーダー色（緑）       |

---

## タイポグラフィ

Tailwind デフォルトフォントスタック（sans-serif）を使用。カスタムフォントは未定義。

| 用途                         | クラス                              |
| ---------------------------- | ----------------------------------- |
| AppLogo（lg）                | `text-3xl font-bold`                |
| AppLogo（md）                | `text-xl font-bold`                 |
| AppLogo（sm）                | `text-base font-bold`               |
| ページ見出し（h1）           | `text-2xl font-bold`                |
| ルームページ副見出し         | `text-lg font-semibold`             |
| カードタイトル               | `text-base font-medium`             |
| 金額（未完了・完了カード）   | `text-3xl font-bold`                |
| ボタンテキスト               | `text-base font-bold` または `text-sm font-medium` |
| 日時・メタ情報               | `text-xs text-gray-400`             |
| 履歴セクションラベル         | `text-xs font-semibold text-gray-400 uppercase tracking-wider` |
| エラーメッセージ             | `text-xs text-red-500`              |

---

## スペーシング規則

### カード内パディング

- 未完了カード・完了カード本体: `p-4`（16px）
- カード左縁ボーダー幅: `4px`（固定値）
- カード角丸: `rounded-lg`

### セクション間マージン

- ページ全体のコンテナ: `px-4 py-6`
- カードリスト間隔: `space-y-3`
- ヘッダー下マージン: `mb-4`
- 金額テキスト上下マージン: `my-4`
- 履歴セクション上マージン: `mt-8`
- フォームフィールド間: `mb-3` または `mb-4`

### 最大幅

- 全ページのコンテンツ: `max-w-md mx-auto`（最大幅 448px、中央揃え）
- ようこそ画面・作成画面: `max-w-sm`（最大幅 384px）

### FAB（フローティングアクションボタン）

- サイズ: `w-14 h-14`（56px）
- 位置: `fixed bottom-6 right-6`

---

## アニメーション仕様

ライブラリ: `framer-motion`

### 画面遷移（App.tsx）

```
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.2 }}
```

### カード初期表示（PaymentCard）

```
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0, x: 0 }}
transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
```

カードは `index * 0.05s` の staggered 遅延で順次フェードイン。

### カード完了・削除時のフェードアウト（PaymentCard）

```
animate={{ opacity: 0, x: 120 }}
transition={{ duration: 0.3, ease: 'easeIn' }}
```

### EditCard 出現（新規追加時）

```
initial={{ opacity: 0, y: 24 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3, ease: 'easeOut' }}
```

### Banner（通知バナー）

```
initial={{ y: '-100%', opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
exit={{ y: '-100%', opacity: 0 }}
transition={{ type: 'spring', stiffness: 400, damping: 30 }}
```

プログレスバー:
```
initial={{ width: '100%' }}
animate={{ width: '0%' }}
transition={{ duration: 2.5, ease: 'linear' }}
```

### Toast（トースト通知）

```
initial={{ opacity: 0, y: 24 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: 24 }}
transition={{ duration: 0.25 }}
```

### ボタンタップ

```
whileTap={{ scale: 0.95 }}
```

全ての `motion.button` および PayPayリンクに適用。

---

## コンポーネントデザイン原則

### カード

- 背景色: `bg-card`（`#FFFFFF`）
- 角丸: `rounded-lg`
- 影: `shadow-sm`
- 左縁: `4px` 縦ボーダー（作成者カラー or `#E0E0E0`）
- 未完了カード右上: `AlertCircle`（赤、18px）バッジ
- 完了カード右上: 「完了」テキスト + `CircleCheckBig`（緑、16px）バッジ
- 完了カード左縁: `border-l-4 border-green-400`

### ボタン

| 種類             | スタイル                                               |
| ---------------- | ------------------------------------------------------ |
| プライマリ       | `bg-primary text-white rounded-xl py-4 font-bold`      |
| セカンダリ       | `border border-gray-300 text-gray-600 rounded-lg`       |
| PayPayボタン     | `bg-paypay text-white rounded-lg py-3 font-bold`       |
| PayPayボタン無効 | `bg-gray-300 text-gray-400 cursor-not-allowed`         |
| FAB              | `bg-primary text-white rounded-full w-14 h-14 shadow-lg` |

### バナー（Banner）

- 位置: `fixed top-0 left-0 right-0 z-50`（画面上部固定）
- 左側にアクセントカラーの `border-l-4`
- 表示時間: 2.5秒で自動消去
- 右端に閉じるボタン（`X` アイコン）

### ConfirmDialog（確認ダイアログ）

- 背景: `bg-black/40` のオーバーレイ
- カード: `bg-white rounded-xl shadow-xl mx-4 p-6 max-w-xs`
- ボタン2つ（「いいえ」グレー枠・「はい」緑背景）

---

## アイコン使用ガイド（lucide-react）

| アイコン名        | サイズ  | 使用箇所                               |
| ----------------- | ------- | -------------------------------------- |
| `Plus`            | 28px    | FAB（支払い追加ボタン）                |
| `Settings`        | 22px    | ルームページヘッダーの設定遷移ボタン   |
| `CircleCheckBig`  | 14px/16px/18px/32px | 完了スワイプヒント・完了バッジ・バナー・履歴ヘッダー |
| `SquarePen`       | 20px    | 右スワイプ時の編集アクションアイコン   |
| `Trash2`          | 18px/20px | 右スワイプ時の削除アクション・バナー・トースト |
| `AlertCircle`     | 18px    | 未完了カードの右上バッジ               |
| `ClipboardPaste`  | 20px    | EditCard の PayPayURL ペーストボタン   |
| `ChevronDown`     | 16px    | 履歴アコーディオンの開閉インジケーター |
| `ArrowLeft`       | 24px    | SettingsPage の戻るボタン              |
| `Save`            | 18px    | バナー（save/success タイプ）          |
| `WifiOff`         | 18px    | バナー（error タイプ）・トースト       |
| `X`               | 16px    | バナーの閉じるボタン                   |
| `Check`           | 16px/18px | WelcomePage の機能リスト・トースト（success） |
| `CheckCircle2`    | 18px    | トースト（complete タイプ）            |
| `Wallet`          | 40px/48px | RoomPage 空状態・WelcomePage アイコン |
| `ArrowDownRight`  | 14px    | RoomPage 空状態の誘導テキスト          |
| `PlusCircle`      | 20px    | WelcomePage の使い方ステップアイコン   |
| `Share2`          | 20px    | WelcomePage の使い方ステップアイコン   |
| `ListPlus`        | 20px    | WelcomePage の使い方ステップアイコン   |
| `ChevronRight`    | 14px    | WelcomePage の使い方ステップ区切り     |
