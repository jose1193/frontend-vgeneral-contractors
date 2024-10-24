// src/utils/auth.ts
import { PUBLIC_ROUTES, ROUTE_GROUPS, DEFAULT_ROUTES } from "../config/routes";
import { PERMISSIONS, PermissionType } from "../config/permissions";
import { ROLES } from "../config/roles";

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname as any);
}

export function hasPermission(
  role: string,
  permission: PermissionType
): boolean {
  const roleConfig = ROLES[role];
  if (!roleConfig) return false;
  if (role === "Super Admin") return true;
  return roleConfig.permissions.includes(permission);
}

export function getDefaultRoute(role: string): string {
  return DEFAULT_ROUTES[role as keyof typeof DEFAULT_ROUTES] ?? "/dashboard";
}

export function canAccessRoute(role: string, route: string): boolean {
  // Si no hay rol o ruta, denegar acceso
  if (!role || !route) return false;

  // Si es una ruta pública, permitir acceso
  if (isPublicRoute(route)) return true;

  // Super Admin tiene acceso a todo
  if (role === "Super Admin") return true;

  // Verificar si el rol existe
  const roleConfig = ROLES[role];
  if (!roleConfig) return false;

  // Buscar la configuración de la ruta
  const routeConfig = findRouteConfig(ROUTE_GROUPS, route);
  if (!routeConfig) return false;

  // Verificar el permiso
  return !routeConfig.permission || hasPermission(role, routeConfig.permission);
}

function findRouteConfig(routeGroup: any, targetRoute: string): any {
  for (const key in routeGroup) {
    const route = routeGroup[key];

    if (typeof route === "object") {
      if (route.path && targetRoute.startsWith(route.path)) {
        return route;
      }
      if (route.children) {
        const found = findRouteConfig(route.children, targetRoute);
        if (found) return found;
      }
    }
  }
  return null;
}

// Función de utilidad para verificar si una ruta específica requiere autenticación
export function requiresAuth(pathname: string): boolean {
  return !isPublicRoute(pathname);
}
