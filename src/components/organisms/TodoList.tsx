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
  Typography
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { useTodoStore } from '@/store/useTodoStore'

export const TodoList = () => {
  const { todos, fetchTodos, addTodo, toggleTodo, updateTodo, removeTodo } = useTodoStore()
  const [newTodoText, setNewTodoText] = useState('')
  const [order, setOrder] = useState<string[]>([])
  const [draggingId, setDraggingId] = useState<string | null>(null)

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  const baseOrder = useMemo(() => {
    if (order.length > 0) return order
    return [...todos].sort((a, b) => a.sort_order - b.sort_order).map((todo) => todo.id)
  }, [todos, order])

  const orderedTodos = useMemo(() => {
    const map = new Map(todos.map((todo) => [todo.id, todo]))
    return baseOrder
      .map((id) => map.get(id))
      .filter((todo): todo is (typeof todos)[number] => Boolean(todo))
  }, [todos, baseOrder])

  const handleAddTodo = async () => {
    if (!newTodoText.trim()) return
    await addTodo(newTodoText.trim())
    setNewTodoText('')
  }

  const moveTodo = async (fromId: string, toId: string) => {
    if (fromId === toId) return
    const next = baseOrder.filter((id) => id !== fromId)
    const toIndex = next.indexOf(toId)
    next.splice(toIndex, 0, fromId)
    setOrder(next)
    await Promise.all(next.map((id, index) => updateTodo(id, { sort_order: index + 1 })))
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        <TextField
          label="할 일"
          placeholder="예: 전입신고, 입주 청소 예약"
          size="small"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          sx={{ flex: 1, minWidth: 220 }}
        />
        <Button variant="contained" onClick={handleAddTodo} sx={{ minWidth: 90 }}>
          추가
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '40px minmax(160px, 1fr) 40px 40px',
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
          완료
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          할 일
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
        {orderedTodos.map((todo, index) => {
          return (
            <Box key={todo.id}>
              <ListItem
                sx={{ px: 1, py: 1 }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={async () => {
                  if (draggingId) await moveTodo(draggingId, todo.id)
                  setDraggingId(null)
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '40px minmax(160px, 1fr) 40px 40px',
                    gap: 1.5,
                    alignItems: 'center',
                    width: '100%'
                  }}
                >
                  <Checkbox checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
                  <Typography
                    variant="body2"
                    sx={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                    noWrap
                  >
                    {todo.task}
                  </Typography>
                  <IconButton onClick={() => removeTodo(todo.id)} aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    aria-label="drag"
                    sx={{ cursor: 'grab' }}
                    draggable
                    onDragStart={() => setDraggingId(todo.id)}
                    onDragEnd={() => setDraggingId(null)}
                  >
                    <DragIndicatorIcon />
                  </IconButton>
                </Box>
              </ListItem>
              {index < orderedTodos.length - 1 && <Divider />}
            </Box>
          )
        })}
      </List>
    </Box>
  )
}
