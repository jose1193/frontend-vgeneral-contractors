import { useSession } from "next-auth/react";
import React from "react";
import { ROLES, RoleName } from "../config/roles";
import { PermissionType } from "../config/permissions";
import { hasPermission, canAccessRoute, isSuperAdmin } from "../utils/auth";

interface RoleCheckHook {
  hasPermission: (permission: PermissionType) => boolean;
  canAccessPath: (path: string) => boolean;
  hasRole: (role: RoleName) => boolean;
  isSuperAdmin: boolean;
  userRole?: RoleName;
  isLoading: boolean;
}

export function useRoleCheck(): RoleCheckHook {
  const { data: session, status } = useSession();
  const userRole = session?.user?.user_role as RoleName | undefined;
  const isLoading = status === "loading";

  const authUtils = React.useMemo(
    () => ({
      hasPermission: (permission: PermissionType): boolean => {
        if (!userRole) return false;
        return hasPermission(userRole, permission);
      },
      canAccessPath: (path: string): boolean => {
        if (!userRole) return false;
        return canAccessRoute(userRole, path);
      },
      hasRole: (role: RoleName): boolean => userRole === role,
      isSuperAdmin: userRole ? isSuperAdmin(userRole) : false,
    }),
    [userRole]
  );

  return {
    ...authUtils,
    userRole,
    isLoading,
  };
}
