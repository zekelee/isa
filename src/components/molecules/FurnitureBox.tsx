// src/components/molecules/FurnitureBox.tsx
import React, { useMemo, useRef } from 'react';
import Draggable from 'react-draggable';
import { Box } from '@mui/material';
import { useScale } from '@/hooks/useScale';
import { usePlacement } from '@/hooks/usePlacement';
import { usePlacementStore } from '@/store/usePlacementStore';
import { floorPlan } from '@/constants/floorPlan'; // 도면 정보를 가져옵니다.
import type { Database } from '@/types';

type Item = Database['public']['Tables']['items']['Row'];

interface FurnitureBoxProps {
  item: Item;
}

const FurnitureBox: React.FC<FurnitureBoxProps> = ({ item }) => {
  const { updatePlacement } = usePlacement();
  const placement = usePlacementStore((state) =>
    state.placements.find((p) => p.item_id === item.id)
  );
  const nodeRef = useRef(null);

  const scaledWidth = useScale(item.width);
  const scaledDepth = useScale(item.depth);

  const bounds = useMemo(() => {
    if (!floorPlan || floorPlan.length === 0) {
      return 'parent';
    }

    const minX = Math.min(...floorPlan.map((r) => r.x));
    const minY = Math.min(...floorPlan.map((r) => r.y));
    const maxX = Math.max(...floorPlan.map((r) => r.x + r.width));
    const maxY = Math.max(...floorPlan.map((r) => r.y + r.height));

    return {
      left: minX,
      top: minY,
      right: maxX - scaledWidth,
      bottom: maxY - scaledDepth,
    };
  }, [scaledWidth, scaledDepth]);

  const handleDrag = (_e: any, data: { x: number; y: number }) => {
    // 참고: onDrag는 드래그 중 계속 호출되어 DB에 많은 요청을 보낼 수 있습니다.
    // 성능 최적화가 필요하다면 이 부분을 디바운스(debounce) 처리하는 것을 고려해보세요.
    updatePlacement(item.id, data.x, data.y);
  };

  const position = placement ? { x: placement.x, y: placement.y } : { x: 0, y: 0 };

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds={bounds}
      position={position}
      onDrag={handleDrag} // onStop에서 onDrag로 변경하여 실시간 저장
      grid={[1, 1]}
    >
      <Box
        ref={nodeRef}
        sx={{
          width: `${scaledWidth}px`,
          height: `${scaledDepth}px`,
          border: '1px solid black',
          backgroundColor: 'rgba(255, 165, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'move',
          position: 'absolute',
          boxSizing: 'border-box',
          zIndex: 1, // 가구가 배경(Paper)보다 위에 오도록 z-index 설정
        }}
      >
        <span style={{ fontSize: '10px', userSelect: 'none' }}>{item.name}</span>
      </Box>
    </Draggable>
  );
};

export default FurnitureBox;
