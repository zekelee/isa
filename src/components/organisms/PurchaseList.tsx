import { useEffect, useState } from 'react'
import { useItemStore } from '@/store/useItemStore'
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

export const PurchaseList = () => {
  const { items, fetchItems, addItem, updateItem, removeItem } = useItemStore()
  const [newItemName, setNewItemName] = useState('')

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleAddItem = () => {
    if (newItemName.trim()) {
      addItem({ name: newItemName.trim(), width: 0, depth: 0 }) // 기본값으로 width, depth 추가
      setNewItemName('')
    }
  }

  const handleStatusChange = (
    id: string,
    event: SelectChangeEvent<'todo' | 'bought' | 'installed'>
  ) => {
    const status = event.target.value as 'todo' | 'bought' | 'installed'
    updateItem(id, { status })
  }

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          label="새 구매 항목"
          variant="outlined"
          size="small"
          fullWidth
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
        />
        <Button
          variant="contained"
          onClick={handleAddItem}
          sx={{ ml: 1, whiteSpace: 'nowrap' }}
        >
          추가
        </Button>
      </Box>
      <List>
        {items.map((item) => (
          <ListItem
            key={item.id}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => removeItem(item.id)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={item.name} />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>상태</InputLabel>
              <Select
                value={item.status || 'todo'}
                label="상태"
                onChange={(e) => handleStatusChange(item.id, e)}
              >
                <MenuItem value="todo">살 것</MenuItem>
                <MenuItem value="bought">샀음</MenuItem>
                <MenuItem value="installed">배치완료</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}
