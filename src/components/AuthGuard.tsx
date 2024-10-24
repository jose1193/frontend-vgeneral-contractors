// src/components/AuthGuard.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { CircularProgress, Box } from "@mui/material";
import { isPublicRoute, getDefaultRoute, getRoleBasePath } from "../utils/auth";

const AUTH_CONFIG = {
  loginRoute: "/login",
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
          const roleBasePath = getRoleBasePath(userRole);

          if (isPublic || pathname === "/dashboard") {
            // Redirect to role-specific dashboard
            await router.push(getDefaultRoute(userRole));
          } else if (!pathname.startsWith(roleBasePath)) {
            // If trying to access another role's dashboard, redirect to their own
            await router.push(getDefaultRoute(userRole));
          }
        } else if (status === "unauthenticated" && !isPublic) {
          await router.push(AUTH_CONFIG.loginRoute);
        }
      } catch (error) {
        console.error("Navigation error:", error);
        await router.push(AUTH_CONFIG.errorRoute);
      }

      if (isMounted) {
        setIsLoading(false);
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
