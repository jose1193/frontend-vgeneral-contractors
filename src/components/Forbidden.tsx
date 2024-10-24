"use client";

import React from "react";
import { Typography, Container, Box, Button } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useRouter } from "next/navigation";

export default function Forbidden() {
  const router = useRouter();
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "VG";

  const handleBackToDashboard = () => {
    router.push("/");
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <BlockIcon
          sx={{
            fontSize: 64,
            color: "error.main",
            mb: 2,
          }}
        />

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Access Denied
        </Typography>

        <Typography
          variant="body1"
          align="center"
          paragraph
          color="text.secondary"
        >
          You dont have permission to access this resource. Please contact{" "}
          {companyName} administrators if you believe this is a mistake.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handleBackToDashboard}
          startIcon={<DashboardIcon />}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
}
