// app/components/ThemeToggleButton.tsx
"use client";
import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "../ui/StyledRoot";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LightModeIcon from "@mui/icons-material/LightMode";
const ThemeToggleButton: React.FC = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <Button
      variant="text"
      color="primary"
      startIcon={darkMode ? <LightModeIcon /> : <DarkModeIcon />}
      onClick={toggleTheme}
    ></Button>
  );
};

export default ThemeToggleButton;
