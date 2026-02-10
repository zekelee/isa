import { Box, CssBaseline, Container, Typography, Grid, Paper } from '@mui/material'
import { PurchaseList } from '@/components/organisms/PurchaseList'
import { TodoList } from '@/components/organisms/TodoList'

function App() {
  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background:
            'linear-gradient(135deg, rgba(255,248,235,1) 0%, rgba(240,246,255,1) 100%)',
          py: 4
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              이사 준비 통합 관리 플랫폼
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
              구매 리스트와 할 일 리스트를 한 화면에서 관리하세요.
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper elevation={2} sx={{ p: 2.5, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  구매 리스트
                </Typography>
                <PurchaseList />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper elevation={2} sx={{ p: 2.5, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  할 일 리스트
                </Typography>
                <TodoList />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default App;
