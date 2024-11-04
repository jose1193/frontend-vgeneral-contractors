// components/Dashboard/Layout/ResponsiveDrawer.tsx
"use client";
import * as React from "react";
import { Box, CssBaseline } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { TopBar } from "./TopBar";
import { SideDrawer } from "./SideDrawer";
import { ProfileMenu } from "./ProfileMenu";
import { MobileMenu } from "./MobileMenu";
import { drawerWidth } from "./styles";

interface ResponsiveDrawerProps {
  children: React.ReactNode;
}

export const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = ({
  children,
}) => {
  const router = useRouter();
  const { data: session } = useSession();

  // State management
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(true);

  // Constants
  const menuId = "primary-search-account-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";

  // Handlers
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleDrawerOpenChange = () => {
    setOpen(!open);
  };

  // Main content styles
  const mainContentStyles = {
    flexGrow: 1,
    p: 3,
    width: { sm: `calc(100% - ${open ? drawerWidth : 64}px)` },
    ml: { sm: `${open ? drawerWidth : 64}px` },
    mt: "64px", // height of AppBar
    transition: (theme: any) =>
      theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Top Navigation Bar */}
      <TopBar
        handleDrawerToggle={handleDrawerToggle}
        handleProfileMenuOpen={handleProfileMenuOpen}
        handleMobileMenuOpen={handleMobileMenuOpen}
        drawerWidth={drawerWidth}
        menuId={menuId}
        mobileMenuId={mobileMenuId}
        open={open}
        handleDrawerOpenChange={handleDrawerOpenChange}
      />

      {/* Side Navigation Drawer */}
      <SideDrawer
        mobileOpen={mobileOpen}
        handleDrawerClose={handleDrawerClose}
        handleDrawerTransitionEnd={handleDrawerTransitionEnd}
        drawerWidth={drawerWidth}
        open={open}
        handleDrawerOpenChange={handleDrawerOpenChange}
      />

      {/* Main Content Area */}
      <Box component="main" sx={mainContentStyles}>
        {children}
      </Box>

      {/* Mobile Navigation Menu */}
      <MobileMenu
        mobileMoreAnchorEl={mobileMoreAnchorEl}
        mobileMenuId={mobileMenuId}
        handleMobileMenuClose={handleMobileMenuClose}
        handleProfileMenuOpen={handleProfileMenuOpen}
      />

      {/* User Profile Menu */}
      <ProfileMenu
        anchorEl={anchorEl}
        menuId={menuId}
        handleMenuClose={handleMenuClose}
      />
    </Box>
  );
};

export default ResponsiveDrawer;
