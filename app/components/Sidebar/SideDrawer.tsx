// components/Dashboard/Layout/SideDrawer.tsx
import {
  Drawer,
  List,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { DrawerContent } from "./DrawerContent";
import {
  ChevronLeft,
  ChevronRight,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface SideDrawerProps {
  mobileOpen: boolean;
  handleDrawerClose: () => void;
  handleDrawerTransitionEnd: () => void;
  drawerWidth: number;
  open: boolean;
  handleDrawerOpenChange: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  mobileOpen,
  handleDrawerClose,
  handleDrawerTransitionEnd,
  drawerWidth,
  open,
  handleDrawerOpenChange,
}) => {
  const { data: session } = useSession();
  const theme = useTheme();

  const drawer = (
    <div>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
          position: "relative",
        }}
      >
        {open && (
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              position: "absolute",
              left: 23,
              right: 48,
              opacity: 1,
              transition: theme.transitions.create(["opacity", "width"], {
                duration: theme.transitions.duration.shorter,
              }),
            }}
          >
            {session?.user?.name || "User"} {session?.user?.last_name || ""}
          </Typography>
        )}

        <IconButton
          onClick={handleDrawerOpenChange}
          sx={{
            color: "#fff",
            display: { xs: "none", sm: "inline-flex" },
          }}
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

        <IconButton
          onClick={handleDrawerClose}
          sx={{
            color: "#fff",
            display: { xs: "inline-flex", sm: "none" },
          }}
        >
          {theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Toolbar>
      <Divider />
      <DrawerContent open={open} onExpandDrawer={handleDrawerOpenChange} />
    </div>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true,
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
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: open ? drawerWidth : 64,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: "hidden",
          },
        }}
        open={open}
      >
        {drawer}
      </Drawer>
    </>
  );
};
