import React, { useEffect, useState } from "react";

export const CameraPage: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    // 延遲 400ms 開啟相機，避免快速劃過時觸發硬體
    const timer = setTimeout(() => {
      setIsCameraActive(true);
    }, 400);

    return () => {
      clearTimeout(timer); // 一旦快速劃過離開此頁，立刻取消相機啟動
    };
  }, []);

  return (
    <div>{isCameraActive ? <p>📷 相機畫面渲染中...</p> : <p>載入中...</p>}</div>
  );
};

export default CameraPage;
