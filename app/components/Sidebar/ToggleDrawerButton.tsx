// components/Dashboard/Layout/ToggleDrawerButton.tsx
import * as React from "react";
import { IconButton } from "@mui/material";
import { Menu as MenuIcon, ChevronLeft } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

interface ToggleDrawerButtonProps {
  open: boolean;
  handleDrawerOpenChange: () => void;
  drawerWidth: number;
}

export const ToggleDrawerButton: React.FC<ToggleDrawerButtonProps> = ({
  open,
  handleDrawerOpenChange,
  drawerWidth,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "fixed",
        top: theme.spacing(1),
        left: open ? drawerWidth - 20 : 44,
        zIndex: theme.zIndex.drawer + 2,
        transition: theme.transitions.create(["left"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        display: { xs: "none", sm: "block" },
      }}
    >
      <IconButton
        onClick={handleDrawerOpenChange}
        size="small"
        sx={{
          bgcolor: theme.palette.background.paper,
          "&:hover": {
            bgcolor: theme.palette.action.hover,
          },
        }}
      >
        {open ? <ChevronLeft /> : <MenuIcon />}
      </IconButton>
    </Box>
  );
};

export default ToggleDrawerButton;
