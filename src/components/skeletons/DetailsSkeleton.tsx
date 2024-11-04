import React from "react";
import { Typography, Paper, Grid, Skeleton, Box } from "@mui/material";

const DetailsSkeleton: React.FC = () => (
  <Box sx={{ flexGrow: 1, p: { xs: 1, lg: 2 } }}>
    <Paper elevation={3} sx={{ p: 5, mb: 7 }}>
      {/* Main content section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom sx={{ color: "#662401" }}>
            <Skeleton width={150} />
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            <Skeleton width={200} />
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            <Skeleton width={200} />
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            <Skeleton width={200} />
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 2, color: "black" }}>
            <Skeleton width={250} />
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  </Box>
);

export default DetailsSkeleton;
