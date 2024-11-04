"use client";

import React, { Suspense } from "react";
import { usePublicCompanies } from "../../../src/hooks/usePublicCompanies";
import PublicCompanyList from "../../../src/components/Public-Company/PublicCompanyList";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ButtonCreate from "../../components/ButtonCreate";
import { withRoleProtection } from "../../../src/components/withRoleProtection";
import TypographyHeading from "../../components/TypographyHeading";
import { PERMISSIONS } from "../../../src/config/permissions";

const PublicCompaniesPage = () => {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const userRole = session?.user?.user_role;
  const { publicCompanies, deletePublicCompany } = usePublicCompanies(token);

  return (
    <Suspense>
      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <TypographyHeading>Public Companies</TypographyHeading>

        <Link href="/dashboard/public-companies/create" passHref>
          <ButtonCreate>Create Public Company</ButtonCreate>
        </Link>

        <PublicCompanyList
          publicCompanies={publicCompanies}
          onDelete={deletePublicCompany}
          userRole={userRole}
        />
      </Box>
    </Suspense>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_COMPANIES],
};

export default withRoleProtection(PublicCompaniesPage, protectionConfig);
