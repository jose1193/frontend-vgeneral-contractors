// src/config/roles.ts

export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/auth/forgot-password",
  "/auth/enter-pin",
  "/auth/reset-password",
];

export const ROLE_ROUTES = {
  "Super Admin": "/dashboard/super-admin",
  Admin: "/dashboard/admin",
  Manager: "/dashboard/manager",
  Lead: "/dashboard/lead",
  "Technical Services": "/dashboard/technical-services",
};

export const DEFAULT_AUTH_ROUTE = "/dashboard";

export const ROLE_PERMISSIONS = {
  "Super Admin": ["*"],
  Admin: ["/dashboard/admin", "/dashboard/manager", "/dashboard/lead"],
  Manager: ["/dashboard/manager"],
  Lead: ["/dashboard/lead"],
  "Technical Services": ["/dashboard/technical-services"],
};
