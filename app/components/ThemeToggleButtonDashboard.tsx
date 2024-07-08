// app/components/ThemeToggleButton.tsx
"use client";
import React from "react";
import { Button, IconButton } from "@mui/material";
import { useTheme } from "../ui/StyledRoot";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LightModeIcon from "@mui/icons-material/LightMode";
const ThemeToggleButton: React.FC = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <IconButton
      sx={(theme) => ({
        color: darkMode ? theme.palette.primary.main : "inherit",
        "&:hover": {
          backgroundColor: darkMode
            ? "rgba(255, 215, 0, 0.08)" // versión semi-transparente de #FFD700
            : theme.palette.action.hover,
        },
      })}
      onClick={toggleTheme}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
};

export default ThemeToggleButton;
