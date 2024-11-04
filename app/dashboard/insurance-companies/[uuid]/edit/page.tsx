"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getData } from "../../../../lib/actions/insuranceCompanyActions";
import { useInsuranceCompanies } from "../../../../../src/hooks/useInsuranceCompanies";
import InsuranceCompanyForm from "@/components/Insurance-Company/InsuranceCompanyForm";
import { InsuranceCompanyData } from "../../../../types/insurance-company";
import {
  Typography,
  Box,
  Paper,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GeneralFormSkeleton from "@/components/skeletons/GeneralFormSkeleton";
import { withRoleProtection } from "@/components/withRoleProtection";
import { useSession } from "next-auth/react";
import { PERMISSIONS } from "../../../../../src/config/permissions";
import TypographyHeading from "../../../../components/TypographyHeading";
// Custom error component matching the claims pattern
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

function EditInsuranceCompanyPage() {
  const { uuid } = useParams();
  const router = useRouter();
  const [insuranceCompany, setInsuranceCompany] =
    useState<InsuranceCompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { updateInsuranceCompany } = useInsuranceCompanies(token);

  useEffect(() => {
    const fetchInsuranceCompany = async () => {
      try {
        const data = await getData(token, uuid as string);
        if (!data) {
          setError("Insurance company not found");
          return;
        }
        setInsuranceCompany(data);
      } catch (err) {
        setError("Failed to fetch insurance company");
      } finally {
        setLoading(false);
      }
    };

    if (token && uuid) {
      fetchInsuranceCompany();
    }
  }, [uuid, token]);

  const handleSubmit = async (data: InsuranceCompanyData) => {
    try {
      await updateInsuranceCompany(uuid as string, data);
      router.push("/dashboard/insurance-companies");
    } catch (error) {
      console.error("Error updating insurance company:", error);
    }
  };

  if (error) {
    return <ErrorComponent message={error} />;
  }

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
      <TypographyHeading> Edit Insurance Company</TypographyHeading>
      {insuranceCompany ? (
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <InsuranceCompanyForm
            initialData={insuranceCompany}
            onSubmit={handleSubmit}
          />
        </Paper>
      ) : (
        <Typography variant="h6" color="error">
          No insurance company found
        </Typography>
      )}
    </Box>
  );
}

// Protection configuration using the PERMISSIONS enum
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_COMPANIES],
};

export default withRoleProtection(EditInsuranceCompanyPage, protectionConfig);
