// components/Dashboard/Layout/DrawerContent.tsx
import * as React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Tooltip,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { PAGES } from "../../constants/navigation";
import { hasPermission } from "@/utils/auth";
import { PageItem, SubItem } from "../../types/navigation";
import { MenuItem } from "./MenuItem";
import { SubMenuItem } from "./SubMenuItem";

interface DrawerContentProps {
  open: boolean;
  onExpandDrawer?: () => void;
}

export const DrawerContent: React.FC<DrawerContentProps> = ({
  open,
  onExpandDrawer,
}) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const theme = useTheme();
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

  const handleDropdownToggle = (name: string) => {
    if (!open) {
      onExpandDrawer?.();
      setOpenDropdown(name);
    } else {
      setOpenDropdown(openDropdown === name ? null : name);
    }
  };

  const filterMenuItems = (items: PageItem[]): PageItem[] => {
    if (!session?.user?.user_role) return [];

    return items.filter((item) => {
      if (session.user.user_role === "Super Admin") return true;

      const hasMainPermission = item.permission
        ? hasPermission(session.user.user_role, item.permission)
        : true;

      if (item.subItems) {
        const filteredSubItems = item.subItems.filter((subItem) =>
          subItem.permission
            ? hasPermission(session.user.user_role, subItem.permission)
            : hasMainPermission
        );

        if (filteredSubItems.length > 0) {
          return { ...item, subItems: filteredSubItems };
        }
      }

      return hasMainPermission;
    });
  };

  const renderMenuItem = (item: PageItem) => {
    const IconComponent = item.icon;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isSelected = pathname === item.href;

    if (item.divider) {
      return <Divider key={`divider-${item.name}`} />;
    }

    const content = (
      <ListItem key={item.name} disablePadding sx={{ display: "block" }}>
        {hasSubItems && item.subItems ? (
          <>
            <ListItemButton
              onClick={() => handleDropdownToggle(item.name)}
              sx={{
                minHeight: 48,
                px: 2.5,
                backgroundColor:
                  openDropdown === item.name
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
              {open && (
                <>
                  <ListItemText primary={item.name} />
                  {openDropdown === item.name ? <ExpandLess /> : <ExpandMore />}
                </>
              )}
            </ListItemButton>
            <Collapse
              in={openDropdown === item.name && open}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {item.subItems.map((subItem) => (
                  <SubMenuItem
                    key={subItem.name}
                    item={subItem}
                    pathname={pathname}
                    open={open}
                    onExpandMenu={() => {
                      onExpandDrawer?.();
                      handleDropdownToggle(item.name);
                    }}
                  />
                ))}
              </List>
            </Collapse>
          </>
        ) : (
          <MenuItem
            item={item}
            isSelected={isSelected}
            open={open}
            onExpandMenu={onExpandDrawer}
          />
        )}
      </ListItem>
    );

    return !open ? (
      <Tooltip title={item.name} placement="right" arrow>
        {content}
      </Tooltip>
    ) : (
      content
    );
  };

  return <List>{filterMenuItems(PAGES).map(renderMenuItem)}</List>;
};
