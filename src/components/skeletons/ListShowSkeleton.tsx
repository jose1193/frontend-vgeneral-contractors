import React from "react";
import { Box, Grid, Paper, Skeleton, Typography } from "@mui/material";

const ListShowSkeleton = ({
  columns = 3,
  sections = 2,
  itemsPerSection = 4,
  showTitle = true,
  paperElevation = 3,
}) => {
  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 } }}>
      <Paper elevation={paperElevation} sx={{ p: 3 }}>
        <Grid container spacing={4}>
          {[...Array(columns)].map((_, colIndex) => (
            <Grid item xs={12} md={12 / columns} key={colIndex}>
              {[...Array(sections)].map((_, sectionIndex) => (
                <Box key={sectionIndex} sx={{ mb: 4 }}>
                  {showTitle && (
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "#662401" }}
                    >
                      <Skeleton width={150} />
                    </Typography>
                  )}
                  {[...Array(itemsPerSection)].map((_, itemIndex) => (
                    <Typography
                      key={itemIndex}
                      variant="subtitle2"
                      sx={{ color: "black" }}
                    >
                      <Skeleton width={200} />
                    </Typography>
                  ))}
                </Box>
              ))}
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default ListShowSkeleton;
