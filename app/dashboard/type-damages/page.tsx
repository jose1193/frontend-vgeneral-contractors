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
          Type Damages
        </Typography>

        <Link href="/dashboard/type-damages/create" passHref>
          <Button
            variant="contained"
            color="primary"
            sx={{
              ml: 4,
            }}
          >
            Create Type Damage
          </Button>
        </Link>
        <TypeDamagesList
          typeDamages={typeDamages}
          onDelete={deleteTypeDamage}
        />
      </Box>
    </Suspense>
  );
};
export default withRoleProtection(TypeDamagesPage, ["Super Admin"]);
