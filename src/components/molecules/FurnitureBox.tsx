// src/components/molecules/FurnitureBox.tsx
import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { Box } from '@mui/material';
import { useScale } from '@/hooks/useScale';
import { usePlacement } from '@/hooks/usePlacement';
import { usePlacementStore } from '@/store/usePlacementStore';
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
  const nodeRef = useRef(null); // Ref 생성

  const scaledWidth = useScale(item.width);
  const scaledDepth = useScale(item.depth);

  const handleStop = (_e: any, data: { x: number; y: number }) => {
    updatePlacement(item.id, data.x, data.y);
  };

  // Draggable 컴포넌트에 전달할 위치. placement가 없으면 기본값(0,0)을 사용합니다.
  const position = placement ? { x: placement.x, y: placement.y } : { x: 0, y: 0 };

  return (
    <Draggable
      nodeRef={nodeRef} // Draggable에 Ref 전달
      bounds="parent"
      position={position}
      onStop={handleStop}
      grid={[1, 1]}
    >
      <Box
        ref={nodeRef} // 실제 DOM 노드에 Ref 연결
        sx={{
          width: `${scaledWidth}px`,
          height: `${scaledDepth}px`,
          border: '1px solid black',
          backgroundColor: 'rgba(255, 165, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'move',
          position: 'absolute', // Draggable 자식은 absolute 포지셔닝이 필요
          boxSizing: 'border-box',
        }}
      >
        <span style={{ fontSize: '10px', userSelect: 'none' }}>{item.name}</span>
      </Box>
    </Draggable>
  );
};

export default FurnitureBox;

