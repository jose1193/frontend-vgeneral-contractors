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
          mt: -3,
          ml: -7,
          mb: 10,
          p: { xs: 3, sm: 3, md: 2, lg: 4 },
        }}
      >
        <Button
          variant="outlined"
          onClick={() => window.history.back()}
          startIcon={<ArrowBackIcon />}
          style={{ marginBottom: "20px" }}
        >
          Back
        </Button>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            mb: 5,
            fontWeight: "bold",
            fontSize: {
              xs: "1.5rem",
              sm: "1.75rem",
              md: "2rem",
              lg: "2.25rem",
            },
          }}
        >
          Create User
        </Typography>
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
export default withRoleProtection(CreateUserPage, ["Super Admin"]);
