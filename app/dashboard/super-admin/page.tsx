"use client";

import { useSession } from "next-auth/react";
import { Container, Grid, Box, Typography, Paper, Link } from "@mui/material";
import DashboardCards from "@/components/dashboard/AdminDashboardCards";
import FinancialSummary from "../../../src/components/dashboard/FinancialSummary ";
import UserInfoCard from "@/components/dashboard/UserInfoCard";
import ClaimsDashboard from "@/components/dashboard/ClaimsDashboard";
import { Suspense } from "react";
import { CircularProgress } from "@mui/material";
import RoleGuard from "../../../src/components/RoleGuard";
import Footer from "../../components/Footer";
export default function SuperAdminDashboardPage() {
  return (
    <RoleGuard allowedRoles={["Super Admin"]}>
      <SuperAdminDashboardContent />
    </RoleGuard>
  );
}

function SuperAdminDashboardContent() {
  const { data: session, status } = useSession();

  const user = {
    name: session?.user?.name || "Admin",
    user_role: session?.user?.user_role || "Unknown",
    lastLogin: "2024-07-04 10:30 AM",
    profile_photo_path: session?.user?.profile_photo_path,
  };

  if (status === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        No has iniciado sesión
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, p: { md: 2, lg: 2 } }}>
      <Grid container spacing={3}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: "bold",
                ml: 3,
                fontSize: {
                  xs: "1.5rem",
                  sm: "1.75rem",
                  md: "2rem",
                  lg: "2.25rem",
                },
              }}
            >
              Dashboard
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box display="flex" justifyContent="flex-end">
              <Suspense fallback={<CircularProgress />}>
                <UserInfoCard user={user} />
              </Suspense>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Suspense fallback={<CircularProgress />}>
            <DashboardCards />
          </Suspense>
        </Grid>
        <Grid item xs={12}>
          <Suspense fallback={<CircularProgress />}>
            <FinancialSummary />
          </Suspense>
        </Grid>
      </Grid>

      {/* Footer */}
      <Footer />
    </Box>
  );
}
