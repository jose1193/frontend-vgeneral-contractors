"use client";

import { Box, Container } from "@mui/material";
import ResponsiveAppBar from "../../components/NavbarHome";
import ResetPasswordForm from "../../components/ResetPasswordForm";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Box sx={{ maxWidth: "auto", margin: "0 auto" }}>
      <ResponsiveAppBar />
      <Container component="main" maxWidth={false} sx={{ maxWidth: "600px" }}>
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </Container>
    </Box>
  );
}
