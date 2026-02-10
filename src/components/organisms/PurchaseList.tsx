import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  Checkbox,
  IconButton,
  Divider,
  Typography,
  Stack
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { useItemStore } from '@/store/useItemStore'

export const PurchaseList = () => {
  const { items, fetchItems, addItem, updateItem, removeItem } = useItemStore()
  const [newItemName, setNewItemName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newMemo, setNewMemo] = useState('')
  const [order, setOrder] = useState<string[]>([])
  const [draggingId, setDraggingId] = useState<string | null>(null)

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const baseOrder = useMemo(() => {
    if (order.length > 0) return order
    return [...items].sort((a, b) => a.sort_order - b.sort_order).map((item) => item.id)
  }, [items, order])

  const orderedItems = useMemo(() => {
    const map = new Map(items.map((item) => [item.id, item]))
    return baseOrder
      .map((id) => map.get(id))
      .filter((item): item is (typeof items)[number] => Boolean(item))
  }, [items, baseOrder])

  const handleAddItem = async () => {
    if (!newItemName.trim()) return
    const priceValue = newPrice.trim() ? Number(newPrice) : null
    await addItem({
      name: newItemName.trim(),
      price: Number.isFinite(priceValue) ? priceValue : null,
      memo: newMemo.trim() || null,
      purchased: false
    })
    setNewItemName('')
    setNewPrice('')
    setNewMemo('')
  }

  const moveItem = async (fromId: string, toId: string) => {
    if (fromId === toId) return
    const nextOrder = baseOrder.filter((id) => id !== fromId)
    const toIndex = nextOrder.indexOf(toId)
    nextOrder.splice(toIndex, 0, fromId)
    setOrder(nextOrder)
    await Promise.all(
      nextOrder.map((id, index) => updateItem(id, { sort_order: index + 1 }))
    )
  }

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          alignItems: 'center',
          width: '100%'
        }}
      >
        <TextField
          label="모델명"
          placeholder="예: Bespoke 냉장고, Neo QLED TV"
          size="small"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          sx={{ flex: 2, minWidth: 160 }}
        />
        <TextField
          label="가격"
          size="small"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          sx={{ flex: 1, minWidth: 110 }}
        />
        <TextField
          label="메모"
          size="small"
          value={newMemo}
          onChange={(e) => setNewMemo(e.target.value)}
          sx={{ flex: 1.5, minWidth: 140 }}
        />
        <Button variant="contained" onClick={handleAddItem} sx={{ minWidth: 90 }}>
          추가
        </Button>
      </Box>

      <Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns:
              '40px minmax(140px, 2fr) minmax(110px, 1fr) minmax(140px, 2fr) 40px 40px',
            gap: 1.5,
            mb: 1,
            px: 1,
            alignItems: 'center'
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', textAlign: 'center' }}
          >
            구매
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            모델명
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', textAlign: 'center' }}
          >
            가격
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            메모
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', textAlign: 'center' }}
          >
            삭제
          </Typography>
          <span />
        </Box>
        <List sx={{ p: 0 }}>
          {orderedItems.map((item, index) => {
            return (
              <Box key={item.id}>
                <ListItem
                  sx={{ px: 1, py: 1 }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={async () => {
                    if (draggingId) await moveItem(draggingId, item.id)
                    setDraggingId(null)
                  }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns:
                        '40px minmax(140px, 2fr) minmax(110px, 1fr) minmax(140px, 2fr) 40px 40px',
                      gap: 1.5,
                      alignItems: 'center',
                      width: '100%'
                    }}
                  >
                    <Checkbox
                      checked={item.purchased}
                      onChange={() => updateItem(item.id, { purchased: !item.purchased })}
                    />
                    <Typography variant="body2" noWrap>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'right' }}>
                      {item.price === null ? '-' : `${item.price.toLocaleString()}원`}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {item.memo || '-'}
                    </Typography>
                    <IconButton onClick={() => removeItem(item.id)} aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      aria-label="drag"
                      sx={{ cursor: 'grab' }}
                      draggable
                      onDragStart={() => setDraggingId(item.id)}
                      onDragEnd={() => setDraggingId(null)}
                    >
                      <DragIndicatorIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                {index < orderedItems.length - 1 && <Divider />}
              </Box>
            )
          })}
        </List>
      </Box>
    </Stack>
  )
}
