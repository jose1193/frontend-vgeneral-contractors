// src/app/permissions/page.tsx

"use client";

import React, { Suspense } from "react";
import { usePermissions } from "../../../src/hooks/usePermissions";

import PermissionList from "../../../src/components/Permissions/PermissionList";
import { Button, Container, Typography, Box, Paper } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../src/components/withRoleProtection";
import ButtonCreate from "../../components/ButtonCreate";
import TypographyHeading from "../../components/TypographyHeading";
import { PERMISSIONS } from "../../../src/config/permissions";
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

          overflow: "hidden",
        }}
      >
        <TypographyHeading>Permissions</TypographyHeading>
        <Link href="/dashboard/permissions/create" passHref>
          <ButtonCreate> Create Permission</ButtonCreate>
        </Link>
        <PermissionList permissions={permissions} onDelete={deletePermission} />
      </Box>
    </Suspense>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

export default withRoleProtection(PermissionsPage, protectionConfig);
