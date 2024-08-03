// src/app/permissions/[id]/edit/page.tsx

"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPermission } from "../../../../lib/actions/permissionsActions";
import { usePermissions } from "../../../../../src/hooks/usePermissions";
import { PermissionForm } from "../../../../../src/components/Permissions/PermissionForm";
import { PermissionData } from "../../../../types/permissions";
import { Typography, Box, Paper } from "@mui/material";

import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../../../src/components/withRoleProtection";
const EditPermissionPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [permission, setPermission] = useState<PermissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { updatePermission } = usePermissions(token);

  useEffect(() => {
    const fetchPermission = async () => {
      if (typeof id !== "string") {
        setError("Invalid permission ID");
        setLoading(false);
        return;
      }
      try {
        const permissionId = parseInt(id, 10);
        if (isNaN(permissionId)) {
          throw new Error("Invalid permission ID");
        }
        const data = await getPermission(token, permissionId.toString());
        setPermission(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch permission");
        setLoading(false);
      }
    };

    fetchPermission();
  }, [id, token]);

  const handleSubmit = async (data: PermissionData) => {
    if (typeof id !== "string") {
      setError("Invalid permission ID");
      return;
    }
    const permissionId = parseInt(id, 10);
    if (isNaN(permissionId)) {
      setError("Invalid permission ID");
      return;
    }
    try {
      await updatePermission(permissionId, data);
      router.push("/dashboard/permissions");
    } catch (err) {
      setError("Failed to update permission");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!permission) return <div>Permission not found</div>;

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
          Edit Permission
        </Typography>
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <PermissionForm initialData={permission} onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
};
export default withRoleProtection(EditPermissionPage, ["Super Admin"]);
