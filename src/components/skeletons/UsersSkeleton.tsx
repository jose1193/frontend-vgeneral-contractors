import { Box, Typography, Skeleton } from "@mui/material";

export default function UsersSkeleton() {
  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
      {[...Array(5)].map((_, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            p: 2,
            border: "1px solid #eee",
            borderRadius: 1,
          }}
        >
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
          <Box sx={{ width: "100%" }}>
            <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" height={16} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
