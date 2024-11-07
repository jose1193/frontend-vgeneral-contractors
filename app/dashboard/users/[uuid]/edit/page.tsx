"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUser } from "../../../../lib/actions/usersActions";
import { useUsers } from "../../../../../src/hooks/useUsers";
import UsersForm from "../../../../../src/components/Users/UserForm";
import { UserData } from "../../../../types/user";
import {
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { withRoleProtection } from "../../../../../src/components/withRoleProtection";
import { useSession } from "next-auth/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TypographyHeading from "../../../../components/TypographyHeading";
import { PERMISSIONS } from "../../../../../src/config/permissions";

const EditUserPage = () => {
  const params = useParams();
  const userUuid =
    typeof params?.uuid === "string"
      ? params.uuid
      : Array.isArray(params?.uuid)
      ? params.uuid[0]
      : null;
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { updateUser } = useUsers(token);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userUuid || !token) {
        setError("Invalid user ID or authentication");
        setLoading(false);
        return;
      }

      try {
        const data = await getUser(token, userUuid);
        if (!data) {
          setError("User not found");
          setLoading(false);
          return;
        }

        setUser({ ...data, uuid: userUuid });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userUuid, token]);

  const handleSubmit = async (data: UserData) => {
    if (!userUuid) {
      throw new Error("Invalid user ID");
    }

    try {
      const updatedData = {
        ...data,
        uuid: userUuid,
      };

      await updateUser(userUuid, updatedData);
      router.push(`/dashboard/users/${userUuid}`);
      return userUuid;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update user";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleBack = () => {
    router.push(userUuid ? `/dashboard/users/${userUuid}` : "/dashboard/users");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Users
        </Button>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Users
        </Button>
        <Typography>User not found</Typography>
      </Box>
    );
  }

  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      }
    >
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
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Back to Profile
          </Button>
          <TypographyHeading>Edit User</TypographyHeading>
        </Box>

        <Paper
          elevation={3}
          sx={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backgroundColor: "background.paper",
          }}
        >
          <UsersForm
            initialData={user}
            onSubmit={handleSubmit}
            uuid={userUuid}
          />
        </Paper>
      </Box>
    </Suspense>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

export default withRoleProtection(EditUserPage, protectionConfig);
