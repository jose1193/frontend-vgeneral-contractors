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
          ml: -7,
          mb: 10,
          p: { xs: 3, sm: 3, md: 2, lg: 4 },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            mb: 5,
            fontSize: {
              xs: "1.5rem",
              sm: "1.75rem",
              md: "2rem",
              lg: "2.25rem",
            },
          }}
        >
          Create Permission
        </Typography>
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
export default withRoleProtection(CreatePermissionPage, ["Super Admin"]);
