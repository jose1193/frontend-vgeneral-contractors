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
import { PERMISSIONS } from "../../../../src/config/permissions";
import TypographyHeading from "../../../components/TypographyHeading";

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

          mb: 10,
          p: { xs: 1, lg: 2 },
        }}
      >
        <TypographyHeading> Create Company Signature</TypographyHeading>

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

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

export default withRoleProtection(CreateCompanySignaturePage, protectionConfig);
