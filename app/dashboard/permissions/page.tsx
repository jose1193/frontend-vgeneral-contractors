// src/app/permissions/page.tsx

"use client";

import React, { Suspense } from "react";
import { usePermissions } from "../../../src/hooks/usePermissions";

import PermissionList from "../../../src/components/Permissions/PermissionList";
import { Button, Container, Typography, Box, Paper } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../src/components/withRoleProtection";
const PermissionsPage = () => {
  const { data: session, update } = useSession();

  const token = session?.accessToken as string;
  const { permissions, loading, error, deletePermission } =
    usePermissions(token);

  if (error) return <div>Error: {error}</div>;

  return (
    <Suspense>
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
          Permissions
        </Typography>

        <Link href="/dashboard/permissions/create" passHref>
          <Button
            variant="contained"
            color="primary"
            sx={{
              ml: 4,
            }}
          >
            Create Permission
          </Button>
        </Link>
        <PermissionList permissions={permissions} onDelete={deletePermission} />
      </Box>
    </Suspense>
  );
};
export default withRoleProtection(PermissionsPage, ["Super Admin"]);
