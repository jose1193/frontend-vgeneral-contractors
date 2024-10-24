// middleware.ts
import { NextResponse } from "next/server";
import { auth } from "./auth";
import { canAccessRoute, getDefaultRoute } from "./src/utils/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const userRole = req.auth?.user?.user_role;
  const pathname = req.nextUrl.pathname;

  if (isLoggedIn) {
    if (!userRole) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (pathname === "/") {
      return NextResponse.redirect(new URL(getDefaultRoute(userRole), req.url));
    }

    if (!canAccessRoute(userRole, pathname)) {
      return NextResponse.redirect(new URL(getDefaultRoute(userRole), req.url));
    }
  } else if (pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
