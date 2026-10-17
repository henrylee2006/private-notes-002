import { Transaction } from "../types/transaction";
import { Category } from "../types/category";
import { AccountGroup } from "../types/account";

const DB_NAME = "LedgerPWA_DB";
const DB_VERSION = 2;

const STORE_TRANSACTIONS = "transactions";
const STORE_CATEGORIES = "categories";
const STORE_ACCOUNTS = "accounts";

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_TRANSACTIONS)) {
        db.createObjectStore(STORE_TRANSACTIONS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_CATEGORIES)) {
        db.createObjectStore(STORE_CATEGORIES, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_ACCOUNTS)) {
        db.createObjectStore(STORE_ACCOUNTS, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// --- 交易相關服務 ---
export const getAllTransactionsFromDB = async (): Promise<Transaction[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_TRANSACTIONS, "readonly");
    const store = tx.objectStore(STORE_TRANSACTIONS);
    const request = store.getAll();

    request.onsuccess = () => {
      const results = (request.result as Transaction[]).sort(
        (a, b) => b.transactionAt - a.transactionAt,
      );
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
};

export const saveTransactionToDB = async (
  transaction: Transaction,
): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_TRANSACTIONS, "readwrite");
    const store = tx.objectStore(STORE_TRANSACTIONS);
    const request = store.put(transaction);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// --- 分類相關服務 ---
export const getAllCategoriesFromDB = async (): Promise<Category[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_CATEGORIES, "readonly");
    const store = tx.objectStore(STORE_CATEGORIES);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as Category[]);
    request.onerror = () => reject(request.error);
  });
};

export const saveCategoryToDB = async (category: Category): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_CATEGORIES, "readwrite");
    const store = tx.objectStore(STORE_CATEGORIES);
    const request = store.put(category);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// --- 帳戶相關服務 ---
export const getAllAccountsFromDB = async (): Promise<AccountGroup[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ACCOUNTS, "readonly");
    const store = tx.objectStore(STORE_ACCOUNTS);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as AccountGroup[]);
    request.onerror = () => reject(request.error);
  });
};

export const saveAccountGroupToDB = async (
  group: AccountGroup,
): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ACCOUNTS, "readwrite");
    const store = tx.objectStore(STORE_ACCOUNTS);
    const request = store.put(group);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// --- 初始化預設資料 (Seed Data) ---
export const seedInitialDataIfNeeded = async (): Promise<void> => {
  const categories = await getAllCategoriesFromDB();
  if (categories.length === 0) {
    const defaultCategories: Category[] = [
      {
        id: "food",
        parentId: null,
        name: "飲食",
        icon: "🍔",
        type: "expense",
        depth: 0,
        sortOrder: 1,
        targetScope: "transaction",
      },
      {
        id: "food.breakfast",
        parentId: "food",
        name: "早餐",
        type: "expense",
        depth: 1,
        sortOrder: 1,
        targetScope: "both",
      },
      {
        id: "food.lunch",
        parentId: "food",
        name: "午餐",
        type: "expense",
        depth: 1,
        sortOrder: 2,
        targetScope: "both",
      },
      {
        id: "food.dinner",
        parentId: "food",
        name: "晚餐",
        type: "expense",
        depth: 1,
        sortOrder: 3,
        targetScope: "both",
      },
      {
        id: "food.midnight",
        parentId: "food",
        name: "宵夜",
        type: "expense",
        depth: 1,
        sortOrder: 4,
        targetScope: "both",
      },
      {
        id: "food.snack",
        parentId: "food",
        name: "零食",
        type: "expense",
        depth: 1,
        sortOrder: 5,
        targetScope: "both",
      },
      {
        id: "food.drink",
        parentId: "food",
        name: "飲料",
        type: "expense",
        depth: 1,
        sortOrder: 6,
        targetScope: "item",
      },
      {
        id: "food.staple",
        parentId: "food",
        name: "主食",
        type: "expense",
        depth: 1,
        sortOrder: 7,
        targetScope: "both",
      },
      {
        id: "food.side",
        parentId: "food",
        name: "副食",
        type: "expense",
        depth: 1,
        sortOrder: 8,
        targetScope: "both",
      },
      {
        id: "transport",
        parentId: null,
        name: "交通",
        icon: "🚗",
        type: "expense",
        depth: 0,
        sortOrder: 2,
        targetScope: "transaction",
      },
      {
        id: "transport.train",
        parentId: "transport",
        name: "火車",
        type: "expense",
        depth: 1,
        sortOrder: 1,
        targetScope: "both",
      },
      {
        id: "transport.mrt",
        parentId: "transport",
        name: "捷運",
        type: "expense",
        depth: 1,
        sortOrder: 2,
        targetScope: "both",
      },
      {
        id: "transport.bus",
        parentId: "transport",
        name: "公車",
        type: "expense",
        depth: 1,
        sortOrder: 3,
        targetScope: "both",
      },
      {
        id: "transport.gas",
        parentId: "transport",
        name: "加油",
        type: "expense",
        depth: 1,
        sortOrder: 4,
        targetScope: "both",
      },
      {
        id: "transport.maintenance",
        parentId: "transport",
        name: "保養",
        type: "expense",
        depth: 1,
        sortOrder: 5,
        targetScope: "both",
      },
      {
        id: "transport.toll",
        parentId: "transport",
        name: "過路費",
        type: "expense",
        depth: 1,
        sortOrder: 6,
        targetScope: "both",
      },
      {
        id: "transport.parking",
        parentId: "transport",
        name: "停車",
        type: "expense",
        depth: 1,
        sortOrder: 7,
        targetScope: "both",
      },
    ];
    for (const cat of defaultCategories) {
      await saveCategoryToDB(cat);
    }
  }

  const accounts = await getAllAccountsFromDB();
  if (accounts.length === 0) {
    const defaultAccounts: AccountGroup[] = [
      {
        id: "cash_group",
        name: "現金",
        icon: "💵",
        subAccounts: [
          {
            id: "acc_cash",
            name: "現金",
            type: "cash",
            balance: 0,
            isLiability: false,
          },
        ],
      },
      {
        id: "bank_group",
        name: "銀行",
        icon: "🏦",
        subAccounts: [
          {
            id: "acc_esun",
            name: "玉山銀行",
            type: "bank",
            balance: 0,
            isLiability: false,
          },
          {
            id: "acc_taishin",
            name: "台新銀行",
            type: "bank",
            balance: 0,
            isLiability: false,
          },
        ],
      },
      {
        id: "card_group",
        name: "信用卡",
        icon: "💳",
        subAccounts: [
          {
            id: "acc_cathay",
            name: "國泰世華",
            type: "credit_card",
            balance: 0,
            isLiability: true,
          },
          {
            id: "acc_fubon",
            name: "富邦信用卡",
            type: "credit_card",
            balance: 0,
            isLiability: true,
          },
        ],
      },
    ];
    for (const acc of defaultAccounts) {
      await saveAccountGroupToDB(acc);
    }
  }
};
