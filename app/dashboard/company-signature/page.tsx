"use client";

import React, { Suspense } from "react";
import { useCompanySignatures } from "../../../src/hooks/useCompanySignature";
import CompanySignaturesList from "../../../src/components/Company-Signature/CompanySignaturesList";
import { Button, Box, Typography, CircularProgress } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../src/components/withRoleProtection";

const CompanySignaturesPage = () => {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { companySignatures, deleteCompanySignature } =
    useCompanySignatures(token);

  return (
    <Suspense>
      <Box sx={{ width: "100%", ml: -6, overflow: "hidden" }}>
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
          <Button variant="contained" color="primary" sx={{ ml: 4 }}>
            Create Company Signature
          </Button>
        </Link>

        <CompanySignaturesList
          companySignatures={companySignatures}
          onDelete={deleteCompanySignature}
        />
      </Box>
    </Suspense>
  );
};

export default withRoleProtection(CompanySignaturesPage, ["Super Admin"]);
