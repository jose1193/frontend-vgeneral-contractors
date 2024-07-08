// app/ui/theme.ts
"use client";

import { Roboto } from "next/font/google";
import { createTheme, Theme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

const exo = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const lightTheme: Theme = createTheme({
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
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#000",
          color: "#fff",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.12)", // Divider más visible
        },
      },
    },
  },
});

const darkTheme: Theme = createTheme({
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
});

export { lightTheme, darkTheme };
