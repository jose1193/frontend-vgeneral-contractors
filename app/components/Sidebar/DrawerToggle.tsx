import React from "react";
import { IconButton, IconButtonProps } from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

type IconButtonColor = NonNullable<IconButtonProps["color"]>;

interface DrawerToggleProps extends Omit<IconButtonProps, "onClick" | "color"> {
  open: boolean;
  isMobile: boolean;
  onToggle: () => void;
  direction?: "ltr" | "rtl";
  color?: IconButtonColor;
}

const DrawerToggle: React.FC<DrawerToggleProps> = ({
  open,
  isMobile,
  onToggle,
  direction = "ltr",
  color = "inherit",
  ...props
}) => {
  const theme = useTheme();

  const getIcon = () => {
    if (isMobile) {
      // En mobile siempre mostramos flecha para cerrar
      return direction === "rtl" ? <ChevronRight /> : <ChevronLeft />;
    } else {
      // En desktop: hamburguesa cuando está colapsado, flecha cuando está abierto
      if (!open) {
        return <MenuIcon />;
      }
      return direction === "rtl" ? <ChevronRight /> : <ChevronLeft />;
    }
  };

  return (
    <IconButton
      onClick={onToggle}
      color={color}
      sx={{
        transition: theme.transitions.create(["margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        ...(isMobile && {
          mr: 2,
        }),
      }}
      {...props}
    >
      {getIcon()}
    </IconButton>
  );
};

export default DrawerToggle;
