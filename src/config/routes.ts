// src/config/routes.ts
import { PERMISSIONS } from "./permissions";

export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/enter-pin",
  "/reset-password",
  "/verify-email",
] as const;

// Rutas por defecto según el rol
export const DEFAULT_ROUTES = {
  "Super Admin": "/dashboard",
  Admin: "/dashboard",
  Manager: "/dashboard",
  Salesperson: "/dashboard/claims",
  "Technical Services": "/dashboard/claims",
} as const;

// Configuración de rutas y sus permisos
export const ROUTE_GROUPS = {
  dashboard: {
    path: "/dashboard",
    permission: PERMISSIONS.VIEW_DASHBOARD,
    children: {
      profile: {
        path: "/dashboard/profile",
        permission: PERMISSIONS.VIEW_DASHBOARD,
      },
      users: {
        path: "/dashboard/users",
        permission: PERMISSIONS.MANAGE_USERS,
      },
      claims: {
        path: "/dashboard/claims",
        permission: PERMISSIONS.MANAGE_CLAIMS,
        children: {
          create: {
            path: "/dashboard/claims/create",
            permission: PERMISSIONS.MANAGE_CLAIMS,
          },
          list: {
            path: "/dashboard/claims/list",
            permission: PERMISSIONS.MANAGE_CLAIMS,
          },
        },
      },
      customers: {
        path: "/dashboard/customers",
        permission: PERMISSIONS.MANAGE_CUSTOMERS,
      },
      documents: {
        path: "/dashboard/documents",
        permission: PERMISSIONS.MANAGE_DOCUMENTS,
      },
      companies: {
        path: "/dashboard/companies",
        permission: PERMISSIONS.MANAGE_COMPANIES,
        children: {
          insurance: {
            path: "/dashboard/insurance-companies",
            permission: PERMISSIONS.MANAGE_COMPANIES,
          },
          public: {
            path: "/dashboard/public-companies",
            permission: PERMISSIONS.MANAGE_COMPANIES,
          },
          alliance: {
            path: "/dashboard/alliance-companies",
            permission: PERMISSIONS.MANAGE_COMPANIES,
          },
        },
      },
      integrations: {
        path: "/dashboard/integrations",
        permission: PERMISSIONS.MANAGE_INTEGRATIONS,
      },
    },
  },
} as const;
