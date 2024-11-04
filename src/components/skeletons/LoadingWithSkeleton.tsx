// app/loading-with-skeleton.tsx
"use client";
import { Box, CircularProgress, Skeleton, Paper } from "@mui/material";

export default function LoadingWithSkeleton() {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: { xs: "100%", sm: "95%", md: 1000 },
        margin: "0 auto",
      }}
    >
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <CircularProgress size={24} sx={{ mr: 2 }} />
          <Skeleton variant="text" width="60%" />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Skeleton variant="rectangular" height={100} />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Skeleton variant="rectangular" width={200} height={36} />
        </Box>
      </Paper>
    </Box>
  );
}
