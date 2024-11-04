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
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { FactCheckOutlined } from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
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
import SecurityIcon from "@mui/icons-material/Security";
import BusinessIcon from "@mui/icons-material/Business";
import DomainIcon from "@mui/icons-material/Domain";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import HandshakeIcon from "@mui/icons-material/Handshake";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { hasPermission } from "@/utils/auth";
import { PERMISSIONS } from "@/config/permissions";
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
    permission?: keyof typeof PERMISSIONS;
  }

  interface PageItem {
    name: string;
    href?: string;
    icon: React.ReactNode;
    subItems?: SubItem[];

    permission?: keyof typeof PERMISSIONS;
  }

  const pages: PageItem[] = [
    {
      name: "Home",
      href: "/dashboard",
      icon: <HouseIcon />,
      permission: PERMISSIONS.VIEW_DASHBOARD,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: <AccountCircle />,
      permission: PERMISSIONS.VIEW_DASHBOARD,
    },
    {
      name: "Customers",
      href: "/dashboard/customers",
      icon: <ContactsIcon />,
      permission: PERMISSIONS.MANAGE_CUSTOMERS,
    },
    {
      name: "Claims",
      icon: <PostAddIcon />,
      permission: PERMISSIONS.MANAGE_CLAIMS,
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
      name: "DocuSign",
      icon: <AssignmentTurnedInIcon />,
      permission: PERMISSIONS.MANAGE_CONFIG,
      subItems: [
        {
          name: "New Connection",
          href: "/dashboard/docusign/connect",
          icon: <AddCircleOutlineIcon />,
        },
        {
          name: "Documents List",
          href: "/dashboard/docusign/documents",
          icon: <AssignmentIcon />,
        },
        {
          name: "Status Monitor",
          href: "/dashboard/docusign/status",
          icon: <FactCheckOutlined />,
        },
      ],
    },
    {
      name: "Sign. SalesPerson",
      href: "/dashboard/salesperson-signature",
      icon: <BorderColorIcon />,
      permission: PERMISSIONS.MANAGE_SIGNATURES,
    },

    {
      name: "Prospect",
      href: "/",
      icon: <GpsFixedIcon />,
    },

    {
      name: "Deals",
      href: "/",
      icon: <MonetizationOnIcon />,
    },
    {
      name: "Projects",
      href: "/",
      icon: <ContentPasteSearchIcon />,
    },

    {
      name: "Stages",
      href: "/dashboard/stage",
      icon: <ViewKanbanIcon />,
    },
    {
      name: "Calendars",
      href: "/",
      icon: <CalendarMonthIcon />,
    },

    {
      name: "Emails",
      href: "/",
      icon: <InboxIcon />,
    },
    {
      name: "Companies",
      icon: <DomainIcon />,
      permission: PERMISSIONS.MANAGE_COMPANIES,
      subItems: [
        {
          name: "Insurance",
          href: "/dashboard/insurance-companies",
          icon: <SecurityIcon />,
        },
        {
          name: "Public Company",
          href: "/dashboard/public-companies",
          icon: <BusinessIcon />,
        },
        {
          name: "Alliance Company",
          href: "/dashboard/alliance-companies",
          icon: <HandshakeIcon />,
        },
        {
          name: "Mortgage",
          href: "/dashboard/mortgage-companies",
          icon: <AccountBalanceIcon />,
        },
      ],
    },
    {
      name: "Integrations",
      icon: <ApiIcon />,

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
      name: "Documents",
      icon: <DocumentScannerIcon />,
      permission: PERMISSIONS.MANAGE_DOCUMENTS,
      subItems: [
        {
          name: "VG Company",
          href: "/dashboard/document-templates",
          icon: <ContentPasteIcon />,
        },
        {
          name: "Alliance Company",
          href: "/dashboard/document-template-alliances",
          icon: <ReceiptLongIcon />,
        },
      ],
    },
    {
      name: "Config",
      icon: <SettingsIcon />,
      permission: PERMISSIONS.MANAGE_CONFIG,
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
        {
          name: "Cause Of Losses",
          href: "/dashboard/cause-of-losses",
          icon: <ErrorOutlineIcon />,
        },
        {
          name: "VG Company",
          href: "/dashboard/company-signature",
          icon: <DriveFileRenameOutlineIcon />,
        },
      ],
    },
  ];
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const userRole = session?.user?.user_role as string | undefined;

  const filterMenuItems = (items: PageItem[]): PageItem[] => {
    if (!userRole) return [];

    return items.filter((item) => {
      // Super Admin sees everything
      if (userRole === "Super Admin") return true;

      // Check main item permission
      const hasMainPermission = item.permission
        ? hasPermission(userRole, item.permission)
        : false;

      // If there are subitems, check their permissions
      if (item.subItems) {
        const filteredSubItems = item.subItems.filter((subItem) =>
          subItem.permission
            ? hasPermission(userRole, subItem.permission)
            : hasMainPermission
        );

        // Only include this item if it has accessible subitems
        if (filteredSubItems.length > 0) {
          item.subItems = filteredSubItems;
          return true;
        }
      }

      // For items without subitems, return based on main permission
      return hasMainPermission;
    });
  };

  const filteredPages = filterMenuItems(pages);
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
    if (open) {
      setOpenDropdown(openDropdown === name ? null : name);
    } else {
      setOpen(true);
      setOpenDropdown(name);
    }
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
        elevation={4}
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
                    in={openDropdown === page.name}
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
