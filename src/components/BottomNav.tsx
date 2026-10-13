import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface BottomNavProps {
  items: NavItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  items,
  activeId,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // 根據觸控/滑鼠位置計算對應的 Tab Index
  const updateHoverFromPointer = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    const relativeX = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(relativeX, rect.width));
    const ratio = clampedX / rect.width;

    const targetIndex = Math.min(
      items.length - 1,
      Math.floor(ratio * items.length),
    );

    setHoverIndex(targetIndex);
  };

  // 按下任意位置
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsInteracting(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateHoverFromPointer(e.clientX);
  };

  // 按住並滑動（背板跟隨，但不立即切換頁面）
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isInteracting) return;
    updateHoverFromPointer(e.clientX);
  };

  // 放開時才真正觸發頁面切換
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsInteracting(false);
    if (hoverIndex !== null && items[hoverIndex].id !== activeId) {
      onChange(items[hoverIndex].id);
    }
    setHoverIndex(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const displayIndex =
    hoverIndex !== null
      ? hoverIndex
      : items.findIndex((i) => i.id === activeId);

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 select-none">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative flex items-center gap-1.5 p-1.5 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl cursor-pointer touch-none"
      >
        {items.map((item, index) => {
          const isActive = index === displayIndex;

          return (
            <div
              key={item.id}
              className={`relative px-4 py-2 text-[11px] font-medium transition-colors duration-200 rounded-full flex flex-col items-center justify-center gap-1 min-w-[58px] ${
                isActive ? "text-zinc-950 font-semibold" : "text-zinc-400"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white rounded-full shadow-md z-0"
                  transition={{
                    type: "spring",
                    stiffness: isInteracting ? 600 : 400,
                    damping: isInteracting ? 35 : 30,
                  }}
                />
              )}

              {item.icon && (
                <span className="relative z-10 text-lg flex items-center justify-center pointer-events-none">
                  {item.icon}
                </span>
              )}

              <span className="relative z-10 leading-none pointer-events-none">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
