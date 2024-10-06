// app/components/ResponsiveAppBar.tsx
"use client";
import React from "react";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";

import ThemeToggleButton from "./ThemeToggleButton";

const ResponsiveAppBar = () => {
  const theme = useTheme();

  // Determina qué imagen cargar basado en el modo del tema
  const logoSrc =
    theme.palette.mode === "light" ? "/logo.png" : "/logo-white.png";

  return (
    <AppBar
      position="static"
      style={{ background: "transparent", boxShadow: "none" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          {/* Espacio vacío a la izquierda para equilibrar */}
          <div style={{ width: "48px" }} />

          {/* Logo centrado */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              display: "flex",
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color:
                theme.palette.mode === "light"
                  ? theme.palette.text.primary
                  : "inherit",
              textDecoration: "none",
              marginTop: 3,
            }}
          >
            <Image src={logoSrc} alt="Logo" width={130} height={130} />
          </Typography>

          {/* ThemeToggleButton a la derecha */}
          <ThemeToggleButton />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
