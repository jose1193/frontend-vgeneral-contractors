"use client";

import React, { Suspense } from "react";
import { useUsers } from "../../../src/hooks/useUsers";
import UsersList from "../../../src/components/Users/UserList";
import { Button, Typography, Box, Alert } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ButtonCreate from "../../components/ButtonCreate";
import { withRoleProtection } from "../../../src/components/withRoleProtection";
import { PERMISSIONS } from "../../../src/config/permissions";
import TypographyHeading from "../../components/TypographyHeading";
import DataSkeletonList from "../../../src/components/skeletons/DataSkeletonList";

// Custom error component
const ErrorComponent = ({ message }: { message: string }) => (
  <Box sx={{ p: 3 }}>
    <Alert severity="error" sx={{ mb: 2 }}>
      {message}
    </Alert>
  </Box>
);

const UsersPage = () => {
  const { data: session, update } = useSession();
  const token = session?.accessToken as string;
  const { users, loading, error, deleteUser, restoreUser } = useUsers(token);

  if (!token) {
    return <ErrorComponent message="Authentication required" />;
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }

  if (loading) {
    return <DataSkeletonList />;
  }

  return (
    <Suspense fallback={<DataSkeletonList />}>
      <Box
        sx={{
          width: "100%",
          ml: -6,
          overflow: "hidden",
        }}
      >
        <TypographyHeading>Users</TypographyHeading>

        <Link href="/dashboard/users/create" passHref>
          <ButtonCreate sx={{ ml: 4 }}>Create User</ButtonCreate>
        </Link>

        {users ? (
          <UsersList
            users={users}
            onDelete={deleteUser}
            onRestore={restoreUser}
          />
        ) : (
          <Box sx={{ ml: 4 }}>
            <Typography variant="body1">No users found</Typography>
          </Box>
        )}
      </Box>
    </Suspense>
  );
};

// Protection configuration
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

// Export with protection
export default withRoleProtection(UsersPage, protectionConfig);
