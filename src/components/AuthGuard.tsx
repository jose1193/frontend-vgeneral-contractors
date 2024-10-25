// src/components/AuthGuard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { CircularProgress, Box } from "@mui/material";
import { isPublicRoute, getDefaultRoute, canAccessRoute } from "../utils/auth";

const AUTH_CONFIG = {
  loginRoute: "/",
  errorRoute: "/error",
};

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const handleNavigation = async () => {
      if (status === "loading") return;

      try {
        const userRole = session?.user?.user_role;
        const isPublic = isPublicRoute(pathname);

        if (status === "authenticated" && userRole) {
          // Handle root dashboard route
          if (pathname === "/dashboard") {
            await router.replace(getDefaultRoute(userRole));
            return;
          }

          // Handle public routes when authenticated
          if (isPublic) {
            await router.replace(getDefaultRoute(userRole));
            return;
          }

          // Handle unauthorized access to role-specific routes
          if (!canAccessRoute(userRole, pathname)) {
            await router.replace(getDefaultRoute(userRole));
            return;
          }
        } else if (status === "unauthenticated" && !isPublic) {
          await router.replace(AUTH_CONFIG.loginRoute);
          return;
        }
      } catch (error) {
        console.error("Navigation error:", error);
        await router.replace(AUTH_CONFIG.errorRoute);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    handleNavigation();

    return () => {
      isMounted = false;
    };
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
