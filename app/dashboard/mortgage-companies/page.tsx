"use client";

import React, { Suspense } from "react";
import { useMortgageCompanies } from "../../../src/hooks/useMortgageCompanies";
import MortgageCompanyList from "../../../src/components/Mortgage-Company/MortgageCompanyList";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ButtonCreate from "../../components/ButtonCreate";
import { withRoleProtection } from "../../../src/components/withRoleProtection";
import TypographyHeading from "../../components/TypographyHeading";
import { PERMISSIONS } from "../../../src/config/permissions";

const MortgageCompaniesPage = () => {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const userRole = session?.user?.user_role;
  const { mortgageCompanies, deleteMortgageCompany } =
    useMortgageCompanies(token);

  return (
    <Suspense>
      <TypographyHeading>Mortgage Companies</TypographyHeading>
      <Box>
        <Link href="/dashboard/mortgage-companies/create" passHref>
          <ButtonCreate>Create Mortgage Company</ButtonCreate>
        </Link>

        <MortgageCompanyList
          mortgageCompanies={mortgageCompanies}
          onDelete={deleteMortgageCompany}
          userRole={userRole}
        />
      </Box>
    </Suspense>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_COMPANIES],
};

export default withRoleProtection(MortgageCompaniesPage, protectionConfig);
