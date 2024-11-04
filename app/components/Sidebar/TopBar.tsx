import * as React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Badge,
  Avatar,
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Mail as MailIcon,
  Notifications,
  MoreVert as MoreIcon,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import ResponsiveSearch from "./ResponsiveSearch";
import ThemeToggleButtonDashboard from "../ThemeToggleButtonDashboard";
import { useTheme } from "@mui/material/styles";

interface TopBarProps {
  handleDrawerToggle: () => void;
  handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleMobileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  drawerWidth: number;
  menuId: string;
  mobileMenuId: string;
  open: boolean;
  handleDrawerOpenChange: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  handleDrawerToggle,
  handleProfileMenuOpen,
  handleMobileMenuOpen,
  drawerWidth,
  menuId,
  mobileMenuId,
  open,
  handleDrawerOpenChange,
}) => {
  const { data: session } = useSession();
  const theme = useTheme();

  const renderMenuIcon = () => {
    // For mobile view
    if (theme.breakpoints.down("sm")) {
      return (
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      );
    }

    // For desktop view
    return (
      <IconButton
        color="inherit"
        aria-label={open ? "close drawer" : "open drawer"}
        edge="start"
        onClick={handleDrawerOpenChange}
        sx={{ mr: 2, display: { xs: "none", sm: "block" } }}
      >
        {open ? (
          theme.direction === "rtl" ? (
            <ChevronRight />
          ) : (
            <ChevronLeft />
          )
        ) : (
          <MenuIcon />
        )}
      </IconButton>
    );
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${open ? drawerWidth : 64}px)` },
        ml: { sm: `${open ? drawerWidth : 64}px` },
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <Toolbar>
        {renderMenuIcon()}

        <Image
          src="/logo-white.png"
          alt="Logo"
          width={70}
          height={70}
          style={{ marginRight: "16px" }}
        />

        <ResponsiveSearch />

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ThemeToggleButtonDashboard />
          <IconButton size="large" color="inherit">
            <Badge badgeContent={4} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <IconButton size="large" color="inherit">
            <Badge badgeContent={17} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            {session?.user?.profile_photo_path ? (
              <Avatar
                alt={session.user.name || "User"}
                src={session.user.profile_photo_path}
                sx={{ width: 30, height: 30 }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: "#EBF4FF",
                  color: "#7F9CF5",
                }}
              >
                {(session?.user?.name || "U")[0].toUpperCase()}
              </Avatar>
            )}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
