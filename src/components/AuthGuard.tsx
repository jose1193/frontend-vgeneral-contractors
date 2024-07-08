// src/components/AuthGuard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

import { CircularProgress, Box } from "@mui/material";

const PUBLIC_ROUTES = ["/", "/login", "/register"]; // Añade aquí todas las rutas públicas
const DEFAULT_AUTH_ROUTE = "/dashboard";
const DEFAULT_UNAUTH_ROUTE = "/";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (status === "loading") return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (status === "authenticated" && isPublicRoute) {
      router.push(DEFAULT_AUTH_ROUTE);
    } else if (status === "unauthenticated" && !isPublicRoute) {
      router.push(DEFAULT_UNAUTH_ROUTE);
    } else {
      setIsLoading(false);
    }
  }, [status, pathname, router]);

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
