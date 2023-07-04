import React, { useEffect, useMemo, useRef, useState } from "react";

const data = new Array(2000).fill(" ").map((_, index) => index);

const ONE_PAGE_QUANTITY = 10;

const ITEM_HEIGHT = 50;

const VirtualList: React.FC = () => {
  const [currentDatasource, setCurrentDatasource] = useState(
    data.slice(0, ONE_PAGE_QUANTITY)
  );

  const [currentPage, setCurrentPage] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    setCurrentPage(
      Math.floor(
        (containerRef.current?.scrollTop || 0) /
          ITEM_HEIGHT /
          ONE_PAGE_QUANTITY
      )
    );
  };

  const currentStartIndex = useMemo(
    () => currentPage * ONE_PAGE_QUANTITY,
    [currentPage]
  );

  useEffect(() => {
    setCurrentDatasource(
      data.slice(
        currentStartIndex,
        currentStartIndex + ONE_PAGE_QUANTITY * 2
      )
    );
  }, [currentStartIndex]);

  return (
    <div
      style={{ width: "200px", height: "400px", overflow: "auto" }}
      ref={containerRef}
      onScroll={handleScroll}>
      <div
        style={{
          width: "100%",
          height: ITEM_HEIGHT * data.length,
          position: "relative",
        }}>
        {currentDatasource.map((data, index) => (
          <div
            key={data}
            style={{
              width: `${ITEM_HEIGHT}px`,
              height: `${ITEM_HEIGHT}px`,
              position: "absolute",
              top: 0,
              left: 0,
              transform: `translateY(${
                index * ITEM_HEIGHT + currentStartIndex * ITEM_HEIGHT
              }px)`,
            }}>
            {data}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualList;
