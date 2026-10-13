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
      {/* 1. 左側滑出面板 (佔據約 82% 寬度，保留右側一指寬度點擊退出) */}
      <div
        className="w-[82%] max-w-sm bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out z-10"
        onClick={(e) => e.stopPropagation()} // 防止點擊內容時誤觸關閉
      >
        {/* 抽屜標題區 */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">私記 - 選單</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-black rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* 導覽選單列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <a
            href="#categories"
            className="block p-3 rounded-lg hover:bg-gray-100 font-medium text-gray-700"
          >
            🏷️ 分類與標籤管理
          </a>
          <a
            href="#settings"
            className="block p-3 rounded-lg hover:bg-gray-100 font-medium text-gray-700"
          >
            ⚙️ 系統設定
          </a>
          <a
            href="#backup"
            className="block p-3 rounded-lg hover:bg-gray-100 font-medium text-gray-700"
          >
            💾 資料備份與還原
          </a>
        </div>

        {/* 底部版本資訊 */}
        <div className="p-4 border-t text-xs text-gray-400 text-center">
          Si-Ji PWA v1.0.0
        </div>
      </div>

      {/* 2. 右側剩餘的空白區域 (自動填滿剩餘空間，點擊直接關閉抽屜) */}
      <div
        className="flex-1 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
    </div>
  );
};
