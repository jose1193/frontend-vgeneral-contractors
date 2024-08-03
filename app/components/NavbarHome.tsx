// app/components/ResponsiveAppBar.tsx
"use client";
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";

import ThemeToggleButton from "./ThemeToggleButton"; // asegúrate de importar correctamente

const pages = [
  //{ name: "Home", href: "/" },
  { name: "About Us", href: "https://vgeneralcontractors.com/about-us/" },
  { name: "Portfolio", href: "https://vgeneralcontractors.com/portfolio/" },
  { name: "Contact", href: "https://vgeneralcontractors.com/contact/" },
]; // Ejemplo de páginas externas

const settings = ["Profile", "Account", "Logout"]; // Ejemplo de configuraciones

const ResponsiveAppBar = () => {
  const theme = useTheme();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Determina qué imagen cargar basado en el modo del tema
  const logoSrc =
    theme.palette.mode === "light" ? "/logo.png" : "/logo-white.png";

  return (
    <AppBar
      position="static"
      style={{ background: "transparent", boxShadow: "none" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color:
                theme.palette.mode === "light"
                  ? theme.palette.text.primary
                  : "inherit",
              textDecoration: "none",
            }}
          >
            <Image src={logoSrc} alt="Logo" width={100} height={100} />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <a
                      href={page.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {page.name}
                    </a>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                sx={{
                  my: 2,
                  color:
                    theme.palette.mode === "light"
                      ? theme.palette.text.primary
                      : "white",
                  display: "block",
                }}
              >
                <a
                  href={page.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {page.name}
                </a>
              </Button>
            ))}
          </Box>
          <ThemeToggleButton />
          <Box sx={{ flexGrow: 0 }}></Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
