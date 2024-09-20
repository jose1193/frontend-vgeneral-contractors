import React from "react";
import { Box, Grid, Typography, Skeleton } from "@mui/material";

const ClaimsFormSkeleton: React.FC = () => {
  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
  }) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        <Skeleton width="40%" />
      </Typography>
      <Grid container spacing={2}>
        {children}
      </Grid>
    </Box>
  );

  const SkeletonField: React.FC<{ height?: number }> = ({ height = 56 }) => (
    <Grid item xs={12} sm={6}>
      <Skeleton variant="rectangular" height={height} />
    </Grid>
  );

  return (
    <Box
      sx={{
        width: "100%",

        overflow: "hidden",
      }}
    >
      <Section title="Property and Customer">
        <Grid item xs={11}>
          <Skeleton variant="rectangular" height={56} />
        </Grid>
        <Grid item xs={1}>
          <Skeleton variant="circular" width={40} height={40} />
        </Grid>
      </Section>

      <Section title="Claim Details">
        <SkeletonField />
        <SkeletonField />
        <SkeletonField />
        <SkeletonField />
        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={106} />{" "}
          {/* For multiline TextField */}
        </Grid>
      </Section>

      <Section title="Insurance and Company Details">
        <SkeletonField />
        <SkeletonField />
        <SkeletonField />
      </Section>

      <Section title="Work Details">
        <SkeletonField />
        <SkeletonField />
        <SkeletonField />
        <SkeletonField />
        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={106} />{" "}
          {/* For multiline TextField */}
        </Grid>
      </Section>

      <Section title="Affidavit">
        <SkeletonField />
        <SkeletonField />
        <SkeletonField />
        <SkeletonField />
        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={106} />{" "}
          {/* For multiline TextField */}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Skeleton variant="rectangular" height={40} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Skeleton variant="rectangular" height={40} />
        </Grid>
      </Section>

      <Section title="Alliance Company">
        <SkeletonField />
      </Section>

      <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Skeleton variant="rectangular" height={56} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ClaimsFormSkeleton;
