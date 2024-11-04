"use client";

import React, { Suspense } from "react";
import { useAllianceCompanies } from "../../../../src/hooks/useAllianceCompanies";
import AllianceCompanyForm from "../../../../src/components/Alliance-Company/AllianceCompanyForm";
import { Typography, Box, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { AllianceCompanyData } from "../../../../app/types/alliance-company";
import { useSession } from "next-auth/react";
import TypographyHeading from "../../../components/TypographyHeading";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";

import { PERMISSIONS } from "../../../../src/config/permissions";
const CreateAllianceCompanyPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const token = session?.accessToken as string;
  const { createAllianceCompany } = useAllianceCompanies(token);

  const handleSubmit = async (data: AllianceCompanyData) => {
    await createAllianceCompany(data);
    console.log("Alliance Company data to submit:", data);
    router.push("/dashboard/alliance-companies");
  };

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
        <TypographyHeading>Create Alliance Company</TypographyHeading>

        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <AllianceCompanyForm onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
};
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_COMPANIES],
};

export default withRoleProtection(CreateAllianceCompanyPage, protectionConfig);
