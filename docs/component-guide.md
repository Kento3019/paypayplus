# コンポーネントガイド

## コンポーネント一覧（src/components/）

### AppLogo

**ファイル**: `src/components/AppLogo.tsx`

**責務**: アプリ名「OKULINK」のロゴ表示。サイズに応じてフォントサイズが変わる。

**Props**:

```typescript
type Props = {
  size?: 'sm' | 'md' | 'lg'  // デフォルト: 'md'
  className?: string
}
```

| size | テキスト   | バッジサイズ |
| ---- | ---------- | ------------ |
| `sm` | `text-base` | `w-4 h-4`   |
| `md` | `text-xl`   | `w-5 h-5`   |
| `lg` | `text-3xl`  | `w-7 h-7`   |

---

### Banner

**ファイル**: `src/components/Banner.tsx`

**責務**: 画面上部に固定表示される通知バナー。複数同時表示対応。2.5秒後に自動消去。

**エクスポート**:
- `Banner` コンポーネント
- `createBanner(message, type)` ファクトリ関数
- `BannerType` 型（`'save' | 'complete' | 'delete' | 'error' | 'success' | 'info'`）
- `BannerMessage` 型

**Props**:

```typescript
type Props = {
  banners: BannerMessage[]
  onDismiss: (id: number) => void
}

type BannerMessage = {
  id: number
  message: string
  type: BannerType
}
```

**タイプ別アクセントカラーとアイコン**:

| type              | アクセントカラー | アイコン          |
| ----------------- | ---------------- | ----------------- |
| `save` / `success` | `#16a34a`（緑）  | `Save`            |
| `complete`        | `#16a34a`（緑）  | `CircleCheckBig`  |
| `delete` / `info` | `#6b7280`（グレー） | `Trash2`       |
| `error`           | `#ef4444`（赤）  | `WifiOff`         |

---

### ConfirmDialog

**ファイル**: `src/components/ConfirmDialog.tsx`

**責務**: 完了・削除操作の確認ダイアログ。オーバーレイ背景クリックでキャンセル。

**Props**:

```typescript
type Props = {
  message: string
  onConfirm: () => void
  onCancel: () => void
}
```

---

### EditCard

**ファイル**: `src/components/EditCard.tsx`

**責務**: 支払いの新規追加・編集フォーム。タイトル・金額・PayPay URL・作成者選択のインライン編集カード。

**Props**:

```typescript
type Props = {
  onSave: (data: {
    title: string
    amount: number
    payPayUrl: string | null
    creatorId: string | null
  }) => Promise<void>
  onCancel: () => void
  initialData?: {
    title: string
    amount: number
    payPayUrl: string | null
    creatorId?: string | null
  }
  members?: [Member, Member] | null
  isNew?: boolean  // true のとき出現アニメーションが適用される
}
```

**バリデーション**:
- タイトル: 必須・空文字不可・最大20文字
- 金額: 必須・数字のみ・1以上999999以下
- PayPay URL: 省略可・`paypay.ne.jp` ドメインチェック

---

### HistorySection

**ファイル**: `src/components/HistorySection.tsx`

**責務**: 完了済み支払いの履歴表示。「今週・今月・それ以前」の3セクション構成のアコーディオン。

**Props**:

```typescript
type Props = {
  payments: Payment[]          // 完了済み支払いの配列
  members?: [Member, Member] | null
}
```

**アコーディオン初期状態**:

| セクション       | デフォルト |
| ---------------- | ---------- |
| 今週（月曜〜）   | 開く       |
| 今月（今週除く） | 閉じる     |
| それ以前         | 閉じる     |

`payments` が空配列の場合はセクション全体を非表示にする。

---

### PaymentCard

**ファイル**: `src/components/PaymentCard.tsx`

**責務**: 未完了支払いのカード表示。左スワイプで完了操作、右スワイプで編集・削除アクションを表示。

**Props**:

