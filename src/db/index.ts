import Dexie, { Table } from "dexie";
import { Transaction } from "../types/transaction";
import { Category } from "../types/category";
import { Account } from "../types/account";

export class AppDatabase extends Dexie {
  transactions!: Table<Transaction>;
  categories!: Table<Category>;
  accounts!: Table<Account>;

  constructor() {
    super("LocalFirstLedgerDB");

    this.version(1).stores({
      // 索引欄位：以逗號分隔
      transactions:
        "id, syncId, syncStatus, transactionAt, settlementAt, accountId, categoryId, isDeleted",
      categories: "id, parentId, type, depth",
      accounts: "id, syncId, type",
    });
  }
}

export const db = new AppDatabase();
