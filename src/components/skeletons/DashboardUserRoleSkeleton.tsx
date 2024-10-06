import React from "react";
import {
  Grid,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
} from "@mui/material";

const DashboardItemSkeleton = () => (
  <Card
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <CardHeader
      avatar={<Skeleton variant="circular" width={56} height={56} />}
      title={<Skeleton variant="text" width="60%" />}
    />
    <CardContent>
      <Skeleton variant="rectangular" width="40%" height={36} />
    </CardContent>
  </Card>
);

const DashboardUserRoleSkeleton = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 5, ml: -8 }}>
      <Grid container spacing={3}>
        {/* Welcome Section Skeleton */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Skeleton
              variant="circular"
              width={100}
              height={100}
              sx={{ mb: 2 }}
            />
            <Skeleton variant="text" width="60%" height={40} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" height={24} />
          </Paper>
        </Grid>

        {/* Dashboard Items Skeletons */}
        {[...Array(4)].map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <DashboardItemSkeleton />
          </Grid>
        ))}

        {/* Recent Activity Skeleton */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom component="div">
              <Skeleton variant="text" width="30%" />
            </Typography>
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} variant="text" sx={{ my: 1 }} />
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardUserRoleSkeleton;