```typescript
type Props = {
  payment: Payment
  members?: [Member, Member] | null
  onCompleteRequest: (payment: Payment) => void
  onEditRequest: (payment: Payment) => void
  onDeleteRequest: (payment: Payment) => void
  disabled?: boolean    // 編集中ロック時に true（opacity 60%）
  fadingOut?: boolean   // 完了・削除アニメーション中に true
  index?: number        // staggered アニメーション用インデックス
}
```

**スワイプ操作**:

| 操作           | 閾値  | アクション                          |
| -------------- | ----- | ----------------------------------- |
| 左スワイプ 80px以上 | 80px | `onCompleteRequest` を呼び出す     |
| 右スワイプ 80px以上 | 80px | 編集・削除ボタンを露出する         |
| 右スワイプ後に左スワイプ | - | ボタンを閉じる                |

---

### Toast

**ファイル**: `src/components/Toast.tsx`

**責務**: 画面下部中央に表示されるトースト通知。2.5秒後に自動消去。

**エクスポート**:
- `Toast` コンポーネント
- `createToast(message, type)` ファクトリ関数
- `ToastType` 型（`'success' | 'error' | 'complete' | 'delete'`）
- `ToastMessage` 型

**Props**:

```typescript
type Props = {
  toasts: ToastMessage[]
  onDismiss: (id: number) => void
}

type ToastMessage = {
  id: number
  message: string
  type: ToastType
}
```

**タイプ別背景色とアイコン**:

| type       | 背景色      | アイコン       |
| ---------- | ----------- | -------------- |
| `success`  | `#1B5E20`   | `Check`（緑）  |
| `complete` | `#1B5E20`   | `CheckCircle2`（緑） |
| `delete`   | `#B71C1C`   | `Trash2`（白） |
| `error`    | `#37474F`   | `WifiOff`（白）|

---

## ページ一覧（src/pages/）

### WelcomePage

**ファイル**: `src/pages/WelcomePage.tsx`

**責務**: URL ハッシュなし（`/`）でアクセス時に表示するランディングページ。アプリ説明・使い方の3ステップ・ルーム作成ボタン。

**Props**: なし

**遷移先**: 「新しいルームを作る」ボタン → `/#create`

---

### CreateRoomPage

**ファイル**: `src/pages/CreateRoomPage.tsx`

**責務**: `/#create` でアクセス。メンバー名2人を入力してルームを Firestore に作成する。

**Props**: なし

**内部ステート**:

| ステート      | 型             | 用途                           |
| ------------- | -------------- | ------------------------------ |
| `member1Name` | `string`       | メンバー1の入力値              |
| `member2Name` | `string`       | メンバー2の入力値              |
| `errors`      | `FormErrors`   | バリデーションエラーメッセージ |
| `creating`    | `boolean`      | 作成中ローディング状態         |
| `toasts`      | `ToastMessage[]` | エラートースト表示用           |

**遷移先**: ルーム作成成功後 → `/#share/{newRoomId}`

---

### ShareLinkPage

**ファイル**: `src/pages/ShareLinkPage.tsx`

**責務**: `/#share/{roomId}` でアクセス。ルームURLを表示・コピー・ルームへの入室ボタンを提供する。

**Props**:

```typescript
type Props = {
  roomId: string
}
```

**内部ステート**:

| ステート    | 型        | 用途                                  |
| ----------- | --------- | ------------------------------------- |
| `loading`   | `boolean` | Firestore 確認中                      |
| `exists`    | `boolean` | ルームが Firestore に存在するか       |
| `loadError` | `boolean` | Firestore 読み込みエラー              |
| `copied`    | `boolean` | コピー完了状態（2秒後に false に戻る）|

**遷移先**: 「ルームへ入る」→ `#{roomId}`

---

### SettingsPage

**ファイル**: `src/pages/SettingsPage.tsx`

**責務**: `/#settings/{roomId}` でアクセス。メンバー名を編集して Firestore に保存する。

**Props**:

```typescript
type Props = {
  roomId: string
  onNotFound: () => void  // ルームが存在しない場合のコールバック
}
```

