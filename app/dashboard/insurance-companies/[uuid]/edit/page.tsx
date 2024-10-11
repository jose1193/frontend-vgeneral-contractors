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
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GeneralFormSkeleton from "@/components/skeletons/GeneralFormSkeleton";
import { withRoleProtection } from "@/components/withRoleProtection";
import { useSession } from "next-auth/react";

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
        setInsuranceCompany(data);
      } catch (err) {
        setError("No insurance company found");
      } finally {
        setLoading(false);
      }
    };

    fetchInsuranceCompany();
  }, [uuid, token]);

  const handleSubmit = async (data: InsuranceCompanyData) => {
    await updateInsuranceCompany(uuid as string, data);
    router.push("/dashboard/insurance-companies");
  };

  if (loading) {
    return <GeneralFormSkeleton />;
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "hidden",
        ml: -7,
        mb: 10,
        p: { xs: 3, sm: 3, md: 2, lg: 4 },
        mt: -3,
      }}
    >
      <Button
        variant="outlined"
        onClick={() => window.history.back()}
        startIcon={<ArrowBackIcon />}
        style={{ marginBottom: "20px" }}
      >
        Back
      </Button>
      <Typography
        variant="h4"
        sx={{
          fontSize: {
            xs: "1.5rem",
            sm: "1.75rem",
            md: "2rem",
            lg: "2.25rem",
          },
          my: 3,
          fontWeight: "bold",
        }}
        component="h1"
        gutterBottom
      >
        Edit Insurance Company
      </Typography>
      {error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : insuranceCompany ? (
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

export default withRoleProtection(EditInsuranceCompanyPage, [
  "Super Admin",
  "Admin",
]);
