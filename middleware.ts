import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isOnLoginPage = req.nextUrl.pathname === "/";

  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isOnLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
