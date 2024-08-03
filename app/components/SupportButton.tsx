import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import SupportIcon from "@mui/icons-material/Support";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ThemeToggleButtonDashboard from "./ThemeToggleButtonDashboard"; // Asegúrate de importar correctamente

const actions = [
  { icon: <SupportAgentIcon />, name: "Support" },
  { icon: <ThemeToggleButtonDashboard />, name: "Toggle Theme" },
];

function DashboardSpeedDial() {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      <SpeedDial
        ariaLabel="Dashboard SpeedDial"
        icon={<SpeedDialIcon />}
        direction="up"
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}

export default DashboardSpeedDial;
