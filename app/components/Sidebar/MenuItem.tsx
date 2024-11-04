// components/Dashboard/Layout/MenuItem.tsx
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
import { PageItem } from "../../../app/types/navigation";

interface MenuItemProps {
  item: PageItem;
  isSelected: boolean;
  open: boolean;
  onExpandMenu?: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  item,
  isSelected,
  open,
  onExpandMenu,
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
      href={item.href || "#"}
      onClick={handleClick}
      sx={{
        minHeight: 48,
        px: 2.5,
        backgroundColor: isSelected
          ? alpha(theme.palette.common.white, 0.2)
          : "transparent",
        "&:hover": {
          backgroundColor: alpha(theme.palette.common.white, 0.1),
        },
        justifyContent: open ? "initial" : "center",
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
        <IconComponent />
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
