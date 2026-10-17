import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Camera,
  Calendar,
  Clock,
  Trash2,
  Plus,
} from "lucide-react";
import { Transaction, TransactionItem } from "../types/transaction";
import { Category } from "../types/category";

interface TransactionModalProps {
  isOpen: boolean;
  initialData?: Transaction | null;
  onClose: () => void;
  onSave: (data: Partial<Transaction>) => void;
}

// 模擬分類資料庫（未來可改從 DB 讀取）
const MOCK_CATEGORIES: Category[] = [
  {
    id: "food",
    parentId: null,
    name: "餐飲美食",
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
    name: "午/晚餐",
    type: "expense",
    depth: 1,
    sortOrder: 2,
    targetScope: "both",
  },
  {
    id: "food.drink",
    parentId: "food",
    name: "飲料手搖",
    type: "expense",
    depth: 1,
    sortOrder: 3,
    targetScope: "item",
  },
  {
    id: "transport",
    parentId: null,
    name: "交通出行",
    icon: "🚗",
    type: "expense",
    depth: 0,
    sortOrder: 2,
    targetScope: "transaction",
  },
  {
    id: "transport.gas",
    parentId: "transport",
    name: "加油費",
    type: "expense",
    depth: 1,
    sortOrder: 1,
    targetScope: "both",
  },
];

