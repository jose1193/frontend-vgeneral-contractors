// components/Dashboard/Layout/ProfileMenu.tsx
import { Menu, MenuItem, IconButton } from "@mui/material";
import { AccountCircle, Logout as LogoutIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface ProfileMenuProps {
  anchorEl: null | HTMLElement;
  menuId: string;
  handleMenuClose: () => void;
}

export const ProfileMenu = ({
  anchorEl,
  menuId,
  handleMenuClose,
}: ProfileMenuProps) => {
  const router = useRouter();
  const isMenuOpen = Boolean(anchorEl);

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

  return (
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
};

export default ProfileMenu;
