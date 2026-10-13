import React, { useState } from "react";
import { BottomNav, NavItem } from "../components/BottomNav";
import { SidebarDrawer } from "../components/SidebarDrawer"; // 引入側邊抽屜
import { Wallet, BookOpen, Camera, LayoutGrid, Receipt } from "lucide-react";

import AccountsPage from "../pages/AccountsPage";
import LedgerPage from "../pages/LedgerPage";
import CameraPage from "../pages/CameraPage";
import OverviewPage from "../pages/OverviewPage";
import InboxPage from "../pages/InboxPage";

const NAV_ITEMS: NavItem[] = [
  { id: "accounts", label: "帳戶", icon: <Wallet size={18} /> },
  { id: "ledger", label: "帳本", icon: <BookOpen size={18} /> },
  { id: "camera", label: "拍照", icon: <Camera size={18} /> },
  { id: "overview", label: "總覽", icon: <LayoutGrid size={18} /> },
  { id: "inbox", label: "發票", icon: <Receipt size={18} /> },
];

export const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("ledger");

  // 1. 新增側邊抽屜的開關狀態
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const renderPage = () => {
    switch (activeTab) {
      case "accounts":
        return <AccountsPage />;
      case "ledger":
        return <LedgerPage />;
      case "camera":
        return <CameraPage />;
      case "overview":
        return <OverviewPage />;
      case "inbox":
        return <InboxPage />;
      default:
        return <LedgerPage />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-950 text-white overflow-hidden relative">
      {/* 2. 新增頂部 Header (包含左上角漢堡按鈕 ☰ 讓抽屜滑出) */}
      <header className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800 shrink-0 z-10">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 text-xl text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors active:scale-95"
          aria-label="打開選單"
        >
          ☰
        </button>
        <h1 className="text-sm font-bold tracking-widest text-zinc-200">
          私記
        </h1>
        <div className="w-8" /> {/* 佔位塊，讓標題完美置中 */}
      </header>

      {/* 3. 頁面主要內容區域 */}
      <main className="flex-1 w-full overflow-y-auto p-4 pb-28">
        {renderPage()}
      </main>

      {/* 4. 底部導覽列 */}
      <BottomNav
        items={NAV_ITEMS}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id)}
      />

      {/* 5. 側邊導覽抽屜 (掛載在最上層 Root，確保覆蓋全畫面) */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
};

export default MainLayout;
