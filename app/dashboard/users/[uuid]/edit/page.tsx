// src/app/users/[id]/edit/page.tsx
"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUser } from "../../../../lib/actions/usersActions";
import { useUsers } from "../../../../../src/hooks/useUsers";
import UsersForm from "../../../../../src/components/Users/UserForm";
import { UserData } from "../../../../types/user";
import { Container, Typography, Box, Paper } from "@mui/material";
import RoleGuard from "@/components/RoleGuard";
import { useSession } from "next-auth/react";
const EditUserPage = () => {
  const { uuid } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real app, you'd get the token from your auth system
  const { data: session, update } = useSession();
  // In a real app, you'd get the token from your auth system
  const token = session?.accessToken as string;
  const { updateUser } = useUsers(token);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser(token, uuid as string);
        setUser(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user");
        setLoading(false);
      }
    };

    fetchUser();
  }, [uuid, token]);

  const handleSubmit = async (data: UserData) => {
    await updateUser(uuid as string, data);
    router.push("/dashboard/users");
  };

  if (error) return <div>Error: {error}</div>;
  if (!user) return <div></div>;

  return (
    <RoleGuard
      allowedRoles={["Super Admin", "Admin"]}
      redirectTo="/unauthorized"
    >
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
            sx={{
              fontSize: {
                xs: "1.5rem",
                sm: "1.75rem",
                md: "2rem",
                lg: "2.25rem",
              },
            }}
            component="h1"
            gutterBottom
          >
            Edit User
          </Typography>
          <Paper
            elevation={3}
            style={{
              padding: "20px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <UsersForm initialData={user} onSubmit={handleSubmit} />
          </Paper>
        </Box>
      </Suspense>
    </RoleGuard>
  );
};

export default EditUserPage;
