"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getData } from "../../../../lib/actions/mortgageCompanyActions";
import { useMortgageCompanies } from "../../../../../src/hooks/useMortgageCompanies";
import MortgageCompanyForm from "@/components/Mortgage-Company/MortgageCompanyForm";
import { MortgageCompanyData } from "../../../../types/mortgage-company";
import { withRoleProtection } from "../../../../../src/components/withRoleProtection";
import TypographyHeading from "../../../../components/TypographyHeading";
import { PERMISSIONS } from "../../../../../src/config/permissions";
import {
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GeneralFormSkeleton from "@/components/skeletons/GeneralFormSkeleton";
import { useSession } from "next-auth/react";

function EditMortgageCompanyPage() {
  const { uuid } = useParams();
  const router = useRouter();
  const [mortgageCompany, setMortgageCompany] =
    useState<MortgageCompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { updateMortgageCompany } = useMortgageCompanies(token);

  useEffect(() => {
    const fetchMortgageCompany = async () => {
      try {
        const data = await getData(token, uuid as string);
        setMortgageCompany(data);
      } catch (err) {
        setError("No mortgage company found");
      } finally {
        setLoading(false);
      }
    };

    fetchMortgageCompany();
  }, [uuid, token]);

  const handleSubmit = async (data: MortgageCompanyData) => {
    await updateMortgageCompany(uuid as string, data);
    router.push("/dashboard/mortgage-companies");
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
      <TypographyHeading> Edit Mortgage Company</TypographyHeading>
      {error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : mortgageCompany ? (
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <MortgageCompanyForm
            initialData={mortgageCompany}
            onSubmit={handleSubmit}
          />
        </Paper>
      ) : (
        <Typography variant="h6" color="error">
          No mortgage company found
        </Typography>
      )}
    </Box>
  );
}

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_COMPANIES],
};

export default withRoleProtection(EditMortgageCompanyPage, protectionConfig);
