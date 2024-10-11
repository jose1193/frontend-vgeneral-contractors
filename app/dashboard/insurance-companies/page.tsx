"use client";

import React, { Suspense } from "react";
import { useInsuranceCompanies } from "../../../src/hooks/useInsuranceCompanies";
import InsuranceCompanyList from "../../../src/components/Insurance-Company/InsuranceCompanyList";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ButtonCreate from "../../components/ButtonCreate";

const InsuranceCompaniesPage = () => {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const userRole = session?.user?.user_role;
  const { insuranceCompanies, deleteInsuranceCompany } =
    useInsuranceCompanies(token);

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
          Insurance Companies
        </Typography>

        <Link href="/dashboard/insurance-companies/create" passHref>
          <ButtonCreate sx={{ ml: 4 }}>Create Insurance Company</ButtonCreate>
        </Link>

        <InsuranceCompanyList
          insuranceCompanies={insuranceCompanies}
          onDelete={deleteInsuranceCompany}
          userRole={userRole}
        />
      </Box>
    </Suspense>
  );
};

export default InsuranceCompaniesPage;
