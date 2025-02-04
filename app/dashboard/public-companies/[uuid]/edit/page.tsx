"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getData } from "../../../../lib/actions/publicCompanyActions";
import { usePublicCompanies } from "../../../../../src/hooks/usePublicCompanies";
import PublicCompanyForm from "@/components/Public-Company/PublicCompanyForm";
import { PublicCompanyData } from "../../../../types/public-company";
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
import { withRoleProtection } from "../../../../../src/components/withRoleProtection";
import TypographyHeading from "../../../../components/TypographyHeading";
import { PERMISSIONS } from "../../../../../src/config/permissions";
function EditPublicCompanyPage() {
  const { uuid } = useParams();
  const router = useRouter();
  const [publicCompany, setPublicCompany] = useState<PublicCompanyData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { updatePublicCompany } = usePublicCompanies(token);

  useEffect(() => {
    const fetchPublicCompany = async () => {
      try {
        const data = await getData(token, uuid as string);
        setPublicCompany(data);
      } catch (err) {
        setError("No public company found");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicCompany();
  }, [uuid, token]);

  const handleSubmit = async (data: PublicCompanyData) => {
    await updatePublicCompany(uuid as string, data);
    router.push("/dashboard/public-companies");
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
        mt: -3,
      }}
    >
      <TypographyHeading> Edit Public Company</TypographyHeading>

      {error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : publicCompany ? (
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <PublicCompanyForm
            initialData={publicCompany}
            onSubmit={handleSubmit}
          />
        </Paper>
      ) : (
        <Typography variant="h6" color="error">
          No public company found
        </Typography>
      )}
    </Box>
  );
}

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_COMPANIES],
};

export default withRoleProtection(EditPublicCompanyPage, protectionConfig);
