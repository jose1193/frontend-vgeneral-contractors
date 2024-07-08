import { Box, Paper, Grid, Typography } from "@mui/material";
import { Suspense } from "react";
import { CircularProgress } from "@mui/material";
import KanbamContent from "../../../src/components/dashboard/KanbamContent";
export default function Page() {
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
          Stages
        </Typography>
        <KanbamContent />
      </Box>
    </Suspense>
  );
}
