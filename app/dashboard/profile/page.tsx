// app/profile/page.tsx
import UserProfile from "../../../src/components/dashboard/UserProfile";
import ChangePassword from "../../../src/components/dashboard/ChangePassword";
import { Suspense } from "react";
import { Box, Paper, Grid, Typography } from "@mui/material";
import UserProfileSkeleton from "../../../src/components/skeletons/UserProfileSkeleton";
export default function ProfilePage() {
  return (
    <Box >
      <Suspense fallback={<UserProfileSkeleton />}>
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
          Dashboard • Profile Page
        </Typography>
        <UserProfile />
        <ChangePassword />
      </Suspense>
    </Box>
  );
}
