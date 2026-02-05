import { useEffect, useState } from 'react';
import { useChecklistStore } from '@/store/useChecklistStore';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export const Checklist = () => {
  const { tasks, fetchTasks, addTask, toggleTask, removeTask } = useChecklistStore();
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      addTask(newTaskText.trim());
      setNewTaskText('');
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          label="새 할 일"
          variant="outlined"
          size="small"
          fullWidth
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <Button variant="contained" onClick={handleAddTask} sx={{ ml: 1, whiteSpace: 'nowrap' }}>
          추가
        </Button>
      </Box>
      <List>
        {tasks.map((task) => (
          <ListItem
            key={task.id}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => removeTask(task.id)}>
                <DeleteIcon />
              </IconButton>
            }
            disablePadding
          >
            <Checkbox
              edge="start"
              checked={task.completed}
              tabIndex={-1}
              disableRipple
              onChange={() => toggleTask(task.id)}
            />
            <ListItemText primary={task.task} sx={{ textDecoration: task.completed ? 'line-through' : 'none' }} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
