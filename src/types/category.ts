export type CategoryTargetScope = "transaction" | "item" | "both";

export interface Category {
  id: string; // 動態路徑 ID (例如: "food", "food.breakfast")
  parentId: string | null; // 上層分類 ID (頂層為 null)
  name: string; // 名稱 (例如: "飲食", "早餐")
  icon?: string; // 圖示 (例如: "🍔")
  type: "expense" | "income"; // 支出或收入
  depth: number; // 深度層級 (0: 主分類, 1: 副分類...)
  sortOrder: number; // 排序順序
  targetScope: CategoryTargetScope; // 🌟 作用域標記
}
