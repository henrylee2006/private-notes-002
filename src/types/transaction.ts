export type SyncStatus = "pending" | "synced" | "conflict";

// --- 俄羅斯套娃式明細結構 (僅使用 categoryId，無 name) ---
export interface TransactionItem {
  id: string; // 明細本地唯一 ID
  categoryId: string; // 明細分類 ID (例如: "food.breakfast.drink")
  quantity: number; // 數量
  price: number; // 單價
  items?: TransactionItem[]; // 嵌套子明細 / 套餐組合
}

// --- 主交易紀錄結構 ---
export interface Transaction {
  // 1. 雙 ID 設計
  id: string; // 本地唯一碼 (離線即時生成)
  syncId?: string; // 雲端同步碼 (同步時回填)
  syncStatus: SyncStatus; // 同步狀態 ('pending' | 'synced' | 'conflict')

  // 2. 雙時序核心
  transactionAt: number; // 消費時間 (Timestamp)
  settlementAt?: number; // 扣款/請款時間 (未扣款為空)

  // 3. 途徑與主分類
  accountId: string; // 支付帳戶 ID (對應 Account.id)
  categoryId: string; // 主分類 ID (例如: "food.breakfast")

  // 4. 金額
  amount: number; // 總花費金額
  fee: number; // 手續費 (預設 0)

  // 5. 消費細節與照片
  location?: string; // 消費地點
  invoiceNumber?: string; // 發票號碼
  note?: string; // 交易備註
  items: TransactionItem[]; // 套娃明細清單
  imageUrls: string[]; // 照片/收據地址

  // 6. 系統維護
  createdAt: number; // 本地建立時間
  updatedAt: number; // 最後修改時間
  isDeleted: boolean; // 軟刪除標記
}
