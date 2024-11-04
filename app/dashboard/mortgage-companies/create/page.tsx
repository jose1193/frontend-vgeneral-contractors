"use client";

import React, { Suspense } from "react";
import { useMortgageCompanies } from "../../../../src/hooks/useMortgageCompanies";
import MortgageCompanyForm from "../../../../src/components/Mortgage-Company/MortgageCompanyForm";
import { Typography, Box, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { MortgageCompanyData } from "../../../../app/types/mortgage-company";
import { useSession } from "next-auth/react";
import TypographyHeading from "../../../components/TypographyHeading";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import { PERMISSIONS } from "../../../../src/config/permissions";

const CreateMortgageCompanyPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const token = session?.accessToken as string;
  const { createMortgageCompany } = useMortgageCompanies(token);

  const handleSubmit = async (data: MortgageCompanyData) => {
    await createMortgageCompany(data);
    console.log("Mortgage Company data to submit:", data);
    router.push("/dashboard/mortgage-companies");
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
        <TypographyHeading>Create Mortgage Company</TypographyHeading>

        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <MortgageCompanyForm onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_COMPANIES],
};

export default withRoleProtection(CreateMortgageCompanyPage, protectionConfig);
