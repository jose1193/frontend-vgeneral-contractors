// src/app/claims/create/page.tsx

"use client";

import React, { Suspense } from "react";
import { useClaims } from "../../../../src/hooks/useClaims";
import ClaimsForm from "../../../../src/components/Claims/ClaimsForm";
import ClaimsWizard from "../../../../src/components/Claims/ClaimsWizard";
import { Typography, Box, Paper, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { ClaimsData } from "../../../../app/types/claims";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TypographyHeading from "../../../components/TypographyHeading";
const CreateClaimPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const token = session?.accessToken as string;
  const { createClaim } = useClaims(token);

  const handleSubmit = async (
    data: ClaimsData
  ): Promise<string | undefined> => {
    try {
      const uuid = await createClaim(data);
      console.log("Claim created with UUID:", uuid);
      if (uuid) {
        router.push(`/dashboard/claims/${uuid}`);
      }
      return uuid;
    } catch (error) {
      console.error("Error creating claim:", error);
      return undefined;
    }
  };

  return (
    <Suspense>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          ml: -7,
          mt: -2,
          mb: 10,
          p: { xs: 3, sm: 3, md: 2, lg: 4 },
        }}
      >
        <TypographyHeading>Create Claim</TypographyHeading>
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <ClaimsWizard onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
};
export default withRoleProtection(CreateClaimPage, [
  "Super Admin",
  "Admin",
  "Manager",
  "Salesperson",
]);
