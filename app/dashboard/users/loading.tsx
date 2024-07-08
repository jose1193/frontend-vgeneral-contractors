import { Box, Skeleton } from "@mui/material";

export default function Loading() {
  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      {/* Skeleton for the title */}
      <Skeleton
        variant="text"
        width={200}
        height={40}
        sx={{
          mb: 3,
          fontSize: {
            xs: "1.5rem",
            sm: "1.75rem",
            md: "2rem",
            lg: "2.25rem",
          },
        }}
      />

      {/* Skeleton for user list items */}
      {[...Array(5)].map((_, index) => (
        <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
          <Box sx={{ width: "100%" }}>
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="60%" height={20} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
