// src/components/AuthGuard.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { CircularProgress, Box } from "@mui/material";
import { AUTH_CONFIG } from "../config/auth";
import { isPublicRoute, canAccessRoute } from "../utils/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const handleNavigation = async () => {
      // Ignorar si está cargando
      if (status === "loading") return;

      try {
        const userRole = session?.user?.user_role;
        const isPublic = isPublicRoute(pathname);

        // Usuario autenticado
        if (status === "authenticated") {
          if (!userRole) {
            // Usuario autenticado pero sin rol
            console.error("Usuario autenticado sin rol");
            await router.push(AUTH_CONFIG.errorRoute);
          } else if (isPublic) {
            // Usuario autenticado en ruta pública
            await router.push(AUTH_CONFIG.defaultAuthRoute);
          } else if (!canAccessRoute(userRole, pathname)) {
            // Usuario sin acceso a la ruta
            await router.push(AUTH_CONFIG.defaultAuthRoute);
          }
        }
        // Usuario no autenticado
        else if (status === "unauthenticated" && !isPublic) {
          // Redirigir a login si intenta acceder a ruta protegida
          await router.push(AUTH_CONFIG.loginRoute);
        }
      } catch (error) {
        console.error("Error en la navegación:", error);
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

  // Mostrar loading mientras se verifica la autenticación
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

  // Renderizar children si todo está correcto
  return <>{children}</>;
}
