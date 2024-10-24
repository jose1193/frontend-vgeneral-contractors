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

  // Si es una ruta pública, permitir acceso
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Si no está logueado y trata de acceder a dashboard
  if (!isLoggedIn && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Si está logueado
  if (isLoggedIn) {
    // Si no tiene rol, redirigir a unauthorized
    if (!userRole) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Si puede acceder a la ruta, permitir
    if (canAccessRoute(userRole, pathname)) {
      return NextResponse.next();
    }

    // Si no puede acceder, redirigir a su dashboard por defecto
    return NextResponse.redirect(new URL(getDefaultRoute(userRole), req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
