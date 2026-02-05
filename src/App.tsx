import { Box, Grid, CssBaseline } from '@mui/material';
import { FloorPlanCanvas } from '@/components/organisms/FloorPlanCanvas';
import { Sidebar } from '@/components/organisms/Sidebar';

function App() {
  return (
    <>
      <CssBaseline />
      <Box sx={{ height: '100vh', width: '100vw', display: 'flex' }}>
        <Grid container sx={{ flexGrow: 1 }}>
          <Grid xs={12} md={8}>
            <FloorPlanCanvas />
          </Grid>
          <Grid xs={12} md={4}>
            <Sidebar />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default App;
