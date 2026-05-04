# API・データ仕様

## Firestore データ構造

### 型定義（src/types.ts）

#### Member 型

```typescript
type Member = {
  id: string;     // "m1" | "m2" の固定値
  name: string;   // メンバー名（最大10文字）
  color: string;  // カード縁色（m1="#2196F3"青、m2="#F44336"赤）
};
```

#### Room 型

```typescript
type Room = {
  id: string;               // URLハッシュ（roomId）
  createdAt: Date;          // ルーム作成日時
  members: [Member, Member]; // 2人固定の配列
};
```

#### Payment 型

```typescript
type Payment = {
  id: string;               // FirestoreドキュメントID
  title: string;            // タイトル（最大20文字・必須）
  amount: number;           // 金額（1以上999999以下・必須）
  payPayUrl: string | null; // PayPayリンク（省略可・null許容）
  createdAt: Date;          // 作成日時
  updatedAt: Date | null;   // 最終更新日時（作成直後はnull）
  completedAt: Date | null; // 完了日時（未完了時はnull）
  isDone: boolean;          // 完了フラグ
  creatorId: string | null; // "m1" | "m2" | null（未設定許容）
};
```

---

## コレクション設計

```
/rooms/{hashId}                        ← Room ドキュメント
/rooms/{hashId}/payments/{paymentId}   ← Payment サブコレクション
```

### /rooms/{hashId}（Roomドキュメント）

Firestoreに保存される実際のフィールド構成:

```json
{
  "createdAt": "Timestamp",
  "members": [
    { "id": "m1", "name": "太郎", "color": "#2196F3" },
    { "id": "m2", "name": "花子", "color": "#F44336" }
  ]
}
```

- `hashId` はルーティング用ハッシュ文字列（例: `abc123xyz`）
- ドキュメントIDそのものが roomId として機能する

### /rooms/{hashId}/payments/{paymentId}

Firestoreに保存される実際のフィールド構成:

```json
{
  "title": "ランチ",
  "amount": 2500,
  "payPayUrl": "https://pay.paypay.ne.jp/...",
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp",
  "completedAt": null,
  "isDone": false,
  "creatorId": "m1"
}
```

- `paymentId` は Firestore の `addDoc` が自動生成するID
- `Timestamp` は Firebase SDK の `Timestamp` 型で保存・取得時に `Date` へ変換

---

## firestore.ts 関数一覧

ファイル: `src/lib/firestore.ts`

### createPayment

```typescript
async function createPayment(
  roomId: string,
  data: Omit<Payment, 'id'>
): Promise<string>
```

- 新しい Payment ドキュメントを Firestore に追加する
- `updatedAt` は呼び出し時点の `new Date()` で自動上書き
- 戻り値: 生成されたドキュメントID（文字列）

### updatePayment

```typescript
async function updatePayment(
  roomId: string,
  paymentId: string,
  data: Partial<Omit<Payment, 'id'>>
): Promise<void>
```

- 指定した Payment ドキュメントの一部フィールドを更新する
- `updatedAt` は呼び出し時点の `new Date()` で自動設定
- `createdAt`・`completedAt` が含まれる場合は `Timestamp` に変換して保存

### deletePayment

```typescript
async function deletePayment(
  roomId: string,
  paymentId: string
): Promise<void>
```

- 指定した Payment ドキュメントを削除する

### listPayments

```typescript
async function listPayments(roomId: string): Promise<Payment[]>
```

- 指定ルームの全 Payment を一度だけ取得して返す（スナップショット読み取り）
- ソート順は保証されない（呼び出し側でソートする）

### subscribeActivePayments

```typescript
function subscribeActivePayments(
  roomId: string,
  callback: (payments: Payment[]) => void
): () => void
```

- `isDone === false` の Payment をリアルタイム購読する
- `createdAt` 降順（新しい順）に並んで返される
- 戻り値: 購読解除関数（`useEffect` のクリーンアップで呼び出す）

### subscribeCompletedPayments

```typescript
function subscribeCompletedPayments(
  roomId: string,
  callback: (payments: Payment[]) => void
): () => void
```

- `isDone === true` の Payment をリアルタイム購読する
- `completedAt` 降順（新しい順）でソートして返される
- 戻り値: 購読解除関数

### createRoom

```typescript
async function createRoom(
  roomId: string,
  members: [Member, Member]
): Promise<void>
```

- 指定した roomId で Room ドキュメントを新規作成する（`setDoc` を使用）
- `createdAt` は呼び出し時点の `new Date()` を使用

### updateRoom

```typescript
async function updateRoom(
  roomId: string,
  members: [Member, Member]
): Promise<void>
```

- 指定した Room ドキュメントの `members` フィールドを更新する

### getRoom

```typescript
async function getRoom(roomId: string): Promise<Room | null>
```

- 指定した Room ドキュメントを一度だけ取得する
- 存在しない場合は `null` を返す
- ルームページ初期化・ShareLinkPage・SettingsPage で存在確認に使用

---

## セキュリティルール概要

ファイル: `firestore.rules`

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rooms/{hashId} {
      allow read, write: if request.auth == null
        && hashId.size() >= 6
        && hashId.matches('[a-zA-Z0-9_-]+');
    }
    match /rooms/{hashId}/payments/{paymentId} {
      allow read, write: if request.auth == null
        && hashId.size() >= 6
        && hashId.matches('[a-zA-Z0-9_-]+');
    }
  }
}
```

- **認証なし**（`request.auth == null`）でアクセスを許可するURLハッシュ方式
- `hashId` が6文字以上・英数字とアンダースコア・ハイフンのみの場合に読み書き許可
- URLを知っているユーザーだけがアクセスできる設計

---

## ルームID生成ロジック（generateRandomHash）

ファイル: `src/lib/routing.ts`

```typescript
function generateRandomHash(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const length = 8 + Math.floor(Math.random() * 5)
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
```

- 文字セット: 小文字アルファベット + 数字（36文字）
- 長さ: 8〜12文字のランダム
- 生成例: `abc123xyz`、`x7y2z9w1k3`
- ルーム作成時（`CreateRoomPage`）に1回だけ呼び出され、Firestore のドキュメントIDになる

### ルーティングパターン（routing.ts）

| URLハッシュ              | `RouteResult` 型      | 条件                                              |
| ------------------------ | --------------------- | ------------------------------------------------- |
| ハッシュなし（`/`）      | `{ type: 'welcome' }` | `window.location.href` に `#` が含まれない        |
| `#`（空）               | `{ type: 'welcome' }` | hashId が空文字                                   |
| `#create`               | `{ type: 'create' }`  | 固定文字列一致                                    |
| `#share/{roomId}`       | `{ type: 'share' }`   | roomId が `/^[a-z0-9]{8,12}$/` または `PROD_ROOM_ID` |
| `#settings/{roomId}`    | `{ type: 'settings' }`| 同上                                              |
| `#{roomId}`（有効）     | `{ type: 'room' }`    | roomId が上記パターンに合致                       |
| その他                   | `{ type: 'notFound' }`| 上記いずれにも該当しない                          |

- `VITE_PROD_ROOM_ID` 環境変数で本番専用ルームIDを別途許可できる
