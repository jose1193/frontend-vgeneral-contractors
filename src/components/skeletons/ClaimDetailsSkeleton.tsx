import React from "react";
import { Typography, Paper, Grid, Skeleton } from "@mui/material";

const ClaimDetailsSkeleton: React.FC = () => (
  <Paper elevation={3} sx={{ p: 5, mb: 7 }}>
    {/* Header section */}
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12}>
        <Typography
          variant="h6"
          sx={{ color: "#662401", fontWeight: "bold", mb: 2 }}
        >
          <Skeleton width={200} />
        </Typography>
        <Typography variant="body1" sx={{ color: "black" }}>
          <Skeleton width={100} />
        </Typography>
      </Grid>
    </Grid>

    {/* Main content section */}
    <Grid container spacing={3}>
      {/* Column 1: Property and Customer */}
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

      {/* Column 2: Claim Details and Work Details */}
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
        <Typography variant="subtitle2" sx={{ color: "black" }}>
          <Skeleton width={200} />
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
        <Typography variant="h6" gutterBottom sx={{ mt: 3, color: "#662401" }}>
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
      </Grid>

      {/* Column 3: Insurance and Company Details */}
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
        <Typography variant="subtitle2" sx={{ color: "black" }}>
          <Skeleton width={200} />
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 3, color: "#662401" }}>
          <Skeleton width={150} />
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "black" }}>
          <Skeleton width={200} />
        </Typography>
      </Grid>
    </Grid>
  </Paper>
);

export default ClaimDetailsSkeleton;
