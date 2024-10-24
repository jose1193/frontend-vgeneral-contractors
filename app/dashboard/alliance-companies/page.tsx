"use client";

import React, { Suspense } from "react";
import { useAllianceCompanies } from "../../../src/hooks/useAllianceCompanies";
import AllianceCompanyList from "../../../src/components/Alliance-Company/AllianceCompanyList";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ButtonCreate from "../../components/ButtonCreate";
import { withRoleProtection } from "../../../src/components/withRoleProtection";
import TypographyHeading from "../../components/TypographyHeading";
import { PERMISSIONS } from "../../../src/config/permissions";
const AllianceCompaniesPage = () => {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const userRole = session?.user?.user_role;
  const { allianceCompanies, deleteAllianceCompany } =
    useAllianceCompanies(token);

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
          Alliance Companies
        </Typography>

        <Link href="/dashboard/alliance-companies/create" passHref>
          <ButtonCreate sx={{ ml: 4 }}>Create Alliance Company</ButtonCreate>
        </Link>

        <AllianceCompanyList
          allianceCompanies={allianceCompanies}
          onDelete={deleteAllianceCompany}
          userRole={userRole}
        />
      </Box>
    </Suspense>
  );
};
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_COMPANIES],
};

export default withRoleProtection(AllianceCompaniesPage, protectionConfig);
