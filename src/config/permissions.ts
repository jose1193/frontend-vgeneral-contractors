// src/config/permissions.ts
export const PERMISSIONS = {
  VIEW_DASHBOARD: "VIEW_DASHBOARD",
  MANAGE_USERS: "MANAGE_USERS",
  MANAGE_CLAIMS: "MANAGE_CLAIMS",
  MANAGE_CUSTOMERS: "MANAGE_CUSTOMERS",
  MANAGE_DOCUMENTS: "MANAGE_DOCUMENTS",
  MANAGE_SIGNATURES: "MANAGE_SIGNATURES",
  MANAGE_INTEGRATIONS: "MANAGE_INTEGRATIONS",
  MANAGE_COMPANIES: "MANAGE_COMPANIES",
  MANAGE_CONFIG: "MANAGE_CONFIG",
  VIEW_REPORTS: "VIEW_REPORTS",
} as const;

export type PermissionType = keyof typeof PERMISSIONS;

export const PERMISSION_DETAILS = {
  [PERMISSIONS.VIEW_DASHBOARD]: {
    name: "view_dashboard",
    description: "Can view dashboard",
  },
  [PERMISSIONS.MANAGE_USERS]: {
    name: "manage_users",
    description: "Can manage users",
  },
  [PERMISSIONS.MANAGE_CLAIMS]: {
    name: "manage_claims",
    description: "Can manage claims",
  },
  [PERMISSIONS.MANAGE_CUSTOMERS]: {
    name: "manage_customers",
    description: "Can manage customers",
  },
  [PERMISSIONS.MANAGE_DOCUMENTS]: {
    name: "manage_documents",
    description: "Can manage documents",
  },
  [PERMISSIONS.MANAGE_SIGNATURES]: {
    name: "manage_signatures",
    description: "Can manage signatures",
  },
  [PERMISSIONS.MANAGE_INTEGRATIONS]: {
    name: "manage_integrations",
    description: "Can manage integrations",
  },
  [PERMISSIONS.MANAGE_COMPANIES]: {
    name: "manage_companies",
    description: "Can manage companies",
  },
  [PERMISSIONS.MANAGE_CONFIG]: {
    name: "manage_config",
    description: "Can manage config",
  },
  [PERMISSIONS.VIEW_REPORTS]: {
    name: "view_reports",
    description: "Can view reports",
  },
} as const;
