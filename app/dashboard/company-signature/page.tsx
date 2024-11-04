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
import TypographyHeading from "../../components/TypographyHeading";
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

          overflow: "hidden",
        }}
      >
        <TypographyHeading>Company Signature</TypographyHeading>

        <Link href="/dashboard/company-signature/create" passHref>
          <ButtonCreate>Create Company Signature</ButtonCreate>
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
