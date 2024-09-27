import React from "react";
import { Box, Grid, Paper, Skeleton, Typography } from "@mui/material";

const GeneralFormSkeleton = ({
  title = true,
  fields = 3,
  lastFieldWidth = "30%",
  paperElevation = 3,
  spacing = 3,
}) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        marginLeft: -7,
        overflow: "hidden",
        p: { xs: 3, sm: 3, md: 2, lg: 4 },
      }}
    >
      <Box sx={{ width: "100%", mx: "auto", mt: 4 }}>
        <Paper elevation={paperElevation} sx={{ p: 3 }}>
          {title && (
            <Typography variant="h5" component="h2" gutterBottom>
              <Skeleton width="40%" />
            </Typography>
          )}

          <Grid container spacing={spacing}>
            {[...Array(fields - 1)].map((_, index) => (
              <Grid item xs={12} key={index}>
                <Skeleton variant="rectangular" height={56} />
              </Grid>
            ))}

            <Grid item xs={12}>
              <Skeleton
                variant="rectangular"
                height={56}
                width={lastFieldWidth}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default GeneralFormSkeleton;
