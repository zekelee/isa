// src/components/organisms/FloorPlanCanvas.tsx
import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useItemStore } from '@/store/useItemStore';
import { usePlacementStore } from '@/store/usePlacementStore';
import FurnitureBox from '@/components/molecules/FurnitureBox';

export const FloorPlanCanvas = () => {
  const { items, fetchItems } = useItemStore();
  const { fetchPlacements } = usePlacementStore();

  useEffect(() => {
    // 컴포넌트 마운트 시 아이템과 배치 정보를 모두 불러옵니다.
    fetchItems();
    fetchPlacements();
  }, [fetchItems, fetchPlacements]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100vh', // 전체 뷰포트 높이
        backgroundColor: '#f0f0f0',
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        border: '1px solid #ccc',
        overflow: 'hidden', // 캔버스 밖으로 나가는 것 방지
      }}
    >
      {items.map((item) => (
        <FurnitureBox key={item.id} item={item} />
      ))}
    </Box>
  );
};
