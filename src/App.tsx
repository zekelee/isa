import { Box, Grid, CssBaseline } from '@mui/material';
import { FloorPlanCanvas } from '@/components/organisms/FloorPlanCanvas';
import { Sidebar } from '@/components/organisms/Sidebar';

function App() {
  return (
    <>
      <CssBaseline />
      <Box sx={{ height: '100vh', width: '100vw' }}>
        <Grid container sx={{ height: '100%' }}>
          <Grid
            sx={{
              height: '100%',
              gridColumn: { xs: 'span 12', md: 'span 8' },
            }}
          >
            <FloorPlanCanvas />
          </Grid>
          <Grid
            sx={{
              height: '100%',
              gridColumn: { xs: 'span 12', md: 'span 4' },
            }}
          >
            <Sidebar />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default App;
