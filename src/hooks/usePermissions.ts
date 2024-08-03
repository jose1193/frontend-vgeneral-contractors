// src/hooks/usePermissions.ts

import { useState, useEffect, useCallback } from "react";
import { PermissionData } from "../../app/types/permissions";
import { UserData } from "../../app/types/user";
import * as permissionsActions from "../../app/lib/actions/permissionsActions";

export const usePermissions = (token: string) => {
  const [permissions, setPermissions] = useState<PermissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedPermissions = await permissionsActions.getPermissions(token);
      setPermissions(fetchedPermissions);
      setError(null);
    } catch (err) {
      console.error("Error fetching permissions:", err);
      setError("Failed to fetch permissions");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const createPermission = async (permissionData: PermissionData) => {
    try {
      const newPermission = await permissionsActions.createPermission(
        token,
        permissionData
      );
      setPermissions([...permissions, newPermission]);
    } catch (err) {
      setError("Failed to create permission");
    }
  };

  const updatePermission = async (
    id: number,
    permissionData: PermissionData
  ) => {
    try {
      const updatedPermission = await permissionsActions.updatePermission(
        token,
        id,
        permissionData
      );
      setPermissions(
        permissions.map((permission) =>
          permission.id === id ? updatedPermission : permission
        )
      );
    } catch (err) {
      setError("Failed to update permission");
    }
  };

  const deletePermission = async (id: number) => {
    console.log("Attempting to delete permission with id:", id);
    try {
      console.log("Token:", token);
      console.log("ID :", id);
      await permissionsActions.deletePermission(token, id);
      console.log("Permission deleted successfully");
      setPermissions(permissions.filter((permission) => permission.id !== id));
    } catch (err) {
      console.error("Error deleting permission:", err);
      setError("Failed to delete permission");
    }
  };

  return {
    permissions,
    loading,
    error,
    createPermission,
    updatePermission,
    deletePermission,
  };
};
