// src/components/AuthGuard.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { CircularProgress, Box } from "@mui/material";
import {
  PUBLIC_ROUTES,
  ROLE_ROUTES,
  DEFAULT_AUTH_ROUTE,
  ROLE_PERMISSIONS,
} from "../config/roles";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (status === "loading") return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const userRole = session?.user?.user_role as
      | keyof typeof ROLE_ROUTES
      | undefined;

    const handleNavigation = async () => {
      if (status === "authenticated") {
        if (userRole) {
          const roleRoute = ROLE_ROUTES[userRole] || DEFAULT_AUTH_ROUTE;
          const allowedRoutes = ROLE_PERMISSIONS[userRole];

          if (isPublicRoute) {
            await router.push(roleRoute);
          } else if (!isAuthorized(pathname, allowedRoutes)) {
            await router.push(roleRoute);
          }
        } else {
          console.error("User is authenticated but has no role");
          await router.push("/error");
        }
      } else if (status === "unauthenticated" && !isPublicRoute) {
        await router.push("/");
      }
      setIsLoading(false);
    };

    handleNavigation();
  }, [status, pathname, router, session]);

  if (isLoading || status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}

function isAuthorized(pathname: string, allowedRoutes: string[]): boolean {
  if (allowedRoutes.includes("*")) return true;
  return allowedRoutes.some((route) => pathname.startsWith(route));
}
