// app/constants/routes.ts

export const ROUTES = {
  // Dashboard routes
  DASHBOARD: {
    HOME: "/dashboard",
    PROFILE: "/dashboard/profile",
    CUSTOMERS: "/dashboard/customers",

    CLAIMS: {
      ROOT: "/dashboard/claims",
      CREATE: "/dashboard/claims/create",
      LIST: "/dashboard/claims",
    },

    DOCUSIGN: {
      ROOT: "/dashboard/docusign",
      CONNECT: "/dashboard/docusign/connect",
      DOCUMENTS: "/dashboard/docusign/documents",
      STATUS: "/dashboard/docusign/status",
      SETTINGS: "/dashboard/docusign/settings",
      CALLBACK: "/auth/docusign/callback",
      MONITORING: "/dashboard/docusign/monitoring",
      TEMPLATES: "/dashboard/docusign/templates",
      ENVELOPES: "/dashboard/docusign/envelopes",
      RECIPIENTS: "/dashboard/docusign/recipients",
      LOGS: "/dashboard/docusign/logs",
      SETTINGS_CONNECTION: "/dashboard/docusign/settings/connection",
      SETTINGS_PREFERENCES: "/dashboard/docusign/settings/preferences",
      SETTINGS_NOTIFICATIONS: "/dashboard/docusign/settings/notifications",
    },

    SIGNATURES: {
      SALESPERSON: "/dashboard/salesperson-signature",
      COMPANY: "/dashboard/company-signature",
    },

    PROSPECTS: "/dashboard/prospects",
    DEALS: "/dashboard/deals",
    PROJECTS: "/dashboard/projects",
    STAGES: "/dashboard/stage",
    CALENDARS: "/dashboard/calendars",
    EMAILS: "/dashboard/emails",

    COMPANIES: {
      INSURANCE: "/dashboard/insurance-companies",
      PUBLIC: "/dashboard/public-companies",
      ALLIANCE: "/dashboard/alliance-companies",
      MORTGAGE: "/dashboard/mortgage-companies",
    },

    INTEGRATIONS: {
      AI_TOOLS: "/dashboard/ai-tools",
      QUICKBOOKS: "/dashboard/quickbooks-api",
      COMPANYCAM: "/dashboard/companycam-api",
    },

    DOCUMENTS: {
      VG_COMPANY: "/dashboard/document-templates",
      ALLIANCE_COMPANY: "/dashboard/document-template-alliances",
    },

    CONFIG: {
      USERS: "/dashboard/users",
      ROLES: "/dashboard/roles",
      PERMISSIONS: "/dashboard/permissions",
      TYPE_DAMAGES: "/dashboard/type-damages",
      CAUSE_OF_LOSSES: "/dashboard/cause-of-losses",
      COMPANY_SIGNATURE: "/dashboard/company-signature",
    },
  },

  // Auth routes
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    DOCUSIGN_CALLBACK: "/auth/docusign/callback",
  },

  // API routes
  API: {
    DOCUSIGN: {
      WEBHOOK: "/api/docusign/webhook",
      CONNECT: "/api/docusign/connect",
      STATUS: "/api/docusign/status",
    },
  },
} as const;

// Types for routes
export type RouteKeys = keyof typeof ROUTES;
export type DashboardRoutes = keyof typeof ROUTES.DASHBOARD;
export type DocuSignRoutes = keyof typeof ROUTES.DASHBOARD.DOCUSIGN;
export type CompanyRoutes = keyof typeof ROUTES.DASHBOARD.COMPANIES;
export type ConfigRoutes = keyof typeof ROUTES.DASHBOARD.CONFIG;

// Helper functions
export const getRoute = (route: string): string => {
  return route.startsWith("/") ? route : `/${route}`;
};

export const getDocuSignRoute = (route: DocuSignRoutes): string => {
  return ROUTES.DASHBOARD.DOCUSIGN[route];
};

export const buildRoute = (
  route: string,
  params: Record<string, string> = {}
): string => {
  let finalRoute = route;
  Object.entries(params).forEach(([key, value]) => {
    finalRoute = finalRoute.replace(`:${key}`, value);
  });
  return finalRoute;
};
