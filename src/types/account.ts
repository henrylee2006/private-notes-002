export type AccountType = "cash" | "bank" | "credit_card" | "investment";

export interface Account {
  id: string; // 本地唯一 ID
  syncId?: string; // 雲端同步碼 (與雲端對齊時使用)
  name: string; // 帳戶名稱 (例如: "玉山銀行", "隨身現金")
  type: AccountType; // 帳戶類型
  balance: number; // 當前餘額
  isLiability: boolean; // 是否為負債帳戶 (例如信用卡)
  updatedAt: number; // 最後修改時間戳
}
