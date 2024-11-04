// components/Dashboard/Layout/SubMenuItem.tsx
import * as React from "react";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import Link from "next/link";
import { SubItem } from "../../../app/types/navigation";

interface SubMenuItemProps {
  item: SubItem;
  pathname: string;
  open: boolean;
  onExpandMenu?: () => void; // Añadida esta prop
}

export const SubMenuItem: React.FC<SubMenuItemProps> = ({
  item,
  pathname,
  open,
  onExpandMenu, // Añadido aquí
}) => {
  const theme = useTheme();
  const IconComponent = item.icon;

  const handleClick = (e: React.MouseEvent) => {
    if (!open) {
      e.preventDefault();
      onExpandMenu?.();
    }
  };

  const button = (
    <ListItemButton
      component={Link}
      href={item.href}
      onClick={handleClick} // Añadido el manejador de click
      sx={{
        pl: 4,
        backgroundColor:
          pathname === item.href
            ? alpha(theme.palette.common.white, 0.2)
            : "transparent",
        "&:hover": {
          backgroundColor: alpha(theme.palette.common.white, 0.1),
        },
        justifyContent: open ? "initial" : "center",
        minHeight: 48,
      }}
      disabled={item.disabled}
    >
      <ListItemIcon
        sx={{
          color: theme.palette.common.white,
          minWidth: 0,
          mr: open ? 3 : "auto",
          justifyContent: "center",
        }}
      >
        {IconComponent && <IconComponent />}
      </ListItemIcon>
      {open && <ListItemText primary={item.name} />}
    </ListItemButton>
  );

  return !open ? (
    <Tooltip title={item.name} placement="right" arrow>
      {button}
    </Tooltip>
  ) : (
    button
  );
};

export default SubMenuItem;
