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
          Roles
        </Typography>

        <Link href="/dashboard/roles/create" passHref>
          <Button
            variant="contained"
            color="primary"
            sx={{
              ml: 4,
            }}
          >
            Create Role
          </Button>
        </Link>
        <RoleList roles={roles} onDelete={deleteRole} />
      </Box>
    </Suspense>
  );
};
export default withRoleProtection(RolesPage, ["Super Admin"]);
