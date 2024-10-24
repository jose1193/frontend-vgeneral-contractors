import { useSession } from "next-auth/react";
import { ROLES, RoleName } from "../config/roles";
import { PermissionType } from "../config/permissions";
import { canAccessRoute } from "../utils/auth";

interface RoleCheckHook {
  hasPermission: (permission: PermissionType) => boolean;
  canAccessPath: (path: string) => boolean;
  hasRole: (role: RoleName) => boolean;
  userRole?: RoleName;
  isLoading: boolean;
}

export function useRoleCheck(): RoleCheckHook {
  const { data: session, status } = useSession();
  const userRole = session?.user?.user_role as RoleName | undefined;
  const isLoading = status === "loading";

  const hasPermission = (permission: PermissionType): boolean => {
    if (!userRole) return false;

    // Super Admin tiene todos los permisos
    if (userRole === "Super Admin") return true;

    const roleConfig = ROLES[userRole];
    if (!roleConfig) return false;

    return roleConfig.permissions.includes(permission);
  };

  const canAccessPath = (path: string): boolean => {
    if (!userRole) return false;
    return canAccessRoute(userRole, path);
  };

  const hasRole = (role: RoleName): boolean => {
    return userRole === role;
  };

  return {
    hasPermission,
    canAccessPath,
    hasRole,
    userRole,
    isLoading,
  };
}
