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

const ClaimsPage = () => {
  const { data: session, update } = useSession();

  const token = session?.accessToken as string;
  const userRole = session?.user?.user_role;

  const { claims, loading, error, deleteClaim, restoreClaim } =
    useClaims(token);

  return (
    <Suspense>
      <Box
        sx={{
          width: "100%",
          ml: -6,
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            textAlign: "left",
            mb: 3,
            fontSize: {
              xs: "1.5rem",
              sm: "1.75rem",
              md: "2rem",
              lg: "2.25rem",
            },
            fontWeight: "bold",
            ml: 4,
          }}
        >
          Claims
        </Typography>

        <Link href="/dashboard/claims/create" passHref>
          <ButtonCreate sx={{ ml: 4 }}>Create Claim</ButtonCreate>
        </Link>
        <ClaimsList
          claims={claims}
          onDelete={deleteClaim}
          onRestore={restoreClaim}
          userRole={userRole}
        />
      </Box>
    </Suspense>
  );
};

// Configuración de protección para la página de Claims
const protectionConfig = {
  roles: ["Super Admin", "Admin", "Manager", "Salesperson"],
  permissions: [PERMISSIONS.MANAGE_CLAIMS],
  paths: ["/dashboard/claims"],
};

export default withRoleProtection(ClaimsPage, protectionConfig);
