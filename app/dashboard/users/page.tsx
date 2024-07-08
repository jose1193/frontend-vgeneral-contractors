import { Box, Paper, Typography } from "@mui/material";

import Users from "../../../src/components/dashboard/UsersContent";

export default function UsersDashboard() {
  return (
    <Box
      sx={{
        width: "100%",
        ml: -6,
        overflow: "hidden",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          textAlign: "left",
          mb: 3,
          fontSize: {
            xs: "1.5rem",
            sm: "1.75rem",
            md: "2rem",
            lg: "2.25rem",
          },
          fontWeight: "bold",
          ml: 4,
        }}
      >
        Users
      </Typography>
      <Users />
    </Box>
  );
}
