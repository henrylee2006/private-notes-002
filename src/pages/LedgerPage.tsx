import React, { useState, useEffect } from "react";
import { UI_LABELS } from "../constants/labels";
import { TransactionModal } from "../components/TransactionModal";
import { Plus, Receipt } from "lucide-react";
import { Transaction } from "../types/transaction";
import { Category } from "../types/category";
import {
  getAllTransactionsFromDB,
  saveTransactionToDB,
  getAllCategoriesFromDB,
  seedInitialDataIfNeeded,
} from "../services/db";

export const LedgerPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        await seedInitialDataIfNeeded();
        const [savedTransactions, savedCategories] = await Promise.all([
          getAllTransactionsFromDB(),
          getAllCategoriesFromDB(),
        ]);
        setTransactions(savedTransactions);
        setCategories(savedCategories);
      } catch (error) {
        console.error("載入持久化資料失敗:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  const handleOpenCreate = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleSaveTransaction = async (savedTx: Partial<Transaction>) => {
    let targetTx: Transaction;

    if (editingTransaction) {
      targetTx = {
        ...editingTransaction,
        ...savedTx,
        updatedAt: Date.now(),
      } as Transaction;
    } else {
      targetTx = {
        id: `tx_${Date.now()}`,
        syncStatus: "pending",
        transactionAt: Date.now(),
        accountId: savedTx.accountId || "現金",
        categoryId: savedTx.categoryId || "food.lunch",
        amount: savedTx.amount || 0,
        fee: savedTx.fee || 0,
        items: savedTx.items || [],
        imageUrls: savedTx.imageUrls || [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isDeleted: false,
        ...savedTx,
      };
    }

    await saveTransactionToDB(targetTx);

    setTransactions((prev) => {
      const exists = prev.some((t) => t.id === targetTx.id);
      if (exists) {
        return prev.map((t) => (t.id === targetTx.id ? targetTx : t));
      }
      return [targetTx, ...prev];
    });

    setIsModalOpen(false);
  };

  // 🌟 動態從資料庫中的分類向上解析主分類圖示與名稱
  const getMainCategoryInfo = (categoryId: string) => {
    const currentCat = categories.find((c) => c.id === categoryId);
    if (!currentCat) return { name: "未分類", icon: "📌", type: "expense" };

    if (currentCat.depth === 0 || !currentCat.parentId) {
      return {
        name: currentCat.name,
        icon: currentCat.icon || "📌",
        type: currentCat.type,
      };
    }

    const mainCat = categories.find((c) => c.id === currentCat.parentId);
    return {
      name: mainCat ? mainCat.name : currentCat.name,
      icon: mainCat?.icon || "📌",
      type: mainCat ? mainCat.type : currentCat.type,
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-zinc-400 text-sm">
        載入帳本資料中...
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col gap-6 p-4 pb-24 text-white">
      <div>
        <h1 className="text-xl font-bold">{UI_LABELS.ledger.title}</h1>
        <p className="text-xs text-zinc-400 mt-1">管理與檢視當日所有收支明細</p>
      </div>

      {transactions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/40 gap-4 my-auto">
          <div className="w-12 h-12 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-500">
            <Receipt size={24} />
          </div>
          <p className="text-sm text-zinc-400">{UI_LABELS.ledger.emptyText}</p>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-950 text-xs font-semibold rounded-full shadow-lg hover:bg-zinc-200 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>新增第一筆記帳</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {transactions.map((tx) => {
            const mainCatInfo = getMainCategoryInfo(tx.categoryId);
            const isIncome = mainCatInfo.type === "income";

            return (
              <div
                key={tx.id}
                onClick={() => handleOpenEdit(tx)}
                className="flex items-center justify-between p-4 bg-zinc-900/80 hover:bg-zinc-800/80 border border-white/5 rounded-2xl cursor-pointer transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-lg shadow-inner">
                    {mainCatInfo.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-200">
                      {mainCatInfo.name}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {new Date(tx.transactionAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      • {tx.accountId}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span
                    className={`text-base font-bold tracking-tight ${isIncome ? "text-emerald-400" : "text-white"}`}
                  >
                    {isIncome ? "+" : "$"} {tx.amount.toLocaleString()}
                  </span>
                  {tx.note && (
                    <span className="text-xs text-zinc-400 max-w-[120px] truncate">
                      {tx.note}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {transactions.length > 0 && (
        <button
          onClick={handleOpenCreate}
          className="fixed right-6 bottom-20 z-40 w-14 h-14 bg-white text-zinc-950 rounded-full shadow-2xl flex items-center justify-center hover:bg-zinc-200 active:scale-90 transition-all border border-black/10"
          aria-label="新增交易"
        >
          <Plus size={28} className="stroke-[2.5]" />
        </button>
      )}

      <TransactionModal
        isOpen={isModalOpen}
        initialData={editingTransaction}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
      />
    </div>
  );
};

export default LedgerPage;
