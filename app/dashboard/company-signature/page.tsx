"use client";

import React, { Suspense } from "react";
import { useCompanySignatures } from "../../../src/hooks/useCompanySignature";
import CompanySignaturesList from "../../../src/components/Company-Signature/CompanySignaturesList";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../src/components/withRoleProtection";
import ButtonCreate from "../../components/ButtonCreate";
import { PERMISSIONS } from "../../../src/config/permissions";

const CompanySignaturesPage = () => {
  const { data: session } = useSession();

  const token = session?.accessToken as string;
  const userRole = session?.user?.user_role;

  const { companySignatures, deleteCompanySignature } =
    useCompanySignatures(token);

  return (
    <Suspense>
      <Box
        sx={{
          width: "100%",
          ml: -6,
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            textAlign: "left",
            mb: 3,
            fontSize: {
              xs: "1.5rem",
              sm: "1.75rem",
              md: "2rem",
              lg: "2.25rem",
            },
            fontWeight: "bold",
            ml: 4,
          }}
        >
          Company Signature
        </Typography>

        <Link href="/dashboard/company-signature/create" passHref>
          <ButtonCreate sx={{ ml: 4 }}>Create Company Signature</ButtonCreate>
        </Link>

        <CompanySignaturesList
          companySignatures={companySignatures}
          onDelete={deleteCompanySignature}
        />
      </Box>
    </Suspense>
  );
};

// Configuración de protección basada en permisos
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

export default withRoleProtection(CompanySignaturesPage, protectionConfig);
