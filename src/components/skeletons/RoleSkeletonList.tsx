import { Box, Skeleton } from "@mui/material";

const RoleSkeletonList = () => {
  const rows = 5; // Number of skeleton rows to display
  const columns = 4; // Number of columns in your data grid

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      {/* Header */}
      <Box sx={{ display: "flex", mb: 2 }}>
        {[...Array(columns)].map((_, index) => (
          <Box key={index} sx={{ flex: 1, mr: 2 }}>
            <Skeleton variant="text" width="80%" height={32} />
          </Box>
        ))}
        <Box sx={{ width: 100 }}>
          <Skeleton variant="text" width="100%" height={32} />
        </Box>
      </Box>

      {/* Rows */}
      {[...Array(rows)].map((_, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{ display: "flex", mb: 2, alignItems: "center" }}
        >
          {[...Array(columns)].map((_, colIndex) => (
            <Box key={colIndex} sx={{ flex: 1, mr: 2 }}>
              <Skeleton variant="text" width="90%" height={24} />
            </Box>
          ))}
          <Box sx={{ width: 100, display: "flex", justifyContent: "center" }}>
            <Skeleton variant="rectangular" width={40} height={40} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default RoleSkeletonList;
