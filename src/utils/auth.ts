import { PERMISSIONS, PermissionType } from "../config/permissions";
import { ROLES, RoleName } from "../config/roles";

export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/enter-pin",
  "/reset-password",
  "/verify-email",
] as const;

export const isSuperAdmin = (role: string): boolean => role === "Super Admin";

export const isPublicRoute = (pathname: string): boolean =>
  PUBLIC_ROUTES.includes(pathname as any);

export const hasPermission = (
  role: string | undefined,
  permission: PermissionType
): boolean => {
  if (!role) return false;
  if (isSuperAdmin(role)) return true;

  const roleConfig = ROLES[role as RoleName];
  if (!roleConfig) return false;

  return roleConfig.permissions.includes(permission);
};

export const getDefaultRoute = (role: string | undefined): string => {
  if (!role) return "/login";
  const roleConfig = ROLES[role as RoleName];
  return roleConfig?.defaultRoute ?? "/dashboard";
};

export const getRoleBasePath = (role: string): string => {
  return `/dashboard/${role.toLowerCase().replace(/\s+/g, "-")}`;
};

export const canAccessRoute = (
  role: string | undefined,
  route: string
): boolean => {
  if (!role || !route) return false;
  if (isPublicRoute(route)) return true;
  if (isSuperAdmin(role)) return true;

  // Check if user is trying to access their role-specific dashboard
  const roleBasePath = getRoleBasePath(role);
  if (!route.startsWith(roleBasePath)) {
    return false;
  }

  const roleConfig = ROLES[role as RoleName];
  if (!roleConfig) return false;

  // If they have VIEW_DASHBOARD permission, they can access their dashboard
  return hasPermission(role, PERMISSIONS.VIEW_DASHBOARD);
};

export const requiresAuth = (pathname: string): boolean =>
  !isPublicRoute(pathname);
