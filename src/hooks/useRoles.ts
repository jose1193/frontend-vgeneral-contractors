// src/hooks/useRoles.ts

import { useState, useEffect, useCallback } from "react";
import { RolesData } from "../../app/types/roles"; // Cambia a los tipos de roles
import * as rolesActions from "../../app/lib/actions/rolesActions"; // Cambia a las acciones de roles

export const useRoles = (token: string) => {
  const [roles, setRoles] = useState<RolesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const roles = await rolesActions.getRoles(token);
        setRoles(roles);
        setError(null);
      } catch (err) {
        console.error("Error fetching roles:", err);
        setError("Failed to fetch roles");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [token]);

  const createRole = async (roleData: RolesData) => {
    try {
      const newRole = await rolesActions.createRole(token, roleData);
      setRoles([...roles, newRole]);
    } catch (err) {
      setError("Failed to create role");
    }
  };

  const updateRole = async (id: number, roleData: RolesData) => {
    try {
      const updatedRole = await rolesActions.updateRole(token, id, roleData);
      setRoles(roles.map((role) => (role.id === id ? updatedRole : role)));
    } catch (err) {
      setError("Failed to update role");
    }
  };

  const deleteRole = async (id: number) => {
    console.log("Attempting to delete role with id:", id);
    try {
      console.log("Token:", token);
      console.log("ID :", id);
      await rolesActions.deleteRole(token, id);
      console.log("Role deleted successfully");
      setRoles(roles.filter((role) => role.id !== id));
    } catch (err) {
      console.error("Error deleting role:", err);
      setError("Failed to delete role");
    }
  };

  return {
    roles,
    loading,
    error,
    createRole,
    updateRole,
    deleteRole,
  };
};
