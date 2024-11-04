import { CircularProgress, Box } from "@mui/material";
export default function Loading() {
  // Or a custom loading skeleton component
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
      <CircularProgress />
    </Box>
  );
}
