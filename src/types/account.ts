export type AccountType = "cash" | "bank" | "credit_card" | "investment";

export interface Account {
  id: string; // 本地唯一 ID (例如: "acc_cash", "acc_esun")
  syncId?: string; // 雲端同步碼
  name: string; // 帳戶名稱 (例如: "玉山銀行", "現金")
  type: AccountType; // 帳戶類型
  balance: number; // 當前餘額
  isLiability: boolean; // 是否為負債帳戶 (例如信用卡)
  updatedAt: number; // 最後修改時間戳
}

// 支援巢狀群組的介面（供 UI 選擇介面使用）
export interface SubAccount {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  isLiability: boolean;
}

export interface AccountGroup {
  id: string;
  name: string; // 群組名稱 (例如: "現金", "銀行", "信用卡")
  icon: string;
  subAccounts: SubAccount[];
}
