//RoleGuard.tsx
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const ROLE_ROUTES = {
  "Super Admin": "/dashboard/super-admin",
  Admin: "/dashboard/admin",
  Manager: "/dashboard/manager",
  Lead: "/dashboard/lead",
  "Technical Services": "/dashboard/technical-services",
};

type RoleGuardProps = {
  children: ReactNode;
  allowedRoles: string[];
};

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      const userRole = session?.user?.user_role;
      if (userRole && allowedRoles.includes(userRole)) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        const defaultRoute =
          ROLE_ROUTES[userRole as keyof typeof ROLE_ROUTES] || "/dashboard";
        router.replace(defaultRoute);
      }
    } else if (status === "unauthenticated") {
      setIsAuthorized(false);
      router.replace("/login");
    }
  }, [status, session, allowedRoles, router]);

  if (status === "loading" || isAuthorized === null) {
    return null; // O un componente de carga si lo prefieres
  }

  return isAuthorized ? <>{children}</> : null;
}
