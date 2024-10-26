// middleware.ts
import { NextResponse } from "next/server";
import { auth } from "./auth";
import {
  canAccessRoute,
  getDefaultRoute,
  isPublicRoute,
} from "./src/utils/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const userRole = req.auth?.user?.user_role;
  const pathname = req.nextUrl.pathname;
  //console.log("Middleware - Is logged in:", isLoggedIn);
  //console.log("Middleware - User role:", userRole);
  //console.log("Middleware - User:", req.auth?.user);
  // If it's just /dashboard, redirect to role-specific dashboard
  if (isLoggedIn && userRole && pathname === "/dashboard") {
    return NextResponse.redirect(new URL(getDefaultRoute(userRole), req.url));
  }

  // Handle public routes
  if (isPublicRoute(pathname)) {
    if (isLoggedIn && userRole) {
      // Redirect authenticated users from public routes to their dashboard
      return NextResponse.redirect(new URL(getDefaultRoute(userRole), req.url));
    }
    return NextResponse.next();
  }

  // Handle dashboard access
  if (pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (!userRole) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (!canAccessRoute(userRole, pathname)) {
      return NextResponse.redirect(new URL(getDefaultRoute(userRole), req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
