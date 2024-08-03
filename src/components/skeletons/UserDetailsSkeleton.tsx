import { Box, Divider, Grid, Typography, Paper, Skeleton } from "@mui/material";

export default function UserDetailsSkeleton() {
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
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Skeleton variant="circular" width={50} height={50} />
        <Skeleton
          variant="text"
          width="60%"
          height={40}
          style={{ marginTop: 10 }}
        />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="text" width="70%" />
      </Paper>
    </Box>
  );
}
