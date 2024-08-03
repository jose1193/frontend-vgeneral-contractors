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
          Create Role
        </Typography>
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
export default withRoleProtection(CreateRolePage, ["Super Admin"]);
