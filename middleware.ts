//middleware.ts
import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const userRole = req.auth?.user?.user_role;

  console.log("Middleware - Is logged in:", isLoggedIn);
  console.log("Middleware - User role:", userRole);

  const pathname = req.nextUrl.pathname;

  if (isLoggedIn) {
    if (!userRole) {
      console.error("User is logged in but has no role assigned");
      return NextResponse.redirect(new URL("/error", req.url));
    }

    if (pathname === "/" || pathname === "/") {
      const dashboardRoute = getDashboardRouteForRole(userRole);
      return NextResponse.redirect(new URL(dashboardRoute, req.url));
    }

    // Verificar acceso basado en el rol
    if (!hasAccessToRoute(userRole, pathname)) {
      const defaultDashboard = getDashboardRouteForRole(userRole);
      return NextResponse.redirect(new URL(defaultDashboard, req.url));
    }
  } else {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

function getDashboardRouteForRole(role: string | undefined): string {
  switch (role) {
    case "Super Admin":
      return "/dashboard/super-admin";
    case "Admin":
      return "/dashboard/admin";
    case "Manager":
      return "/dashboard/manager";
    case "Lead":
      return "/dashboard/lead";
    case "Technical Services":
      return "/dashboard/technical-services";
    default:
      return "/dashboard";
  }
}

function hasAccessToRoute(role: string | undefined, pathname: string): boolean {
  if (pathname.startsWith("/dashboard/super-admin")) {
    return role === "Super Admin";
  }
  if (pathname.startsWith("/dashboard/admin")) {
    return role === "Super Admin" || role === "Admin";
  }
  if (pathname.startsWith("/dashboard/manager")) {
    return role === "Super Admin" || role === "Admin" || role === "Manager";
  }
  if (pathname.startsWith("/dashboard/lead")) {
    return role === "Super Admin" || role === "Admin" || role === "Lead";
  }
  if (pathname.startsWith("/dashboard/technical-services")) {
    return (
      role === "Super Admin" ||
      role === "Admin" ||
      role === "Technical Services"
    );
  }
  return true;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
