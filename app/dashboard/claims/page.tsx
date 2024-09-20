// src/app/claims/page.tsx

"use client";

import React, { Suspense } from "react";
import { useClaims } from "../../../src/hooks/useClaims";
//import { TypeDamagesForm } from "../../../src/components/Type-Damages/TypeDamagesForm";
import ClaimsList from "../../../src/components/Claims/ClaimsList";
import { Button, Box, Typography } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../src/components/withRoleProtection";

const ClaimsPage = () => {
  const { data: session, update } = useSession();

  const token = session?.accessToken as string;
  const { claims, loading, error, deleteClaim, restoreClaim } =
    useClaims(token);

  if (error) return <div>Error: {error}</div>;

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
          <Button
            variant="contained"
            color="primary"
            sx={{
              ml: 4,
            }}
          >
            Create Claim
          </Button>
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
export default withRoleProtection(ClaimsPage, [
  "Super Admin",
  "Admin",
  "Manager",
  "Lead",
]);
