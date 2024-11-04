"use client";

import React, { Suspense } from "react";
import { useInsuranceCompanies } from "../../../src/hooks/useInsuranceCompanies";
import InsuranceCompanyList from "../../../src/components/Insurance-Company/InsuranceCompanyList";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ButtonCreate from "../../components/ButtonCreate";
import { withRoleProtection } from "../../../src/components/withRoleProtection";
import TypographyHeading from "../../components/TypographyHeading";
import { PERMISSIONS } from "../../../src/config/permissions";
const InsuranceCompaniesPage = () => {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const userRole = session?.user?.user_role;
  const { insuranceCompanies, deleteInsuranceCompany } =
    useInsuranceCompanies(token);

  return (
    <Suspense>
      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <TypographyHeading>Insurance Companies</TypographyHeading>
        <Link href="/dashboard/insurance-companies/create" passHref>
          <ButtonCreate>Create Insurance Company</ButtonCreate>
        </Link>

        <InsuranceCompanyList
          insuranceCompanies={insuranceCompanies}
          onDelete={deleteInsuranceCompany}
        />
      </Box>
    </Suspense>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_COMPANIES],
};

export default withRoleProtection(InsuranceCompaniesPage, protectionConfig);
