// src/constants/labels.ts

export const UI_LABELS = {
  // 底部導覽列文字
  nav: {
    accounts: "帳戶",
    ledger: "帳本",
    camera: "拍照",
    overview: "總覽",
    inbox: "發票",
  },

  // 歡迎頁 / Onboarding
  onboarding: {
    title: "歡迎使用智慧記帳",
    subtitle: "Camera-First, Local-First 極速記帳體驗",
    step1Title: "拍照即記帳",
    step1Desc: "拍下發票或網銀截圖，AI 背景自動解析明細",
    step2Title: "在地隱私優先",
    step2Desc: "所有資料與照片優先儲存於手機本地，離線也能用",
    startButton: "開始使用 🚀",
  },

  // 帳本頁面
  ledger: {
    title: "帳本明細",
    emptyText: "目前沒有記帳紀錄，快按下相機拍一張吧！",
    filterAll: "全部",
    amount: "金額",
    date: "消費時間",
  },

  // 收件匣 / 待確認頁面
  inbox: {
    title: "待確認憑證 (Inbox)",
    confirmSuccess: "已成功確認記帳",
    deleteSuccess: "已移除此筆資料",
  },

  // 系統通用按鈕與提示
  common: {
    confirm: "確認",
    cancel: "取消",
    save: "儲存",
    delete: "刪除",
    loading: "載入中...",
  },
} as const; // 加上 as const 可以獲得最精確的 TypeScript 型別提示
