// src/hooks/useListPermissions.ts
import { useRoleCheck } from "./useRoleCheck";
import { PERMISSIONS, PermissionType } from "../config/permissions";
import { RoleName } from "../config/roles";

interface ListPermissionConfig {
  permission: PermissionType;
  restrictedRoles?: RoleName[];
  allowedRoles?: RoleName[];
}

export const useListPermissions = () => {
  const { can, hasRole: originalHasRole, userRole } = useRoleCheck();

  const hasRole = (roles: RoleName | RoleName[]): boolean => {
    if (Array.isArray(roles)) {
      return roles.some((role) => originalHasRole(role));
    }
    return originalHasRole(roles);
  };

  const canModifyList = (config: ListPermissionConfig) => {
    const hasPermission = can(config.permission);

    if (!hasPermission) return false;

    if (config.restrictedRoles?.includes(userRole as RoleName)) {
      return false;
    }

    if (config.allowedRoles?.length) {
      return config.allowedRoles.includes(userRole as RoleName);
    }

    return true;
  };

  return {
    canModifyList,
    can,
    hasRole,
  };
};
