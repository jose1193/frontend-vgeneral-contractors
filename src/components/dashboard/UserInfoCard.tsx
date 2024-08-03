import React from "react";
import { Avatar, IconButton, Box, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";
import Image from "next/image";
import { useSession } from "next-auth/react";
interface User {
  name: string;
  user_role: string;
  lastLogin: string;
  profile_photo_path?: string;
}

interface UserInfoCardProps {
  user: User;
}

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const UserInfoCard: React.FC<UserInfoCardProps> = ({ user }) => {
  const getInitials = (name: string): string => {
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  const { data: session } = useSession();

  return (
    <Box
      sx={{
        width: {
          xs: "93%",
          sm: "97%",
          md: "100%",
          lg: 280,
        },
        maxWidth: {
          xs: "93%",
          sm: "97%",
          md: "100%",
          lg: 280,
        },
        height: 150,
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0px 8px 28px -9px rgba(0,0,0,0.45)",
        background: "linear-gradient(45deg, #af40ff, #5b42f3, #ef4444)",
        backgroundSize: "200% 200%",
        animation: `${gradientAnimation} 15s ease infinite`,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          zIndex: 1,
          padding: 1,
        }}
      >
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-haspopup="true"
          color="inherit"
        >
          {session?.user?.profile_photo_path ? (
            <Avatar
              alt={session?.user?.name || "User"}
              src={session?.user?.profile_photo_path}
              sx={{ width: 50, height: 50 }}
            />
          ) : (
            <Avatar
              alt={user.name || "User"}
              sx={{
                width: 50,
                height: 50,
                bgcolor: "#EBF4FF",
                color: "#7F9CF5",
              }}
            >
              {getInitials(user.name || "U")}
            </Avatar>
          )}
        </IconButton>
        <Typography
          variant="h6"
          sx={{ textAlign: "center", wordBreak: "break-word" }}
        >
          {session?.user?.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{ textAlign: "center", wordBreak: "break-word" }}
        >
          {session?.user?.user_role}
        </Typography>
        <Typography
          variant="caption"
          sx={{ textAlign: "center", wordBreak: "break-word" }}
        ></Typography>
      </Box>
    </Box>
  );
};

export default UserInfoCard;
