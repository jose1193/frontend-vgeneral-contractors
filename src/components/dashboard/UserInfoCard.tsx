import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";
import Image from "next/image";

interface User {
  name: string;
  role: string;
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
          padding: 1, // Añadimos padding para evitar que el texto toque los bordes
        }}
      >
        <Avatar sx={{ width: 60, height: 60, mb: 1 }}>
          {user.profile_photo_path ? (
            <Image
              src={user.profile_photo_path}
              alt={user.name}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            getInitials(user.name)
          )}
        </Avatar>
        <Typography
          variant="h6"
          sx={{ textAlign: "center", wordBreak: "break-word" }}
        >
          {user.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{ textAlign: "center", wordBreak: "break-word" }}
        >
          {user.role}
        </Typography>
        <Typography
          variant="caption"
          sx={{ textAlign: "center", wordBreak: "break-word" }}
        >
          Last login: {user.lastLogin}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserInfoCard;
