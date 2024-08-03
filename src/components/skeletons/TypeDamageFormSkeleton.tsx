import { Box, Grid, Paper, Skeleton, Typography } from "@mui/material";

const TypeDamageFormSkeleton = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "hidden",
        ml: -7,
        mb: 10,
        p: { xs: 3, sm: 3, md: 2, lg: 4 },
      }}
    >
      <Box sx={{ width: "100%", mx: "auto", mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            <Skeleton width="40%" />
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Skeleton variant="rectangular" height={56} />
            </Grid>

            <Grid item xs={12}>
              <Skeleton variant="rectangular" height={56} />
            </Grid>

            <Grid item xs={12}>
              <Skeleton variant="rectangular" height={100} />
            </Grid>

            <Grid item xs={12}>
              <Skeleton variant="rectangular" height={56} width="30%" />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default TypeDamageFormSkeleton;
