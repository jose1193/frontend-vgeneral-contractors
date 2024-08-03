import { Box, Paper, Grid, Typography } from "@mui/material";
import Claims from "../../../src/components/dashboard/Claims";
import { Suspense } from "react";
import { CircularProgress } from "@mui/material";

export default function ClaimContent() {
  return (
    <Suspense fallback={<CircularProgress />}>
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
          Claims
        </Typography>
        <Claims />
      </Box>
    </Suspense>
  );
}
