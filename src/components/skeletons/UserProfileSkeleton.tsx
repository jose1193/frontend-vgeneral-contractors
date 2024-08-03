import { Box, Divider, Grid, Typography, Paper, Skeleton } from "@mui/material";

export default function UserProfileSkeleton() {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Paper
        elevation={3}
        sx={{ p: 3, border: "1px solid rgba(255, 255, 255, 0.2)" }}
      >
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "flex-start" },
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "center", md: "flex-start" },
                mb: { xs: 2, md: 0 },
              }}
            >
              <Skeleton variant="circular" width={100} height={100} />
              <Box
                sx={{
                  ml: { xs: 0, md: 2 },
                  mt: { xs: 2, md: 0 },
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                <Skeleton variant="text" width={250} height={40} />
                <Skeleton variant="text" width={200} height={20} />
              </Box>
            </Box>
            <Box
              sx={{
                alignSelf: { xs: "center", md: "flex-end" },
                mt: { xs: 2, md: 0 },
                textAlign: { xs: "center", md: "right" },
              }}
            >
              <Skeleton variant="text" width={250} height={20} />
              <Skeleton variant="text" width={250} height={20} />
            </Box>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {[...Array(5)].map((_, index) => (
              <Skeleton
                key={index}
                variant="text"
                width="95%"
                height={56}
                sx={{ mb: 2 }}
              />
            ))}
          </Grid>
          <Grid item xs={12} md={6}>
            {[...Array(4)].map((_, index) => (
              <Skeleton
                key={index}
                variant="text"
                width="95%"
                height={56}
                sx={{ mb: 2 }}
              />
            ))}
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Skeleton variant="rectangular" width={250} height={48} />
        </Box>
      </Paper>
    </Box>
  );
}
