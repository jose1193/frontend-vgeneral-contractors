// src/app/users/page.tsx

"use client";

import React from "react";
import { useUsers } from "../../../src/hooks/useUsers";
import UsersList from "../../../src/components/Users/UserList";
import { Button, Container, Typography, Box, Paper } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import RoleGuard from "@/components/RoleGuard";
const UsersPage = () => {
  const { data: session, update } = useSession();

  const token = session?.accessToken as string;
  const { users, loading, error, deleteUser, restoreUser } = useUsers(token);

  if (error) return <div>Error: {error}</div>;

  return (
    <Box
      sx={{
        width: "100%",
        ml: -6,
        overflow: "hidden",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          textAlign: "left",
          mb: 3,
          fontSize: {
            xs: "1.5rem",
            sm: "1.75rem",
            md: "2rem",
            lg: "2.25rem",
          },
          fontWeight: "bold",
          ml: 4,
        }}
      >
        Users
      </Typography>

      <Link href="/dashboard/users/create" passHref>
        <Button
          variant="contained"
          color="primary"
          sx={{
            ml: 4,
          }}
        >
          Create User
        </Button>
      </Link>
      <UsersList users={users} onDelete={deleteUser} onRestore={restoreUser} />
    </Box>
  );
};

export default UsersPage;
