"use client";

import { Box, Container, CssBaseline } from "@mui/material";
import ResponsiveAppBar from "../../components/NavbarHome";
import ForgotPasswordForm from "../../components/ForgotPasswordForm";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
  return (
    <Box sx={{ maxWidth: "auto", margin: "0 auto" }}>
      <ResponsiveAppBar />
      <Container component="main" maxWidth={false} sx={{ maxWidth: "600px" }}>
        <CssBaseline />
        <Suspense>
          <ForgotPasswordForm />
        </Suspense>
      </Container>
    </Box>
  );
}
