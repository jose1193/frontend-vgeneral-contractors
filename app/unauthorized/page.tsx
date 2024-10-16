"use client";
import React from "react";
import { Typography, Container, Box, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import ResponsiveAppBar from "../components/NavbarHome";
import { useRouter } from "next/navigation";
export default function UnauthorizedPage() {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "the company";
  const router = useRouter();
  const handleClick = () => {
    router.push("/");
  };
  return (
    <div>
      <ResponsiveAppBar />
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <HomeIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Unauthorized Access
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            We are sorry, but this page is only available to users registered by{" "}
            <span style={{ fontWeight: "bold" }}>{companyName}</span>
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={handleClick}
            startIcon={<HomeIcon />}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    </div>
  );
}
