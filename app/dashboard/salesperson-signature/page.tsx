"use client";

import React, { Suspense } from "react";
import { useSalespersonSignatures } from "../../../src/hooks/useSalespersonSignatures";
import SalesPersonSignatureList from "../../../src/components/Salesperson-Signature/SalesPersonSignatureList";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ButtonCreate from "../../components/ButtonCreate";
import TypographyHeading from "../../../app/components/TypographyHeading";
const SalesPersonSignaturePage = () => {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const userRole = session?.user?.user_role;

  const {
    salespersonSignatures,
    deleteSalespersonSignature,
    updateSalespersonSignature,
    createSalespersonSignature,
  } = useSalespersonSignatures(token);

  return (
    <Suspense>
      <Box>
        <TypographyHeading>Sales Person Signatures</TypographyHeading>

        <SalesPersonSignatureList
          signatures={salespersonSignatures}
          onDelete={deleteSalespersonSignature}
          userRole={userRole}
        />
      </Box>
    </Suspense>
  );
};

export default SalesPersonSignaturePage;
