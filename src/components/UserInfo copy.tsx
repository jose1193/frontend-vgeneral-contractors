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

  return (
    <Paper elevation={3} sx={{ p: 2, m: 2 }}>
      <Typography variant="h6">Información del usuario</Typography>
      <Box>
        <Typography>Nombre: {session.user.name}</Typography>
        <Typography>Apellido: {session.user.last_name}</Typography>
        <Typography>Email: {session.user.email}</Typography>
        {/* Comentado por seguridad, descomentar solo para depuración */}
        {/* <Typography>Token de acceso: {session.accessToken}</Typography> */}
      </Box>
    </Paper>
  );
}
