// components/Dashboard/Layout/MobileMenu.tsx
import { Menu, MenuItem, IconButton, Badge } from "@mui/material";
import {
  Mail as MailIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
} from "@mui/icons-material";

interface MobileMenuProps {
  mobileMoreAnchorEl: null | HTMLElement;
  mobileMenuId: string;
  handleMobileMenuClose: () => void;
  handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
}

export const MobileMenu = ({
  mobileMoreAnchorEl,
  mobileMenuId,
  handleMobileMenuClose,
  handleProfileMenuOpen,
}: MobileMenuProps) => {
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  return (
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
};

export default MobileMenu;
