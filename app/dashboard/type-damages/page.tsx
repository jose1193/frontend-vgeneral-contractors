// src/app/type-damages/page.tsx

"use client";

import React, { Suspense } from "react";
import { useTypeDamages } from "../../../src/hooks/useTypeDamage";
//import { TypeDamagesForm } from "../../../src/components/Type-Damages/TypeDamagesForm";
import TypeDamagesList from "../../../src/components/Type-Damages/TypeDamagesList";
import { Button, Box, Typography } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../src/components/withRoleProtection";
import ButtonCreate from "../../components/ButtonCreate";

import TypographyHeading from "../../components/TypographyHeading";
import { PERMISSIONS } from "../../../src/config/permissions";
const TypeDamagesPage = () => {
  const { data: session, update } = useSession();

  const token = session?.accessToken as string;
  const { typeDamages, loading, error, deleteTypeDamage } =
    useTypeDamages(token);

  if (error) return <div>Error: {error}</div>;

  return (
    <Suspense>
      <Box
        sx={{
          width: "100%",

          overflow: "hidden",
        }}
      >
        <TypographyHeading>Type Damages</TypographyHeading>

        <Link href="/dashboard/type-damages/create" passHref>
          <ButtonCreate sx={{ ml: 4 }}>Create Type Damage</ButtonCreate>
        </Link>
        <TypeDamagesList
          typeDamages={typeDamages}
          onDelete={deleteTypeDamage}
        />
      </Box>
    </Suspense>
  );
};
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

// Single export default with protection
export default withRoleProtection(TypeDamagesPage, protectionConfig);
