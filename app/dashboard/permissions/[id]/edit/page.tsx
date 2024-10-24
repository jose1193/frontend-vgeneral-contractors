"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPermission } from "../../../../lib/actions/permissionsActions";
import { usePermissions } from "../../../../../src/hooks/usePermissions";
import { PermissionForm } from "../../../../../src/components/Permissions/PermissionForm";
import { PermissionData } from "../../../../types/permissions";
import { Typography, Box, Paper, Button, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../../../src/components/withRoleProtection";
import TypographyHeading from "../../../../components/TypographyHeading";
import { PERMISSIONS } from "../../../../../src/config/permissions";
import DetailsSkeleton from "@/components/skeletons/DetailsSkeleton";

// Custom error component
const ErrorComponent = ({ message }: { message: string }) => (
  <Box sx={{ p: 3 }}>
    <Alert severity="error" sx={{ mb: 2 }}>
      {message}
    </Alert>
    <Button
      variant="contained"
      onClick={() => window.history.back()}
      startIcon={<ArrowBackIcon />}
    >
      Go Back
    </Button>
  </Box>
);

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
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

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
        if (!data) {
          setError("Permission not found");
          return;
        }
        setPermission(data);
      } catch (err) {
        setError("Failed to fetch permission");
      } finally {
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

  if (loading) {
    return <DetailsSkeleton />;
  }

  if (error || !permission) {
    return <ErrorComponent message={error || "Permission not found"} />;
  }

  return (
    <Suspense fallback={<DetailsSkeleton />}>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
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

        <TypographyHeading>Edit Permission</TypographyHeading>

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

// Protection configuration
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

// Single export default with protection
export default withRoleProtection(EditPermissionPage, protectionConfig);
