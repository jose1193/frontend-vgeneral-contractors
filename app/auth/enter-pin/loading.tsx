import { CircularProgress, Box } from "@mui/material";
export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress />
    </Box>
  );
}
