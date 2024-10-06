"use client";

import React, { Suspense } from "react";
import { useSalespersonSignatures } from "../../../src/hooks/useSalespersonSignatures";
import SalesPersonSignatureList from "../../../src/components/Salesperson-Signature/SalesPersonSignatureList";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ButtonCreate from "../../components/ButtonCreate";

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
          Sales Person Signatures
        </Typography>

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
