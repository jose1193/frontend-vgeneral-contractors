"use client";

import React, { Suspense } from "react";
import { usePublicCompanies } from "../../../../src/hooks/usePublicCompanies";
import PublicCompanyForm from "../../../../src/components/Public-Company/PublicCompanyForm";
import { Typography, Box, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { PublicCompanyData } from "../../../../app/types/public-company";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import TypographyHeading from "../../../components/TypographyHeading";
import { PERMISSIONS } from "../../../../src/config/permissions";
const CreatePublicCompanyPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const token = session?.accessToken as string;
  const { createPublicCompany } = usePublicCompanies(token);

  const handleSubmit = async (data: PublicCompanyData) => {
    await createPublicCompany(data);
    console.log("Public Company data to submit:", data);
    router.push("/dashboard/public-companies");
  };

  return (
    <Suspense>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",

          mb: 10,
          mt: -2,
          p: { xs: 3, sm: 3, md: 2, lg: 4 },
        }}
      >
        <TypographyHeading>Create Public Company</TypographyHeading>

        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <PublicCompanyForm onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_COMPANIES],
};

export default withRoleProtection(CreatePublicCompanyPage, protectionConfig);
