"use client";
import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  styled,
  useTheme,
  Theme,
  CSSObject,
  alpha,
} from "@mui/material/styles";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import {
  Box,
  AppBar as MuiAppBar,
  Drawer as MuiDrawer,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Collapse,
  InputBase,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  AccountCircle,
  MoreVert as MoreIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { PAGES } from "../../constants/navigation";
import { PageItem, SubItem } from "../../types/navigation";
import { hasPermission } from "../../../src/utils/auth";
import { PERMISSIONS } from "@/config/permissions";
import ThemeToggleButtonDashboard from "../ThemeToggleButtonDashboard";

const drawerWidth = 225;
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function EnhancedResponsiveDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

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

  const handleDropdownToggle = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleProfileClick = () => {
    handleMenuClose();
    router.push("/dashboard/profile");
  };

  const renderMenuItem = (item: PageItem) => {
    const IconComponent = item.icon;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isSelected = pathname === item.href;

    if (item.divider) {
      return <Divider key={`divider-${item.name}`} />;
    }

    return (
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
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.common.white,
                  },
                },
              }}
              disabled={item.disabled}
            >
              <ListItemIcon sx={{ color: theme.palette.common.white }}>
                <IconComponent />
              </ListItemIcon>
              <ListItemText primary={item.name} />
              {openDropdown === item.name ? (
                <ExpandLess sx={{ color: theme.palette.common.white }} />
              ) : (
                <ExpandMore sx={{ color: theme.palette.common.white }} />
              )}
            </ListItemButton>
            <Collapse
              in={openDropdown === item.name}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {item.subItems.map((subItem) => {
                  const SubIconComponent = subItem.icon;
                  return (
                    <ListItemButton
                      key={subItem.name}
                      component={Link}
                      href={subItem.href}
                      sx={{
                        pl: 4,
                        backgroundColor:
                          pathname === subItem.href
                            ? alpha(theme.palette.common.white, 0.2)
                            : "transparent",
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.common.white,
                            0.1
                          ),
                          "& .MuiListItemIcon-root": {
                            color: theme.palette.common.white,
                          },
                        },
                      }}
                      disabled={subItem.disabled}
                    >
                      <ListItemIcon sx={{ color: theme.palette.common.white }}>
                        {SubIconComponent && <SubIconComponent />}
                      </ListItemIcon>
                      <ListItemText primary={subItem.name} />
                    </ListItemButton>
                  );
                })}
              </List>
            </Collapse>
          </>
        ) : (
          <ListItemButton
            component={Link}
            href={item.href || "#"}
            sx={{
              minHeight: 48,
              px: 2.5,
              backgroundColor: isSelected
                ? alpha(theme.palette.common.white, 0.2)
                : "transparent",
              "&:hover": {
                backgroundColor: alpha(theme.palette.common.white, 0.1),
                "& .MuiListItemIcon-root": {
                  color: theme.palette.common.white,
                },
              },
            }}
            disabled={item.disabled}
          >
            <ListItemIcon sx={{ color: theme.palette.common.white }}>
              <IconComponent />
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
        )}
      </ListItem>
    );
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          {session?.user?.name || "User"} {session?.user?.last_name || ""}
        </Typography>
      </Toolbar>
      <Divider />
      <List>{filterMenuItems(PAGES).map(renderMenuItem)}</List>
    </div>
  );

  const menuId = "primary-search-account-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <MenuItem onClick={handleProfileClick}>
        <IconButton size="large" color="inherit">
          <AccountCircle />
        </IconButton>
        Profile
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <IconButton size="large" color="inherit">
          <LogoutIcon />
        </IconButton>
        Logout
      </MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      id={mobileMenuId}
      keepMounted
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton size="large" color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: { sm: `${drawerWidth}px` },
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                mr: 4, // Añade margen a la derecha
                display: { xs: "none", lg: "block" }, // Oculta en móvil, muestra en desktop
              }}
            >
              {session?.user?.name || "User"} {session?.user?.last_name || ""}
            </Typography>
          </Box>

          <Image
            src="/logo-white.png"
            alt="Logo"
            width={70}
            height={70}
            style={{ marginRight: "16px" }}
          />
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <ThemeToggleButtonDashboard />
            <IconButton size="large" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
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
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <MuiDrawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </MuiDrawer>
        {/* Desktop drawer */}
        <MuiDrawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </MuiDrawer>
      </Box>

      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}

export type { AppBarProps, PageItem, SubItem };
