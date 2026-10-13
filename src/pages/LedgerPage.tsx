import React, { useState } from "react";
import { UI_LABELS } from "../constants/labels";
import { TransactionModal } from "../components/TransactionModal";
import { Plus } from "lucide-react";

export const LedgerPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-2">
      <div>
        <h1 className="text-xl font-bold">{UI_LABELS.ledger.title}</h1>
        <p className="text-xs text-zinc-400 mt-1">管理與檢視當日所有收支明細</p>
      </div>

      {/* 帳本頁面中間的呼出按鈕測試區塊 */}
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/40 gap-4">
        <p className="text-sm text-zinc-400">{UI_LABELS.ledger.emptyText}</p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-white text-zinc-950 text-xs font-semibold rounded-full shadow-lg hover:bg-zinc-200 transition-all active:scale-95"
        >
          <Plus size={16} />
          <span>開啟編輯 / 新增介面</span>
        </button>
      </div>

      {/* 彈出式修改介面 */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          // 這裡未來放儲存邏輯
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default LedgerPage;
