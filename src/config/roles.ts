// src/config/roles.ts
import { PERMISSIONS, PermissionType } from "./permissions";

export type Role = {
  name: string;
  permissions: PermissionType[];
  defaultRoute: string;
};

export const ROLES: Record<string, Role> = {
  "Super Admin": {
    name: "Super Admin",
    permissions: Object.keys(PERMISSIONS) as PermissionType[],
    defaultRoute: "/dashboard",
  },
  Admin: {
    name: "Admin",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.MANAGE_CLAIMS,
      PERMISSIONS.MANAGE_CUSTOMERS,
      PERMISSIONS.MANAGE_DOCUMENTS,
      PERMISSIONS.MANAGE_SIGNATURES,
      PERMISSIONS.MANAGE_CONFIG,
    ],
    defaultRoute: "/dashboard",
  },
  Manager: {
    name: "Manager",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.MANAGE_CLAIMS,
      PERMISSIONS.MANAGE_CUSTOMERS,
      PERMISSIONS.MANAGE_DOCUMENTS,
    ],
    defaultRoute: "/dashboard",
  },
  Salesperson: {
    name: "Salesperson",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.MANAGE_CLAIMS,
      PERMISSIONS.MANAGE_CUSTOMERS,
      PERMISSIONS.MANAGE_SIGNATURES,
      PERMISSIONS.MANAGE_DOCUMENTS,
    ],
    defaultRoute: "/dashboard",
  },
  "Technical Services": {
    name: "Technical Services",
    permissions: [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.MANAGE_CLAIMS],
    defaultRoute: "/dashboard",
  },
} as const;

// Helper function para verificar que todos los permisos son válidos
const validatePermissions = () => {
  Object.values(ROLES).forEach((role) => {
    role.permissions.forEach((permission) => {
      if (!PERMISSIONS[permission]) {
        console.error(
          `Invalid permission "${permission}" in role "${role.name}"`
        );
      }
    });
  });
};

// Ejecutar validación en desarrollo
if (process.env.NODE_ENV === "development") {
  validatePermissions();
}

export type RoleName = keyof typeof ROLES;
