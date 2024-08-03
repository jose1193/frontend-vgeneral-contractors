import { Box, Grid, Skeleton, Typography } from "@mui/material";

// Componente Skeleton para el dashboard
export default function DashboardSkeleton() {
  return (
    <Box sx={{ flexGrow: 1, p: 5, ml: -8 }}>
      <Grid container spacing={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="text" width="50%" height={60} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={100} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={200} />
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={300} />
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={400} />
        </Grid>
      </Grid>
    </Box>
  );
}