**内部ステート**:

| ステート   | 型                      | 用途                       |
| ---------- | ----------------------- | -------------------------- |
| `loading`  | `boolean`               | 読み込み中                 |
| `saving`   | `boolean`               | 保存中                     |
| `name1`    | `string`                | メンバー1の名前入力値      |
| `name2`    | `string`                | メンバー2の名前入力値      |
| `error1`   | `string \| undefined`   | メンバー1のバリデーション  |
| `error2`   | `string \| undefined`   | メンバー2のバリデーション  |
| `members`  | `[Member, Member] \| null` | 元のメンバー情報（colorの維持用） |

**遷移先**: 保存成功後 → `#{roomId}`

---

### RoomPage

**ファイル**: `src/pages/RoomPage.tsx`

**責務**: `#{roomId}` でアクセス。支払い管理ダッシュボード。未完了カード一覧・FAB・履歴を表示。

**Props**:

```typescript
type Props = {
  roomId: string
  onNotFound?: () => void
}
```

**内部ステート一覧**:

| ステート                  | 型                    | 用途                                           |
| ------------------------- | --------------------- | ---------------------------------------------- |
| `payments`                | `Payment[]`           | 未完了支払い一覧（リアルタイム同期）           |
| `completedPayments`       | `Payment[]`           | 完了済み支払い一覧（リアルタイム同期）         |
| `loading`                 | `boolean`             | 初期読み込み中フラグ                           |
| `members`                 | `[Member, Member] \| null` | ルームのメンバー情報                      |
| `isAdding`                | `boolean`             | 新規追加フォーム表示中フラグ                   |
| `editingId`               | `string \| null`      | 編集中のカードの paymentId                     |
| `banners`                 | `BannerMessage[]`     | 表示中のバナー一覧                             |
| `pendingCompletePayment`  | `Payment \| null`     | 完了確認ダイアログ対象の支払い                 |
| `pendingDeletePayment`    | `Payment \| null`     | 削除確認ダイアログ対象の支払い                 |
| `fadingOutIds`            | `Set<string>`         | フェードアウトアニメーション中の paymentId 集合 |
| `initialLoadDone`（ref）  | `boolean`（useRef）   | 初回読み込み完了フラグ                         |

**ロック状態**: `isAdding || editingId !== null` のとき `isLocked = true`。ロック中は編集対象以外のカードに `pointer-events-none opacity-60` が適用される。

---

### NotFoundPage

**ファイル**: `src/pages/NotFoundPage.tsx`

**責務**: 無効なハッシュや存在しないルームIDへのアクセス時に 404 メッセージを表示する。

**Props**: なし

---

## ルーティング仕様

ファイル: `src/lib/routing.ts`、`src/App.tsx`

`window.location.hash` の変化を `hashchange` イベントで監視し、`resolveRoute` でルートを解決する。

| URL パターン             | 表示コンポーネント | 補足                                    |
| ------------------------ | ------------------ | --------------------------------------- |
| `/`（ハッシュなし）      | `WelcomePage`      | `#` が URL に含まれない場合             |
| `/#create`               | `CreateRoomPage`   |                                         |
| `/#share/{roomId}`       | `ShareLinkPage`    | roomId が 8〜12 文字の英小文字・数字     |
| `/#settings/{roomId}`    | `SettingsPage`     | roomId が 8〜12 文字の英小文字・数字     |
| `#{roomId}`（有効）      | `RoomPage`         | roomId が 8〜12 文字の英小文字・数字     |
| その他                   | `NotFoundPage`     | 不正なハッシュ                          |

画面遷移は `navigateToHash(hash)` を呼び出して `window.location.hash` を更新する。`AnimatePresence` により画面切り替え時にフェードアウト→フェードインアニメーションが発生する。

### stateKey 関数

`AnimatePresence` の `key` として使用。同じ roomId で別画面（room/share/settings）を区別するため、`room-{roomId}`・`share-{roomId}`・`settings-{roomId}` の形式で生成する。
