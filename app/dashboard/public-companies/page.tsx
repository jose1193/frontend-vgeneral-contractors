"use client";

import React, { Suspense } from "react";
import { usePublicCompanies } from "../../../src/hooks/usePublicCompanies";
import PublicCompanyList from "../../../src/components/Public-Company/PublicCompanyList";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ButtonCreate from "../../components/ButtonCreate";

const PublicCompaniesPage = () => {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const userRole = session?.user?.user_role;
  const { publicCompanies, deletePublicCompany } = usePublicCompanies(token);

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
          Public Companies
        </Typography>

        <Link href="/dashboard/public-companies/create" passHref>
          <ButtonCreate sx={{ ml: 4 }}>Create Public Company</ButtonCreate>
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

export default PublicCompaniesPage;
