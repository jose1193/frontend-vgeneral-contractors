"use client";
import React, { Suspense } from "react";
import { useUsers } from "../../../../src/hooks/useUsers";
import UsersForm from "../../../../src/components/Users/UserForm";
import { Box, Paper, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { UserData } from "../../../../app/types/user";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import TypographyHeading from "../../../components/TypographyHeading";
import { PERMISSIONS } from "../../../../src/config/permissions";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CreateUserPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const token = session?.accessToken as string;
  const { createUser } = useUsers(token);

  const handleSubmit = async (data: UserData): Promise<string> => {
    try {
      const newUser = await createUser(data);

      if (!newUser || !newUser.uuid) {
        throw new Error("No UUID received from user creation");
      }

      console.log("New user created:", newUser);
      router.push(`/dashboard/users/${newUser.uuid}`);

      return newUser.uuid;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const handleBack = () => {
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            gap: 2,
          }}
        >
          <TypographyHeading>Create User</TypographyHeading>
        </Box>

        <Paper
          elevation={3}
          sx={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backgroundColor: "background.paper",
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
