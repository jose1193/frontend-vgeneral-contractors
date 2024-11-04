// src/app/permissions/create/page.tsx

"use client";

import React, { Suspense } from "react";
import { usePermissions } from "../../../../src/hooks/usePermissions";
import { PermissionForm } from "../../../../src/components/Permissions/PermissionForm";
import { Typography, Box, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { PermissionData } from "../../../../app/types/permissions";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import TypographyHeading from "../../../components/TypographyHeading";
import { PERMISSIONS } from "../../../../src/config/permissions";
const CreatePermissionPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const token = session?.accessToken as string;
  const { createPermission } = usePermissions(token);

  const handleSubmit = async (data: PermissionData) => {
    await createPermission(data);
    console.log("Permission data to submit:", data);
    router.push("/dashboard/permissions");
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
        <TypographyHeading> Create Permission</TypographyHeading>

        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <PermissionForm onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
};
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

// Single export default with protection
export default withRoleProtection(CreatePermissionPage, protectionConfig);
