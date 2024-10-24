// src/config/roles.ts
import { PERMISSIONS, PermissionType } from "./permissions";

type RoleConfig = {
  name: string;
  permissions: PermissionType[];
  defaultRoute: string;
};

export const ROLES: Record<string, RoleConfig> = {
  "Super Admin": {
    name: "Super Admin",
    permissions: Object.keys(PERMISSIONS) as PermissionType[],
    defaultRoute: "/dashboard/admin",
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
      PERMISSIONS.MANAGE_COMPANIES,
    ],
    defaultRoute: "/dashboard/admin",
  },
  Manager: {
    name: "Manager",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.MANAGE_CLAIMS,
      PERMISSIONS.MANAGE_CUSTOMERS,
      PERMISSIONS.MANAGE_DOCUMENTS,
      PERMISSIONS.MANAGE_COMPANIES,
    ],
    defaultRoute: "/dashboard/manager",
  },
  Salesperson: {
    name: "Salesperson",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.MANAGE_CLAIMS,
      PERMISSIONS.MANAGE_CUSTOMERS,
      PERMISSIONS.MANAGE_SIGNATURES,
      PERMISSIONS.MANAGE_DOCUMENTS,
      PERMISSIONS.MANAGE_COMPANIES,
    ],
    defaultRoute: "/dashboard/salesperson",
  },
  "Technical Services": {
    name: "Technical Services",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.MANAGE_CLAIMS,
      PERMISSIONS.MANAGE_COMPANIES,
    ],
    defaultRoute: "/dashboard/technical-services",
  },
} as const;

export type RoleName = keyof typeof ROLES;
