"use client";

import React, { Suspense } from "react";
import { useInsuranceCompanies } from "../../../../src/hooks/useInsuranceCompanies";
import InsuranceCompanyForm from "../../../../src/components/Insurance-Company/InsuranceCompanyForm";
import { Typography, Box, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { InsuranceCompanyData } from "../../../../app/types/insurance-company";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import TypographyHeading from "../../../components/TypographyHeading";
import { PERMISSIONS } from "../../../../src/config/permissions";
const CreateInsuranceCompanyPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const token = session?.accessToken as string;
  const { createInsuranceCompany } = useInsuranceCompanies(token);

  const handleSubmit = async (data: InsuranceCompanyData) => {
    await createInsuranceCompany(data);
    console.log("Insurance Company data to submit:", data);
    router.push("/dashboard/insurance-companies");
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
        <TypographyHeading> Create Insurance Company</TypographyHeading>
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <InsuranceCompanyForm onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_COMPANIES],
};

export default withRoleProtection(CreateInsuranceCompanyPage, protectionConfig);
