import React, { useCallback, useMemo } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

interface SwipeableTabContainerProps {
  children: React.ReactNode;
  activeId: string;
  tabIds: string[];
  onChange: (id: string) => void;
  swipeThreshold?: number;
  velocityThreshold?: number;
}

export const SwipeableTabContainer: React.FC<SwipeableTabContainerProps> = ({
  children,
  activeId,
  tabIds,
  onChange,
  swipeThreshold = 40,
  velocityThreshold = 150,
}) => {
  // 1. 使用 useMemo 快取當前索引，防止未匹配到的 -1 異常
  const currentIndex = useMemo(() => {
    const idx = tabIds.indexOf(activeId);
    return idx !== -1 ? idx : 0;
  }, [tabIds, activeId]);

  const isFirstTab = currentIndex === 0;
  const isLastTab = currentIndex === tabIds.length - 1;

  // 2. 使用 useCallback 避免拖拽處理函式每次渲染重新建立
  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const { offset, velocity } = info;

      // 向左滑動 (Swiping Left) -> 切換到下一頁
      const isSwipeLeft =
        offset.x < -swipeThreshold || velocity.x < -velocityThreshold;
      if (isSwipeLeft && !isLastTab) {
        onChange(tabIds[currentIndex + 1]);
        return;
      }

      // 向右滑動 (Swiping Right) -> 切換到上一頁
      const isSwipeRight =
        offset.x > swipeThreshold || velocity.x > velocityThreshold;
      if (isSwipeRight && !isFirstTab) {
        onChange(tabIds[currentIndex - 1]);
      }
    },
    [
      currentIndex,
      isFirstTab,
      isLastTab,
      onChange,
      swipeThreshold,
      tabIds,
      velocityThreshold,
    ],
  );

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-120px)] overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeId}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          // 3. 在最左/最右頁時減少或取消彈性阻尼，提供更清晰的邊界觸感
          dragElastic={isFirstTab || isLastTab ? 0.05 : 0.12}
          onDragEnd={handleDragEnd}
          className="w-full h-full touch-pan-y"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
