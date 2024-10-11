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
          ml: -7,
          mb: 10,
          mt: -2,
          p: { xs: 3, sm: 3, md: 2, lg: 4 },
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
          component="h1"
          gutterBottom
          sx={{
            mb: 5,
            fontSize: {
              xs: "1.5rem",
              sm: "1.75rem",
              md: "2rem",
              lg: "2.25rem",
            },
            fontWeight: "bold",
          }}
        >
          Create Insurance Company
        </Typography>
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

export default withRoleProtection(CreateInsuranceCompanyPage, [
  "Super Admin",
  "Admin",
]);
