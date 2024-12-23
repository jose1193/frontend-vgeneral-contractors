// src/app/roles/page.tsx

"use client";

import React, { Suspense } from "react";
import { useRoles } from "../../../src/hooks/useRoles";
import { RoleForm } from "../../../src/components/Roles/RoleForm";
import RoleList from "../../../src/components/Roles/RoleList";
import { Button, Box, Typography } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../src/components/withRoleProtection";
import ButtonCreate from "../../components/ButtonCreate";
import TypographyHeading from "../../components/TypographyHeading";
import { PERMISSIONS } from "../../../src/config/permissions";
const RolesPage = () => {
  const { data: session, update } = useSession();

  const token = session?.accessToken as string;
  const { roles, loading, error, deleteRole } = useRoles(token);

  if (error) return <div>Error: {error}</div>;

  return (
    <Suspense>
      <Box
        sx={{
          width: "100%",

          overflow: "hidden",
        }}
      >
         <TypographyHeading>Roles</TypographyHeading>

        <Link href="/dashboard/roles/create" passHref>
          <ButtonCreate sx={{ ml: 4 }}>Create Role</ButtonCreate>
        </Link>
        <RoleList roles={roles} onDelete={deleteRole} />
      </Box>
    </Suspense>
  );
};
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

export default withRoleProtection(RolesPage, protectionConfig);