const formatForDateTimeInput = (timestamp: number): string => {
  const date = new Date(timestamp);
  const pad = (num: number) => num.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
};

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSave,
}) => {
  const [step, setStep] = useState(1);

  const [amount, setAmount] = useState<string>("");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [selectedMainCatId, setSelectedMainCatId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [accountId, setAccountId] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [items, setItems] = useState<TransactionItem[]>([]);

  const [transactionAtInput, setTransactionAtInput] = useState<string>(
    formatForDateTimeInput(Date.now()),
  );
  const [hasSettlement, setHasSettlement] = useState<boolean>(false);
  const [settlementAtInput, setSettlementAtInput] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount.toString());
      setCategoryId(initialData.categoryId || "");
      setAccountId(initialData.accountId || "");
      setNote(initialData.note || "");
      setItems(initialData.items || []);

      setTransactionAtInput(formatForDateTimeInput(initialData.transactionAt));

      if (initialData.settlementAt) {
        setHasSettlement(true);
        setSettlementAtInput(formatForDateTimeInput(initialData.settlementAt));
      } else {
        setHasSettlement(false);
        setSettlementAtInput("");
      }

      setStep(5);
    } else {
      const now = Date.now();
      setAmount("");
      setType("expense");
      setSelectedMainCatId("food");
      setCategoryId("food.breakfast");
      setAccountId("💵 現金");
      setNote("");
      setItems([]);
      setTransactionAtInput(formatForDateTimeInput(now));
      setHasSettlement(false);
      setSettlementAtInput("");
      setStep(1);
    }
  }, [initialData, isOpen]);

  // 過濾整筆交易專用主分類
  const mainCategories = MOCK_CATEGORIES.filter(
    (c) =>
      c.type === type &&
      c.depth === 0 &&
      (c.targetScope === "transaction" || c.targetScope === "both"),
  );

  // 過濾對應的副分類
  const subCategories = MOCK_CATEGORIES.filter(
    (c) =>
      c.parentId === selectedMainCatId &&
      (c.targetScope === "transaction" || c.targetScope === "both"),
  );

  // 明細專用分類
  const itemCategories = MOCK_CATEGORIES.filter(
    (c) => c.targetScope === "item" || c.targetScope === "both",
  );

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 80 || info.velocity.y > 200) {
      onClose();
    }
  };

  const handleConfirmSave = () => {
    const txTimestamp = new Date(transactionAtInput).getTime() || Date.now();
    const stTimestamp =
      hasSettlement && settlementAtInput
        ? new Date(settlementAtInput).getTime()
        : undefined;

    onSave({
      amount: Number(amount) || 0,
      categoryId: categoryId || selectedMainCatId || "general",
      accountId: accountId || "cash",
      note,
      items,
      transactionAt: txTimestamp,
      settlementAt: stTimestamp,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col justify-end overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/90"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative w-full h-[calc(100vh-48px)] bg-zinc-900 border-t border-white/10 rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden z-10 text-white cursor-default"
          >
            {/* 頂部手勢拖曳區（唯一可下滑關閉區） */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.2 }}
              onDragEnd={handleDragEnd}
              className="flex flex-col items-center pt-3 pb-3 border-b border-zinc-800 shrink-0 select-none cursor-grab active:cursor-grabbing bg-zinc-900 z-20"
            >
              <div className="w-10 h-1 bg-zinc-700 rounded-full mb-3" />

              <div className="w-full flex items-center justify-between px-6">
                <button
                  onClick={onClose}
                  className="p-2 -ml-2 text-zinc-400 hover:text-white"
                >
                  <X size={20} />
                </button>

                <h2 className="text-sm font-semibold tracking-wide">
                  {initialData ? "編輯交易明細" : `新增交易 (${step}/5)`}
                </h2>

                <button
                  onClick={handleConfirmSave}
                  disabled={!amount}
                  className="p-2 -mr-2 text-white bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded-full transition-colors"
                >
                  <Check size={20} />
                </button>
              </div>

              {!initialData && (
                <div className="w-full px-6 mt-3 flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div
                      key={s}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        s <= step ? "bg-white" : "bg-zinc-800"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* 表單內容滾動區（阻止事件冒泡解決手勢衝突） */}
            <div
              onPointerDownCapture={(e) => e.stopPropagation()}
              className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6"
            >
              {/* Step 1: 金額 */}
              {(step === 1 || initialData) && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-zinc-400">
                    1. 輸入交易金額
                  </label>
                  <div className="flex items-center bg-zinc-800/60 rounded-2xl p-4 border border-white/5">
                    <span className="text-2xl font-bold mr-2 text-zinc-400">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-transparent text-3xl font-bold outline-none text-white"
                      autoFocus={!initialData}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: 收支類型 */}
              {(step === 2 || initialData) && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-zinc-400">
                    2. 選擇收支類型
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setType("expense");
                        if (!initialData) setStep(3);
                      }}
                      className={`p-3.5 rounded-2xl font-semibold border transition-all ${
                        type === "expense"
                          ? "bg-rose-500/20 border-rose-500/50 text-rose-300"
                          : "bg-zinc-800/40 border-white/5 text-zinc-400"
                      }`}
                    >
                      💸 支出
                    </button>
                    <button
                      onClick={() => {
                        setType("income");
                        if (!initialData) setStep(3);
                      }}
                      className={`p-3.5 rounded-2xl font-semibold border transition-all ${
                        type === "income"
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                          : "bg-zinc-800/40 border-white/5 text-zinc-400"
                      }`}
                    >
                      💰 收入
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: 主副分類選擇 */}
              {(step === 3 || initialData) && (
                <div className="flex flex-col gap-3">
                  <label className="text-xs text-zinc-400">
                    3. 選擇主副分類
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {mainCategories.map((main) => (
                      <button
                        key={main.id}
                        onClick={() => {
                          setSelectedMainCatId(main.id);
                          setCategoryId(main.id);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium shrink-0 flex items-center gap-1.5 border transition-all ${
                          selectedMainCatId === main.id
                            ? "bg-white text-zinc-950 font-bold border-white"
                            : "bg-zinc-800/60 border-white/5 text-zinc-400"
                        }`}
                      >
                        <span>{main.icon}</span>
                        <span>{main.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="p-3 bg-zinc-800/30 rounded-2xl border border-white/5 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setCategoryId(selectedMainCatId);
                        if (!initialData) setStep(4);
                      }}
                      className={`p-3 text-xs rounded-xl border text-left ${categoryId === selectedMainCatId ? "bg-zinc-100 text-zinc-950 font-bold" : "bg-zinc-800/40 text-zinc-400"}`}
                    >
                      一般 / 無特定副分類
                    </button>
                    {subCategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setCategoryId(sub.id);
                          if (!initialData) setStep(4);
                        }}
                        className={`p-3 text-xs rounded-xl border text-left flex justify-between ${categoryId === sub.id ? "bg-zinc-100 text-zinc-950 font-bold" : "bg-zinc-800/80 text-zinc-300"}`}
                      >
                        <span>{sub.name}</span>
                        {categoryId === sub.id && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: 帳戶 */}
              {(step === 4 || initialData) && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-zinc-400">
                    4. 選擇交易帳戶
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      "💵 現金",
                      "💳 玉山銀行",
                      "💳 國泰信用卡",
                      "📱 街口支付",
                    ].map((acc) => (
                      <button
                        key={acc}
                        onClick={() => {
                          setAccountId(acc);
                          if (!initialData) setStep(5);
                        }}
                        className={`p-3 text-xs rounded-xl border text-left ${accountId === acc ? "bg-white text-zinc-950 font-bold" : "bg-zinc-800/50 text-zinc-300"}`}
                      >
                        {acc}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: 雙時序與明細拆分 */}
              {(step === 5 || initialData) && (
                <div className="flex flex-col gap-4 bg-zinc-800/30 rounded-2xl p-4 border border-white/5">
                  <label className="text-xs font-semibold text-zinc-300">
                    5. 雙時序與明細細節
                  </label>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Clock size={12} /> 消費時間 (transactionAt)
                    </span>
                    <input
                      type="datetime-local"
                      value={transactionAtInput}
                      onChange={(e) => setTransactionAtInput(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2 text-sm text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        <Calendar size={12} /> 延遲扣款/請款 (settlementAt)
                      </span>
                      <input
                        type="checkbox"
                        checked={hasSettlement}
                        onChange={(e) => {
                          setHasSettlement(e.target.checked);
                          if (e.target.checked && !settlementAtInput)
                            setSettlementAtInput(transactionAtInput);
                        }}
                        className="w-4 h-4 rounded accent-white cursor-pointer"
                      />
                    </div>
                    {hasSettlement && (
                      <input
                        type="datetime-local"
                        value={settlementAtInput}
                        onChange={(e) => setSettlementAtInput(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2 text-sm text-white"
                      />
                    )}
                  </div>

                  {/* 明細項目編輯器 (套娃結構) */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400">
                        明細項目拆分 (選填)
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setItems([
                            ...items,
                            {
                              id: `it_${Date.now()}`,
                              categoryId: itemCategories[0]?.id || "",
                              quantity: 1,
                              price: 0,
                            },
                          ])
                        }
                        className="px-2.5 py-1 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-xs flex items-center gap-1"
                      >
                        <Plus size={12} /> 新增明細
                      </button>
                    </div>

                    {items.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 bg-zinc-900 p-2 rounded-xl"
                      >
                        <select
                          value={item.categoryId}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[idx].categoryId = e.target.value;
                            setItems(newItems);
                          }}
                          className="bg-zinc-800 text-xs text-white p-1.5 rounded-lg flex-1"
                        >
                          {itemCategories.map((ic) => (
                            <option key={ic.id} value={ic.id}>
                              {ic.name}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          placeholder="單價"
                          value={item.price || ""}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[idx].price = Number(e.target.value);
                            setItems(newItems);
                          }}
                          className="w-16 bg-zinc-800 text-xs text-white p-1.5 rounded-lg text-center"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setItems(items.filter((_, i) => i !== idx))
                          }
                          className="text-zinc-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-800">
                    <span className="text-xs text-zinc-400">備註說明</span>
                    <input
                      type="text"
                      placeholder="點擊輸入備註..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white"
                    />
                  </div>
                </div>
              )}

              {/* 導覽按鈕 */}
              {!initialData && (
                <div className="flex gap-3 mt-auto pt-2">
                  {step > 1 && (
                    <button
                      onClick={() => setStep((s) => Math.max(s - 1, 1))}
                      className="px-5 py-3.5 bg-zinc-800 text-zinc-300 font-semibold rounded-2xl text-sm flex items-center gap-1"
                    >
                      <ChevronLeft size={16} /> 上一步
                    </button>
                  )}

                  {step < 5 ? (
                    <button
                      onClick={() => setStep((s) => Math.min(s + 1, 5))}
                      disabled={step === 1 && !amount}
                      className="flex-1 py-3.5 bg-white text-zinc-950 font-semibold rounded-2xl text-sm flex items-center justify-center gap-1 disabled:opacity-40"
                    >
                      下一步 <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={handleConfirmSave}
                      className="flex-1 py-3.5 bg-white text-zinc-950 font-semibold rounded-2xl text-sm flex items-center justify-center gap-1 shadow-lg"
                    >
                      <Check size={16} /> 確認完成
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
