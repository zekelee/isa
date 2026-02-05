// src/components/organisms/Sidebar.tsx
import { Stack, Paper } from '@mui/material';
import { Checklist } from './Checklist';
import { PurchaseList } from './PurchaseList';

export const Sidebar = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      <Stack spacing={3}>
        <PurchaseList />
        <Checklist />
      </Stack>
    </Paper>
  );
};
