"use client";

import { Box, Container } from "@mui/material";
import ResponsiveAppBar from "../../components/NavbarHome";
import EnterPinForm from "../../components/EnterPin";
import { Suspense } from "react";

export default function EnterPinPage() {
  return (
    <Box sx={{ maxWidth: "auto", margin: "0 auto" }}>
      <ResponsiveAppBar />
      <Container component="main" maxWidth={false} sx={{ maxWidth: "600px" }}>
        <Suspense>
          <EnterPinForm />
        </Suspense>
      </Container>
    </Box>
  );
}
