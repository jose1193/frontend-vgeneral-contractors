"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRole } from "../../../../lib/actions/rolesActions";
import { useRoles } from "../../../../../src/hooks/useRoles";
import { RoleForm } from "../../../../../src/components/Roles/RoleForm";
import { RolesData } from "../../../../types/roles";
import { Typography, Box, Paper } from "@mui/material";
import { withRoleProtection } from "../../../../../src/components/withRoleProtection";
import { useSession } from "next-auth/react";

const EditRolePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [role, setRole] = useState<RolesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { updateRole } = useRoles(token);

  useEffect(() => {
    const fetchRole = async () => {
      if (typeof id !== "string") {
        setError("Invalid role ID");
        setLoading(false);
        return;
      }
      try {
        const roleId = parseInt(id, 10);
        if (isNaN(roleId)) {
          throw new Error("Invalid role ID");
        }
        const data = await getRole(token, roleId.toString());
        setRole(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch role");
        setLoading(false);
      }
    };

    fetchRole();
  }, [id, token]);

  const handleSubmit = async (data: RolesData) => {
    if (typeof id !== "string") {
      setError("Invalid role ID");
      return;
    }
    const roleId = parseInt(id, 10);
    if (isNaN(roleId)) {
      setError("Invalid role ID");
      return;
    }
    try {
      await updateRole(roleId, data);
      router.push("/dashboard/roles");
    } catch (err) {
      setError("Failed to update role");
    }
  };

  if (!role) return <div></div>;

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Edit Role
        </Typography>
        <Suspense>
          <RoleForm initialData={role} onSubmit={handleSubmit} />
        </Suspense>
      </Paper>
    </Box>
  );
};
export default withRoleProtection(EditRolePage, ["Super Admin"]);
