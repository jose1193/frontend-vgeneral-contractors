// src/utils/auth.ts
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
  if (!role) return "/";
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

  // Si la ruta es /dashboard, permitir acceso basado en VIEW_DASHBOARD
  if (route === "/dashboard") {
    return hasPermission(role, PERMISSIONS.VIEW_DASHBOARD);
  }

  const roleConfig = ROLES[role as RoleName];
  if (!roleConfig) return false;

  // Verificar permisos específicos basados en la ruta
  if (route.startsWith("/dashboard/claims")) {
    return hasPermission(role, PERMISSIONS.MANAGE_CLAIMS);
  }
  if (route.startsWith("/dashboard/customers")) {
    return hasPermission(role, PERMISSIONS.MANAGE_CUSTOMERS);
  }
  // Añadir más verificaciones específicas según tus rutas

  // Por defecto, verificar VIEW_DASHBOARD
  return hasPermission(role, PERMISSIONS.VIEW_DASHBOARD);
};
