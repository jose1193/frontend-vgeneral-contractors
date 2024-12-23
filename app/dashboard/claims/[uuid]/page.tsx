"use client";

import React, { Suspense } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import { Home, ArrowBack } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DescriptionIcon from "@mui/icons-material/Description";
import ShareIcon from "@mui/icons-material/Share";
import ClaimDetails from "../../../../src/components/Claims/ClaimDetails";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import InvoiceTable from "../../../../src/components/Claims/InvoiceTable";
import ClaimHeader from "../../../../src/components/Claims/ClaimHeader";
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
        <ClaimHeader claim={claim} />
        <ClaimDetails claim={claim} />
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

// Configuración de protección basada en permisos
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CLAIMS],
};

export default withRoleProtection(ClaimProfile, protectionConfig);
