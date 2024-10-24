// src/config/auth.ts
/**
 * Configuration for authentication and authorization
 */
export const AUTH_CONFIG = {
  // Routes
  loginRoute: "/",
  logoutRoute: "/logout",
  registerRoute: "/register",
  defaultAuthRoute: "/dashboard",
  errorRoute: "/error",

  // Session configuration
  sessionMaxAge: 30 * 24 * 60 * 60, // 30 days in seconds

  // Authentication methods
  allowEmailAuth: true,
  allowGoogleAuth: true,

  // Password requirements
  passwordMinLength: 8,
  passwordRequireUppercase: true,
  passwordRequireNumber: true,
  passwordRequireSpecialChar: true,

  // Rate limiting
  maxLoginAttempts: 5,
  loginLockoutDuration: 15 * 60, // 15 minutes in seconds

  // Token configuration
  jwtExpiresIn: "1d",
  refreshTokenExpiresIn: "7d",

  // Cookie settings
  cookieMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  cookieSecure: process.env.NODE_ENV === "production",

  // API endpoints
  apiBasePath: "/api/auth",

  // Verification
  requireEmailVerification: true,
  verificationTokenExpiry: 24 * 60 * 60, // 24 hours in seconds
} as const;

// Error messages
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email or password",
  ACCOUNT_LOCKED: "Account temporarily locked due to too many failed attempts",
  EMAIL_NOT_VERIFIED: "Please verify your email address",
  INVALID_TOKEN: "Invalid or expired token",
  UNAUTHORIZED: "You are not authorized to access this resource",
  SESSION_EXPIRED: "Your session has expired",
  INVALID_ROLE: "Invalid user role",
} as const;

// Success messages
export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Successfully logged in",
  LOGOUT_SUCCESS: "Successfully logged out",
  PASSWORD_RESET: "Password successfully reset",
  EMAIL_VERIFIED: "Email successfully verified",
  VERIFICATION_SENT: "Verification email sent",
} as const;
