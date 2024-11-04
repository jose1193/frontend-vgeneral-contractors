"use client";

import React, { Suspense } from "react";
import { useClaims } from "../../../src/hooks/useClaims";
import ClaimsList from "../../../src/components/Claims/ClaimsList";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../src/components/withRoleProtection";
import UserInfo from "@/components/UserInfo";
import ButtonCreate from "../../components/ButtonCreate";
import { PERMISSIONS } from "../../../src/config/permissions";
import TypographyHeading from "../../components/TypographyHeading";

const ClaimsPage = () => {
  const { data: session, update } = useSession();

  const token = session?.accessToken as string;
  const userRole = session?.user?.user_role;

  const { claims, loading, error, deleteClaim, restoreClaim } =
    useClaims(token);

  return (
    <Suspense>
      <Box>
        <Box sx={{ textAlign: "center" }}>
          <TypographyHeading>Claims</TypographyHeading>
        </Box>

        <Link href="/dashboard/claims/create" passHref>
          <ButtonCreate>Create Claim</ButtonCreate>
        </Link>
        <ClaimsList
          claims={claims}
          onDelete={deleteClaim}
          onRestore={restoreClaim}
        />
      </Box>
    </Suspense>
  );
};

// Configuración de protección simplificada basada solo en permisos
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CLAIMS],
};

export default withRoleProtection(ClaimsPage, protectionConfig);
