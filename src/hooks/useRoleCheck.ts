// hooks/useRoleCheck.ts
import { useSession } from "next-auth/react";
import { ROLE_PERMISSIONS } from "../config/roles";

export function useRoleCheck() {
  const { data: session } = useSession();
  const userRole = session?.user?.user_role as
    | keyof typeof ROLE_PERMISSIONS
    | undefined;

  const checkAccess = (requiredRoles: string[]): boolean => {
    if (!userRole) return false;
    const allowedRoutes = ROLE_PERMISSIONS[userRole];
    return requiredRoles.some(
      (role) => allowedRoutes.includes("*") || allowedRoutes.includes(role)
    );
  };

  return { checkAccess };
}
