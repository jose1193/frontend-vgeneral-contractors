"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getData } from "../../../../lib/actions/companySignatureActions";
import { useCompanySignatures } from "@/hooks/useCompanySignature";
import CompanySignatureForm from "@/components/Company-Signature/CompanySignatureForm";
import { CompanySignatureData } from "../../../../types/company-signature";
import TypographyHeading from "../../../../components/TypographyHeading";
import {
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GeneralFormSkeleton from "@/components/skeletons/GeneralFormSkeleton";
import { withRoleProtection } from "@/components/withRoleProtection";
import { useSession } from "next-auth/react";
import { PERMISSIONS } from "@/config/permissions";

function EditCompanySignaturePage() {
  const { uuid } = useParams();
  const router = useRouter();
  const [companySignature, setCompanySignature] =
    useState<CompanySignatureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { updateCompanySignature } = useCompanySignatures(token);

  useEffect(() => {
    const fetchCompanySignature = async () => {
      try {
        const data = await getData(token, uuid as string);
        setCompanySignature(data);
      } catch (err) {
        setError("No company signature found");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanySignature();
  }, [uuid, token]);

  const handleSubmit = async (data: CompanySignatureData) => {
    try {
      await updateCompanySignature(uuid as string, data);
      router.push("/dashboard/company-signature");
    } catch (error) {
      console.error("Error updating company signature:", error);
      setError("Failed to update company signature");
    }
  };

  if (loading) {
    return <GeneralFormSkeleton />;
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "hidden",

        mb: 10,
        p: { xs: 1, lg: 2 },
      }}
    >
      <TypographyHeading> Edit Company Signature</TypographyHeading>

      {error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : companySignature ? (
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <CompanySignatureForm
            initialData={companySignature}
            onSubmit={handleSubmit}
          />
        </Paper>
      ) : (
        <Typography variant="h6" color="error">
          No company signature found
        </Typography>
      )}
    </Box>
  );
}

// Configuración de protección basada en permisos
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

export default withRoleProtection(EditCompanySignaturePage, protectionConfig);
