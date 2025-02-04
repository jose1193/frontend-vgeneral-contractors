// src/app/roles/create/page.tsx

"use client";

import React, { Suspense } from "react";
import { useRoles } from "../../../../src/hooks/useRoles";
import { RoleForm } from "../../../../src/components/Roles/RoleForm";
import { Typography, Box, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { RolesData } from "../../../../app/types/roles";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import TypographyHeading from "../../../components/TypographyHeading";
import { PERMISSIONS } from "../../../../src/config/permissions";
const CreateRolePage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const token = session?.accessToken as string;
  const { createRole } = useRoles(token);

  const handleSubmit = async (data: RolesData) => {
    await createRole(data);
    console.log("Role data to submit:", data);
    router.push("/dashboard/roles");
  };

  return (
    <Suspense>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",

          mb: 10,
          p: { xs: 1, lg: 2 },
        }}
      >
        <TypographyHeading> Create Role</TypographyHeading>
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <RoleForm onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

// Single export default with protection
export default withRoleProtection(CreateRolePage, protectionConfig);
