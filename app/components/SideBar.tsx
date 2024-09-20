"use client";
import * as React from "react";
import {
  styled,
  useTheme,
  Theme,
  CSSObject,
  alpha,
} from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import LogoutIcon from "@mui/icons-material/Logout";
import HouseIcon from "@mui/icons-material/House";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ContactsIcon from "@mui/icons-material/Contacts";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import LockIcon from "@mui/icons-material/Lock";
import WarningIcon from "@mui/icons-material/Warning";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ApiIcon from "@mui/icons-material/Api";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ROLE_PERMISSIONS } from "../../src/config/roles";
import RoleGuard from "@/components/RoleGuard";
import Image from "next/image";

import ThemeToggleButtonDashboard from "./ThemeToggleButtonDashboard";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { Logout } from "../../app/lib/api";
import SearchComponent from "../../src/components/dashboard/SearchComponent";

const drawerWidth = 240;

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

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

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

export default function MiniDrawer() {
  interface SubItem {
    name: string;
    href: string;
    icon?: React.ReactNode;
  }

  interface PageItem {
    name: string;
    href?: string;
    icon: React.ReactNode;
    subItems?: SubItem[];
    allowedRoles: string[];
  }

  const pages: PageItem[] = [
    {
      name: "Home",
      href: "/dashboard",
      icon: <HouseIcon />,
      allowedRoles: [
        "Super Admin",
        "Admin",
        "Manager",
        "Technical Services",
        "Lead",
      ],
    },
    {
      name: "Prospect",
      href: "/",
      icon: <GpsFixedIcon />,
      allowedRoles: ["Super Admin", "Admin", "Manager"],
    },
    {
      name: "Claims",
      icon: <PostAddIcon />,
      allowedRoles: ["Super Admin", "Admin", "Manager", "Lead"],
      subItems: [
        {
          name: "New Claim",
          href: "/dashboard/claims/create",
          icon: <AddCircleOutlineIcon />,
        },
        {
          name: "List",
          href: "/dashboard/claims",
          icon: <AssignmentIcon />,
        },
      ],
    },

    {
      name: "Deals",
      href: "/",
      icon: <MonetizationOnIcon />,
      allowedRoles: ["Super Admin", "Admin", "Manager"],
    },
    {
      name: "Projects",
      href: "/",
      icon: <ContentPasteSearchIcon />,
      allowedRoles: ["Super Admin", "Admin", "Manager"],
    },

    {
      name: "Stages",
      href: "/dashboard/stage",
      icon: <ViewKanbanIcon />,
      allowedRoles: ["Super Admin", "Admin", "Manager"],
    },
    {
      name: "Calendars",
      href: "/",
      icon: <CalendarMonthIcon />,
      allowedRoles: [
        "Super Admin",
        "Admin",
        "Manager",
        "Technical Services",
        "Lead",
      ],
    },
    {
      name: "Contacs",
      href: "/",
      icon: <ContactsIcon />,
      allowedRoles: ["Super Admin", "Admin", "Manager"],
    },
    {
      name: "Emails",
      href: "/",
      icon: <InboxIcon />,
      allowedRoles: ["Super Admin", "Admin", "Manager"],
    },
    {
      name: "Integrations",
      icon: <ApiIcon />,
      allowedRoles: ["Super Admin", "Admin"],
      subItems: [
        {
          name: "AI Tools",
          href: "/dashboard/ai-tools",
          icon: <SmartToyIcon />,
        },
        {
          name: "Quickbooks API",
          href: "/dashboard/quickbooks-api",
          icon: <AccountBalanceIcon />,
        },
        {
          name: "Company Cam API",
          href: "/dashboard/companycam-api",
          icon: <CameraAltIcon />,
        },
      ],
    },

    {
      name: "Config",
      icon: <SettingsIcon />,
      allowedRoles: ["Super Admin"],
      subItems: [
        {
          name: "Users",
          href: "/dashboard/users",
          icon: <PeopleAltIcon />,
        },
        {
          name: "Roles",
          href: "/dashboard/roles",
          icon: <AdminPanelSettingsIcon />,
        },
        {
          name: "Permissions",
          href: "/dashboard/permissions",
          icon: <LockIcon />,
        },
        {
          name: "Type Damages",
          href: "/dashboard/type-damages",
          icon: <WarningIcon />,
        },
      ],
    },
  ];
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const userRole = session?.user?.user_role as
    | keyof typeof ROLE_PERMISSIONS
    | undefined;
  // Filtrar las páginas basadas en el rol del usuario
  const filteredPages = pages.filter((page) => {
    if (!userRole) return false;
    if (userRole === "Super Admin") return true; // Super Admin ve todo

    const allowedRoutes = ROLE_PERMISSIONS[userRole];
    if (!allowedRoutes) return false;

    // Comprueba si la página o alguna de sus subpáginas está permitida
    return (
      page.allowedRoles.includes(userRole) ||
      allowedRoutes.some(
        (route) =>
          route === "*" ||
          page.href?.startsWith(route) ||
          (page.subItems &&
            page.subItems.some((subItem) => subItem.href.startsWith(route)))
      )
    );
  });
  const handleLogout = async () => {
    try {
      const token = session?.accessToken;

      if (!token) {
        console.error("Access token not found");
        return;
      }

      // Llamar al endpoint de logout

      const response = await Logout(token);

      // Realizar el logout con NextAuth
      await signOut({ redirect: false });

      handleMenuClose();

      // Redirigir al home
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const handleDropdownToggle = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
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

  const handleProfileClick = () => {
    handleMenuClose();
    router.push("/dashboard/profile");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
          sx={{ ml: -2 }}
        >
          <AccountCircle />
        </IconButton>
        <p onClick={handleProfileClick}>Profile</p>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        {" "}
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
          sx={{ ml: -2 }}
        >
          <LogoutIcon />
        </IconButton>
        Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p onClick={handleProfileClick}>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        elevation={4} // Esto agrega una sombra predefinida
        sx={{
          //boxShadow: "0 4px 5px 0 rgba(33, 33, 33, 0.5)", // Sombra personalizada más oscura
          borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
        }}
      >
        <Toolbar
          sx={{
            backgroundColor:
              theme.palette.mode === "light"
                ? "#000"
                : theme.palette.background.paper,
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Image
            src="/logo-white.png"
            alt="Logo"
            width={70}
            height={70}
            style={{ marginRight: "16px" }}
          />
          <SearchComponent />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "flex", md: "flex" } }}>
            <ThemeToggleButtonDashboard />

            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
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
                  alt={session?.user?.name || "User"}
                  src={session.user.profile_photo_path}
                  sx={{ width: 30, height: 30 }}
                />
              ) : (
                <Avatar
                  alt={session?.user?.name || "User"}
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
          <Box sx={{ display: { xs: "none", md: "none" } }}>
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
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, ml: 2 }}
          >
            {session?.user?.name || "User"} {session?.user?.last_name || ""}
          </Typography>
          <IconButton onClick={handleDrawerClose} sx={{ color: "#fff" }}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {filteredPages.map((page) => (
            <ListItem key={page.name} disablePadding sx={{ display: "block" }}>
              {page.subItems ? (
                <>
                  <ListItemButton
                    onClick={() => handleDropdownToggle(page.name)}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      backgroundColor:
                        openDropdown === page.name
                          ? theme.palette.primary.dark
                          : "transparent",
                      "&:hover": {
                        backgroundColor:
                          openDropdown === page.name
                            ? theme.palette.primary.dark
                            : "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color:
                          openDropdown === page.name
                            ? theme.palette.primary.contrastText
                            : "inherit",
                      }}
                    >
                      {page.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={page.name}
                      sx={{
                        opacity: open ? 1 : 0,
                        color:
                          openDropdown === page.name
                            ? theme.palette.primary.contrastText
                            : "inherit",
                      }}
                    />
                    {open &&
                      (openDropdown === page.name ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      ))}
                  </ListItemButton>
                  <Collapse
                    in={openDropdown === page.name && open}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {page.subItems.map((subItem) => (
                        <ListItemButton
                          key={subItem.name}
                          component={Link}
                          href={subItem.href}
                          sx={{
                            pl: 4,
                            backgroundColor:
                              pathname === subItem.href
                                ? theme.palette.primary.dark
                                : "transparent",
                            "&:hover": {
                              backgroundColor:
                                pathname === subItem.href
                                  ? theme.palette.primary.dark
                                  : "rgba(0, 0, 0, 0.04)",
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              color:
                                pathname === subItem.href
                                  ? theme.palette.primary.contrastText
                                  : "inherit",
                            }}
                          >
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={subItem.name}
                            sx={{
                              color:
                                pathname === subItem.href
                                  ? theme.palette.primary.contrastText
                                  : "inherit",
                            }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItemButton
                  component={Link}
                  href={page.href || "#"}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    backgroundColor:
                      pathname === page.href
                        ? theme.palette.primary.dark
                        : "transparent",
                    "&:hover": {
                      backgroundColor:
                        pathname === page.href
                          ? theme.palette.primary.dark
                          : "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color:
                        pathname === page.href
                          ? theme.palette.primary.contrastText
                          : "inherit",
                    }}
                  >
                    {page.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={page.name}
                    sx={{
                      opacity: open ? 1 : 0,
                      color:
                        pathname === page.href
                          ? theme.palette.primary.contrastText
                          : "inherit",
                    }}
                  />
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
      </Box>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
