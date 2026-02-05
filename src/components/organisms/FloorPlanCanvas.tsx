// src/components/organisms/FloorPlanCanvas.tsx
import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useItemStore } from '@/store/useItemStore';
import { usePlacementStore } from '@/store/usePlacementStore';
import FurnitureBox from '@/components/molecules/FurnitureBox';
import mapImage from '@/assets/img/map.png';

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
        height: '100%', // 부모 컨테이너에 맞게 높이 조정
        backgroundImage: `url(${mapImage})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
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
