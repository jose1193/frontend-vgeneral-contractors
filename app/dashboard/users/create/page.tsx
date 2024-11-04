// src/app/users/create/page.tsx

"use client";
import React, { Suspense } from "react";

import { useUsers } from "../../../../src/hooks/useUsers";
import UsersForm from "../../../../src/components/Users/UserForm";
import { Container, Typography, Box, Paper, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { UserData } from "../../../../app/types/user";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import TypographyHeading from "../../../components/TypographyHeading";
import { PERMISSIONS } from "../../../../src/config/permissions";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
const CreateUserPage = () => {
  const { data: session, update } = useSession();
  const router = useRouter();

  const token = session?.accessToken as string;
  const { createUser } = useUsers(token);

  const handleSubmit = async (data: UserData) => {
    await createUser(data);
    console.log("Datos del formulario a enviar:", data);
    router.push("/dashboard/users");
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
        <TypographyHeading> Create User</TypographyHeading>

        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <UsersForm onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
};
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_DOCUMENTS],
};

export default withRoleProtection(CreateUserPage, protectionConfig);
