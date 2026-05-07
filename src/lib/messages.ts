export const MSG = {
  common: {
    cancel: 'キャンセル',
    save: '保存',
    saving: '保存中...',
    loading: '読み込み中...',
    back: '戻る',
    yes: 'はい',
    no: 'いいえ',
    close: '閉じる',
  },

  validation: {
    titleRequired: 'タイトルを入力してください',
    titleMaxLength: 'タイトルは20文字以内で入力してください',
    amountRequired: '金額を入力してください',
    amountNumericOnly: '金額は数字のみ入力してください',
    amountMin: '金額は1以上を入力してください',
    amountMax: '金額は999,999以下を入力してください',
    payPayUrlDomain: 'paypay.ne.jpのURLを入力してください',
    payPayUrlInvalid: '正しいURLを入力してください',
    nameRequired: '名前を入力してください',
    nameMaxLength: '名前は10文字以内で入力してください',
  },

  toast: {
    saved: '保存しました',
    deleted: '削除しました',
    completed: '完了しました',
    networkError: '通信エラーが発生しました',
  },

  dialog: {
    completeConfirm: '支払い完了しましたか？',
    deleteConfirm: '削除しますか？',
  },

  editCard: {
    titlePlaceholder: 'タイトル',
    pasteTip: 'クリップボードから貼り付け',
    payDirectionFn: (from: string, to: string) => `${from}から${to}に支払う`,
  },

  paymentCard: {
    delete: '削除',
    edit: '編集',
    createdAtFn: (dt: string) => `作成: ${dt}`,
    updatedAtFn: (dt: string) => `更新: ${dt}`,
    payDirectionSuffix: ' に支払い',
    payPayButton: 'PayPayで払う',
  },

  history: {
    thisWeek: '今週（月曜〜）',
    thisMonth: '今月（今週除く）',
    earlier: 'それ以前',
    completedBadge: '完了',
    completedAtFn: (dt: string) => `完了: ${dt}`,
    sectionTitle: '履歴',
  },

  welcome: {
    headline: '2人の支払いを\nかんたん管理',
    feature1: 'ログイン不要・URLを共有するだけ',
    feature2: '誰が払ったかひと目でわかる',
    feature3: 'PayPayリンクを記録できる',
    howToUse: '使い方',
    step1Title: 'ルーム作成',
    step1Desc: '「作る」ボタンをタップ',
    step2Title: 'URLを共有',
    step2Desc: 'メンバーにURLを送る',
    step3Title: '立替を記録',
    step3Desc: '＋ボタンで追加する',
    createButton: '新しいルームを作る',
    shareHint: 'ルームのURLを受け取ったらそのままアクセスしてね',
  },

  createRoom: {
    title: 'ルームを作成',
    member1Label: 'メンバー1の名前',
    member1Placeholder: '太郎',
    member2Label: 'メンバー2の名前',
    member2Placeholder: '花子',
    createButton: 'ルームを作成する',
    creating: '作成中...',
  },

  shareLink: {
    title: 'URLを共有してね',
    subtitle: 'このURLをメンバーに共有してね',
    copied: 'コピーした！ ✓',
    copy: 'コピー',
    enterRoom: 'ルームへ入る',
    accessError: 'このルームにアクセスできません',
    accessErrorDetail: '通信エラーが発生しました。時間をおいて再度お試しください。',
  },

  settings: {
    title: 'メンバーを編集',
    member1Label: 'メンバー1の名前',
    member2Label: 'メンバー2の名前',
    saveButton: '保存する',
  },

  room: {
    settingsLabel: '設定',
    emptyTitle: '立替を記録しよう',
    emptyDescPrefix: '右下の',
    emptyDescHighlight: '＋ボタン',
    emptyDescSuffix: 'をタップして、',
    emptyDescLine2: '最初の立替を追加しましょう',
    emptyHint: '下の＋ボタンから追加',
    fabLabel: '支払いを追加',
  },

  notFound: {
    message: 'ページが見つかりません',
  },
} as const
