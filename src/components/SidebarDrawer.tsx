import React from "react";

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* 1. 左側滑出面板 (佔 82% 寬度，配合深色主題 bg-zinc-900) */}
      <div
        className="w-[82%] max-w-sm bg-zinc-900 text-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out z-10 border-r border-zinc-800"
        onClick={(e) => e.stopPropagation()} // 防止點擊內容時誤觸關閉
      >
        {/* 標題區 */}
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-base font-bold text-zinc-100">私記 - 選單</h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg transition-colors"
            aria-label="關閉選單"
          >
            ✕
          </button>
        </div>

        {/* 導覽選單列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <button
            onClick={onClose}
            className="w-full text-left p-3 rounded-lg hover:bg-zinc-800 text-zinc-200 font-medium transition-colors"
          >
            🏷️ 分類與標籤管理
          </button>
          <button
            onClick={onClose}
            className="w-full text-left p-3 rounded-lg hover:bg-zinc-800 text-zinc-200 font-medium transition-colors"
          >
            ⚙️ 系統設定
          </button>
          <button
            onClick={onClose}
            className="w-full text-left p-3 rounded-lg hover:bg-zinc-800 text-zinc-200 font-medium transition-colors"
          >
            💾 資料備份與還原
          </button>
        </div>

        {/* 底部版本標示 */}
        <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500 text-center">
          Si-Ji PWA v1.0.0
        </div>
      </div>

      {/* 2. 右側剩餘空間 (點擊可退出抽屜) */}
      <div
        className="flex-1 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
    </div>
  );
};

export default SidebarDrawer;
