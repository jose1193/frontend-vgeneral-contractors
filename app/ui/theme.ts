"use client";

import { Roboto } from "next/font/google";
import { createTheme, Theme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { CSSObject } from "@mui/system";

const exo = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Estilos del scrollbar
const scrollbarStyles: CSSObject = {
  "&::-webkit-scrollbar": {
    width: "8px",
    background: "transparent",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "transparent",
    borderRadius: "4px",
  },
  "&:hover::-webkit-scrollbar-thumb": {
    background: "rgba(255, 255, 255, 0.2)",
  },
  scrollbarWidth: "thin",
  scrollbarColor: "transparent transparent",
  "&:hover": {
    scrollbarColor: "rgba(255, 255, 255, 0.2) transparent",
  },
};

// Estilos base del drawer para tema claro
const lightDrawerStyles: CSSObject = {
  backgroundColor: "#000",
  color: "#fff",
  overflowY: "auto",
  overflowX: "hidden",
  boxShadow: "4px 0 6px -1px rgba(0, 0, 0, 0.2)", // Shadow en el borde derecho
  borderRight: "none",
  ...scrollbarStyles,
};

// Estilos del drawer para tema oscuro
const darkDrawerStyles: CSSObject = {
  backgroundColor: "#171717", // Color específico para modo oscuro
  color: "#fff",
  overflowY: "auto",
  overflowX: "hidden",
  boxShadow: "4px 0 6px -1px rgba(0, 0, 0, 0.2)", // Shadow en el borde derecho
  borderRight: "none",
  ...scrollbarStyles,
};

const lightTheme = createTheme({
  typography: {
    fontFamily: exo.style.fontFamily,
  },
  palette: {
    mode: "light",
    primary: {
      main: "#212121",
    },
    secondary: {
      main: "#0c181c",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#000",
          boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.2)", // Shadow sutil para el AppBar
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: lightDrawerStyles,
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.12)",
        },
      },
    },
  },
});

const darkTheme = createTheme({
  typography: {
    fontFamily: exo.style.fontFamily,
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#FFD700",
    },
    secondary: {
      main: grey[500],
    },
    background: {
      default: "#000",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#000",
          boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.2)", // Shadow sutil para el AppBar
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: darkDrawerStyles, // Usando los estilos específicos para modo oscuro
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.12)",
        },
      },
    },
  },
});

export { lightTheme, darkTheme };
