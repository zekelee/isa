import React, { useState, useEffect, useRef } from 'react'
import Draggable from 'react-draggable'
import { Box, Typography } from '@mui/material'
import { useScale } from '@/hooks/useScale'
import { usePlacement } from '@/hooks/usePlacement'
import { usePlacementStore } from '@/store/usePlacementStore'
import type { Database } from '@/types'

type Item = Database['public']['Tables']['items']['Row']

interface FurnitureBoxProps {
  item: Item
}

const FurnitureBox: React.FC<FurnitureBoxProps> = ({ item }) => {
  const { updatePlacement } = usePlacement()
  const placement = usePlacementStore((state) =>
    state.placements.find((p) => p.item_id === item.id)
  )

  const nodeRef = useRef(null)
  const scaledWidth = useScale(item.width)
  const scaledDepth = useScale(item.depth)

  // 1. 떨림 방지를 위한 로컬 좌표 상태 (핵심!)
  const [controlledPos, setControlledPos] = useState({ x: 0, y: 0 })

  // 2. DB에서 값이 바뀌었을 때만 로컬 좌표 업데이트
  useEffect(() => {
    if (placement) {
      setControlledPos({ x: placement.x, y: placement.y })
    }
  }, [placement?.x, placement?.y])

  // 3. 드래그 중에는 UI만 부드럽게 업데이트
  const handleDrag = (_e: any, data: { x: number; y: number }) => {
    setControlledPos({ x: data.x, y: data.y })
  }

  // 4. 드래그 종료 시에만 DB에 저장 (성능 및 떨림 해결)
  const handleStop = (_e: any, data: { x: number; y: number }) => {
    updatePlacement(item.id, data.x, data.y)
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent" // bounds를 'parent'로 설정하여 캔버스 이미지 안으로 한정
      position={controlledPos}
      onDrag={handleDrag}
      onStop={handleStop}
      grid={[1, 1]}
    >
      <Box
        ref={nodeRef}
        sx={{
          width: `${scaledWidth}px`,
          height: `${scaledDepth}px`,
          backgroundColor: 'rgba(0, 150, 136, 0.7)', // 더 깔끔한 테마 컬러
          border: '2px solid #00796b',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'grab',
          position: 'absolute',
          boxSizing: 'border-box',
          zIndex: 10,
          boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
          '&:active': { cursor: 'grabbing', scale: 1.02 },
          transition: 'scale 0.1s, background-color 0.2s',
          userSelect: 'none'
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: '11px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.1,
            pointerEvents: 'none' // 텍스트가 드래그를 방해하지 않도록
          }}
        >
          {item.name}
          <br />
          <span style={{ fontSize: '9px', opacity: 0.8 }}>
            {item.width}x{item.depth}
          </span>
        </Typography>
      </Box>
    </Draggable>
  )
}

export default FurnitureBox
