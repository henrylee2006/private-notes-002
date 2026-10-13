import React from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, Check } from "lucide-react";
import { UI_LABELS } from "../constants/labels";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.y > 80 || velocity.y > 200) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col justify-end overflow-hidden">
          {/* 背景遮罩：移除 backdrop-blur 改用深色實色半透明，確保手機端 60/120fps 絲滑不卡頓 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/90"
          />

          {/* 彈出視窗本體：最高層級、覆蓋導覽列、支援下拉手勢 */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.1 }}
            onDragEnd={handleDragEnd}
            className="relative w-full h-[calc(100vh-48px)] bg-zinc-900 border-t border-white/10 rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden z-10 text-white cursor-default"
          >
            {/* 1. 頂部導覽列與手勢拖曳區 (固定不滾動) */}
            <div className="flex flex-col items-center pt-3 pb-3 border-b border-zinc-800 shrink-0 cursor-grab active:cursor-grabbing select-none">
              {/* iOS 風格小橫條指示器 */}
              <div className="w-10 h-1 bg-zinc-700 rounded-full mb-3" />

              <div className="w-full flex items-center justify-between px-6">
                {/* 左上角：叉叉取消 */}
                <button
                  onClick={onClose}
                  className="p-2 -ml-2 text-zinc-400 hover:text-white rounded-full transition-colors"
                  aria-label={UI_LABELS.common.cancel}
                >
                  <X size={20} />
                </button>

                <h2 className="text-sm font-semibold tracking-wide">
                  交易總攬與明細
                </h2>

                {/* 右上角：勾勾確認 */}
                <button
                  onClick={onConfirm}
                  className="p-2 -mr-2 text-white bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
                  aria-label={UI_LABELS.common.confirm}
                >
                  <Check size={20} />
                </button>
              </div>
            </div>

            {/* 2. 可捲動內容主體容器 (Scrollable Body) */}
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
              {/* 區塊 A：核心金額展示區 */}
              <div className="flex flex-col items-center justify-center py-6 bg-zinc-800/40 rounded-2xl border border-white/5 shadow-inner">
                <span className="text-xs text-zinc-400 mb-1">交易金額</span>
                <div className="text-4xl font-bold tracking-tight text-white">
                  $ 1,280
                </div>
              </div>

              {/* 區塊 B：分類與帳戶選擇 (雙欄 Grid) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-zinc-800/50 border border-white/5 flex flex-col gap-1 cursor-pointer hover:bg-zinc-800 transition-colors">
                  <span className="text-xs text-zinc-400">分類</span>
                  <span className="text-sm font-medium flex items-center gap-1.5 mt-0.5">
                    🍔 餐飲美食
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-800/50 border border-white/5 flex flex-col gap-1 cursor-pointer hover:bg-zinc-800 transition-colors">
                  <span className="text-xs text-zinc-400">扣款帳戶</span>
                  <span className="text-sm font-medium flex items-center gap-1.5 mt-0.5">
                    💳 現金 / 銀行
                  </span>
                </div>
              </div>

              {/* 區塊 C：細節微調容器 (日期與備註) */}
              <div className="flex flex-col gap-4 bg-zinc-800/30 rounded-2xl p-4 border border-white/5">
                {/* 日期列 */}
                <div className="flex justify-between items-center py-2 border-b border-zinc-800 text-sm">
                  <span className="text-zinc-400">日期時間</span>
                  <span className="font-medium">2026-10-10 21:03</span>
                </div>

                {/* 備註輸入欄位 */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <span className="text-xs text-zinc-400">備註說明</span>
                  <input
                    type="text"
                    placeholder="點擊輸入備註（選填）..."
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/50 transition-colors"
                  />
                </div>
              </div>

              {/* 底部保留安全距離 */}
              <div className="h-8 shrink-0" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
