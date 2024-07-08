"use client";

import { useSession } from "next-auth/react";
import { Container, Grid, Box, Typography, Paper, Link } from "@mui/material";

import DashboardCards from "../../src/components/dashboard/AdminDashboardCards";
import FinancialSummary from "../../src/components/dashboard/FinancialSummary ";
import UserInfoCard from "../../src/components/dashboard/UserInfoCard";
import ClaimsDashboard from "../../src/components/dashboard/ClaimsDashboard";
import { Suspense } from "react";
import { CircularProgress } from "@mui/material";
export default function HomePage() {
  const { data: session, status } = useSession();

  const user = {
    name: session?.user?.name || "Victor Lara",
    role: "Admin",
    lastLogin: "2024-07-04 10:30 AM",
    profile_photo_path: session?.user?.profile_photo_path, // si está disponible
  };

  console.log("Session status:", status);
  console.log("Session data:", session);

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
        Cargando...
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
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 5,
        ml: -8,
      }}
    >
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
        <Grid item xs={12}>
          <Suspense fallback={<CircularProgress />}>
            <ClaimsDashboard />
          </Suspense>
        </Grid>
      </Grid>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 8, mb: 4 }}
      >
        {`Copyright © ${new Date().getFullYear()} | `}
        <Link
          href="https://vgeneralcontractors.com/"
          color="primary"
          sx={{
            textDecoration: "none",
            fontWeight: "bold",
            ml: 1,
            mr: 1,
          }}
        >
          {process.env.NEXT_PUBLIC_COMPANY_NAME || "V General Contractors"}
        </Link>
        {" | V.1.0"}
      </Typography>
    </Box>
  );
}
