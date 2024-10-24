import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { hasPermission as checkPermission } from "../utils/auth";
import { PermissionType } from "../config/permissions";
import { RoleName } from "../config/roles";

export function useRoleCheck() {
  const { data: session, status } = useSession();
  const userRole = session?.user?.user_role;
  const isLoading = status === "loading";

  const hasRole = useCallback(
    (role: RoleName) => {
      return userRole === role;
    },
    [userRole]
  );

  const hasPermission = useCallback(
    (permission: PermissionType) => {
      if (!userRole) return false;
      return checkPermission(userRole, permission);
    },
    [userRole]
  );

  const canAccessPath = useCallback(
    (path: string) => {
      if (!userRole) return false;
      // Implementa tu lógica de verificación de rutas aquí
      return true;
    },
    [userRole]
  );

  return {
    hasRole,
    hasPermission,
    canAccessPath,
    isLoading,
    userRole,
  };
}
