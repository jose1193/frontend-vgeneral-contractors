"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getData } from "../../../../lib/actions/allianceCompanyActions";
import { useAllianceCompanies } from "../../../../../src/hooks/useAllianceCompanies";
import AllianceCompanyForm from "@/components/Alliance-Company/AllianceCompanyForm";
import { AllianceCompanyData } from "../../../../types/alliance-company";
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

function EditAllianceCompanyPage() {
  const { uuid } = useParams();
  const router = useRouter();
  const [allianceCompany, setAllianceCompany] =
    useState<AllianceCompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { updateAllianceCompany } = useAllianceCompanies(token);

  useEffect(() => {
    const fetchAllianceCompany = async () => {
      try {
        const data = await getData(token, uuid as string);
        setAllianceCompany(data);
      } catch (err) {
        setError("No alliance company found");
      } finally {
        setLoading(false);
      }
    };

    fetchAllianceCompany();
  }, [uuid, token]);

  const handleSubmit = async (data: AllianceCompanyData) => {
    await updateAllianceCompany(uuid as string, data);
    router.push("/dashboard/alliance-companies");
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
        Edit Alliance Company
      </Typography>
      {error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : allianceCompany ? (
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <AllianceCompanyForm
            initialData={allianceCompany}
            onSubmit={handleSubmit}
          />
        </Paper>
      ) : (
        <Typography variant="h6" color="error">
          No alliance company found
        </Typography>
      )}
    </Box>
  );
}
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_COMPANIES],
};

export default withRoleProtection(EditAllianceCompanyPage, protectionConfig);