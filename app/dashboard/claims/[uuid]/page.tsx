"use client";

import React, { Suspense } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ClaimDetails from "../../../../src/components/Claims/ClaimDetails";
import InvoiceTable from "../../../../src/components/Claims/InvoiceTable";
import ClaimTabs from "../../../../src/components/Claims/ClaimTabs";
import { useClaimProfile } from "../../../../src/hooks/useClaimProfile";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import { PERMISSIONS } from "../../../../src/config/permissions";

const ClaimProfile: React.FC = () => {
  const { uuid } = useParams();
  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const {
    claim,
    loading,
    error,
    createClaimAgreement,
    updateClaimAgreement,
    deleteClaimAgreement,
    claimAgreements,
  } = useClaimProfile(uuid as string, token);

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!token) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error: Authentication token is missing
        </Typography>
      </Box>
    );
  }

  return (
    <Suspense>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          mb: 10,
          p: { xs: 1, lg: 2 },
        }}
      >
        <ClaimDetails claim={claim} token={token} />
        <ClaimTabs
          claim={claim}
          claimAgreements={claimAgreements}
          onCreateAgreement={createClaimAgreement}
          onUpdateAgreement={updateClaimAgreement}
          onDeleteAgreement={deleteClaimAgreement}
        />
        <InvoiceTable claim={claim} />
      </Box>
    </Suspense>
  );
};

// Permission-based protection configuration
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CLAIMS],
};

export default withRoleProtection(ClaimProfile, protectionConfig);
