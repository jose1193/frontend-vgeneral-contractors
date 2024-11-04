import DashboardUserRoleSkeleton from "../../../src/components/skeletons/DashboardUserRoleSkeleton";
import { Box } from "@mui/material";

export default function Loading() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      sx={{
        flexGrow: 1,
        overflow: "hidden",
        ml: -3,
        mb: 10,
        p: { xs: 3, sm: 3, md: 2, lg: 4 },
      }}
    >
      <DashboardUserRoleSkeleton />
    </Box>
  );
}
