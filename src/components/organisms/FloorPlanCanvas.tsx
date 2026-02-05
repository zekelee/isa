// src/components/organisms/FloorPlanCanvas.tsx
import { useEffect } from 'react'
import { Paper } from '@mui/material'
import { useItemStore } from '@/store/useItemStore'
import { usePlacementStore } from '@/store/usePlacementStore'
import FurnitureBox from '@/components/molecules/FurnitureBox'
import mapImage from '@/assets/img/map.png'

export const FloorPlanCanvas = () => {
  const { items, fetchItems } = useItemStore()
  const { fetchPlacements } = usePlacementStore()

  useEffect(() => {
    // 컴포넌트 마운트 시 아이템과 배치 정보를 모두 불러옵니다.
    fetchItems()
    fetchPlacements()
  }, [fetchItems, fetchPlacements])

  return (
    <Paper
      sx={{
        width: '100%',
        maxWidth: '1200px', // 적절한 최대 너비
        aspectRatio: '1088 / 705', // ★ 중요: 아까 잘라온 이미지의 가로:세로 비율 입력
        position: 'relative',
        backgroundImage: `url(${mapImage})`,
        backgroundSize: '100% 100%', // 이미지를 부모 박스에 꽉 채움
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden', // 가구가 튀어나가지 않게
        mx: 'auto'
      }}
    >
      {items.map((item) => (
        <FurnitureBox key={item.id} item={item} />
      ))}
    </Paper>
  )
}
