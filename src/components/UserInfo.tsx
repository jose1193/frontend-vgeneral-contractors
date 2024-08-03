// src/components/UserInfo.tsx
"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Box, Typography, Paper } from "@mui/material";

export default function UserInfo() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return {
    name: session?.user?.name || "User",
    user_role: session?.user?.user_role,
    lastLogin: "2024-07-04 10:30 AM",
    profile_photo_path: session?.user?.profile_photo_path,
  };
}
