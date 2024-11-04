// src/app/claims/[uuid]/edit/page.tsx
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { getData } from "../../../../lib/actions/claimsActions";
import { useClaims } from "../../../../../src/hooks/useClaims";
import ClaimsForm from "../../../../../src/components/Claims/ClaimsForm";
import { ClaimsData } from "../../../../types/claims";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { withRoleProtection } from "../../../../../src/components/withRoleProtection";
import { useSession } from "next-auth/react";
import ClaimsFormSkeleton from "../../../../../src/components/skeletons/ClaimsFormSkeleton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { PERMISSIONS } from "../../../../../src/config/permissions";
import Forbidden from "../../../../../src/components/Forbidden";
import TypographyHeading from "../../../../components/TypographyHeading";
// Componente de error personalizado
const ErrorComponent = ({ message }: { message: string }) => (
  <Box sx={{ p: 3 }}>
    <Alert severity="error" sx={{ mb: 2 }}>
      {message}
    </Alert>
    <Button
      variant="contained"
      onClick={() => window.history.back()}
      startIcon={<ArrowBackIcon />}
    >
      Go Back
    </Button>
  </Box>
);

const EditClaimPage = () => {
  const { uuid } = useParams();
  const router = useRouter();
  const [claim, setClaim] = useState<ClaimsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { updateClaim } = useClaims(token);

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const data = await getData(token, uuid as string);
        if (!data) {
          setError("Claim not found");
          return;
        }
        setClaim(data);
      } catch (err) {
        setError("Failed to fetch claim");
      } finally {
        setLoading(false);
      }
    };

    if (token && uuid) {
      fetchClaim();
    }
  }, [uuid, token]);

  const handleSubmit = async (
    data: ClaimsData
  ): Promise<string | undefined> => {
    try {
      await updateClaim(uuid as string, data);
      router.push(`/dashboard/claims/${uuid}`);
      return uuid as string;
    } catch (error) {
      console.error("Error updating claim:", error);
      return undefined;
    }
  };

  if (error) {
    return <ErrorComponent message={error} />;
  }

  if (!claim || loading) {
    return <ClaimsFormSkeleton />;
  }

  return (
    <Suspense fallback={<ClaimsFormSkeleton />}>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",

          mb: 10,
          p: { xs: 1, lg: 2 },
        }}
      >
        <TypographyHeading> Edit Claim</TypographyHeading>

        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <ClaimsForm initialData={claim} onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
};

// Configuración de protección con componente de fallback personalizado
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CLAIMS],
};

export default withRoleProtection(EditClaimPage, protectionConfig);
