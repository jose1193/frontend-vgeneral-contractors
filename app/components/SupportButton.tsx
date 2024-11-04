"use client";

import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import SupportIcon from "@mui/icons-material/Support";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useEffect, useState } from "react";
import ThemeToggleButtonDashboard from "./ThemeToggleButtonDashboard";

const actions = [
  { icon: <SupportAgentIcon />, name: "Support" },
  { icon: <ThemeToggleButtonDashboard />, name: "Toggle Theme" },
];

function DashboardSpeedDial() {
  const [opacity, setOpacity] = useState(0.4); // Comenzamos con opacity reducida

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      // Calculamos la opacidad basada en el scroll
      // Comenzamos con 0.4 y aumentamos hasta 1 según el scroll
      const newOpacity = Math.min(1, 0.4 + (scrollPosition / maxScroll) * 0.6);
      setOpacity(newOpacity);
    };

    // Agregamos el event listener
    window.addEventListener("scroll", handleScroll);

    // Limpiamos el event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 1000,
        transition: "opacity 0.3s ease", // Agregamos una transición suave
      }}
    >
      <SpeedDial
        ariaLabel="Dashboard SpeedDial"
        icon={<SpeedDialIcon />}
        direction="up"
        sx={{
          "& .MuiFab-primary": {
            opacity: opacity,
            bgcolor: "primary.main",
            "&:hover": {
              opacity: 1, // Siempre mostramos opacidad completa en hover
              bgcolor: "primary.dark",
            },
          },
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            sx={{
              opacity: opacity,
              "&:hover": {
                opacity: 1,
              },
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}

export default DashboardSpeedDial;
