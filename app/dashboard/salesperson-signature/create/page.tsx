"use client";

import React, { Suspense } from "react";
import { useSalespersonSignatures } from "../../../../src/hooks/useSalespersonSignatures";
import SalesPersonSignatureForm from "../../../../src/components/Salesperson-Signature/SalesPersonSignatureForm";
import { Typography, Box, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { SalesPersonSignatureData } from "../../../types/salesperson-signature";
import { useSession } from "next-auth/react";
import TypographyHeading from "../../../components/TypographyHeading";
const CreateSalespersonSignaturePage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const token = session?.accessToken as string;
  const userRole = session?.user?.user_role;
  const { createSalespersonSignature } = useSalespersonSignatures(token);

  const handleSubmit = async (data: SalesPersonSignatureData) => {
    await createSalespersonSignature(data);
    console.log("Salesperson Signature data to submit:", data);
    router.push("/dashboard/salesperson-signature");
  };

  return (
    <Suspense>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",

          mb: 10,
          p: { xs: 1, lg: 2 },
        }}
      >
        <TypographyHeading> Create Salesperson Signature</TypographyHeading>
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <SalesPersonSignatureForm onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
};

export default CreateSalespersonSignaturePage;
