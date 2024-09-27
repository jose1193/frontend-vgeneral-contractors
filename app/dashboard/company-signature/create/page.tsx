// src/app/company-signatures/create/page.tsx
"use client";

import React, { Suspense } from "react";
import { useCompanySignatures } from "../../../../src/hooks/useCompanySignature";
import CompanySignatureForm from "../../../../src/components/Company-Signature/CompanySignatureForm";
import { Typography, Box, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { CompanySignatureData } from "../../../../app/types/company-signature";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";

const CreateCompanySignaturePage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const token = session?.accessToken as string;
  const { createCompanySignature } = useCompanySignatures(token);

  const handleSubmit = async (data: CompanySignatureData) => {
    await createCompanySignature(data);
    console.log("Company Signature data to submit:", data);
    router.push("/dashboard/company-signature");
  };

  return (
    <Suspense>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          ml: -7,
          mb: 10,
          p: { xs: 3, sm: 3, md: 2, lg: 4 },
        }}
      >
        <Button
          variant="outlined"
          onClick={() => window.history.back()} // O manejarlo con una ruta específica
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
          }}
        >
          Create Company Signature
        </Typography>
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <CompanySignatureForm onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
};

export default withRoleProtection(CreateCompanySignaturePage, ["Super Admin"]);
