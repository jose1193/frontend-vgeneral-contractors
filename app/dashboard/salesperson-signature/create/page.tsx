"use client";

import React, { Suspense } from "react";
import { useSalespersonSignatures } from "../../../../src/hooks/useSalespersonSignatures";
import SalesPersonSignatureForm from "../../../../src/components/Salesperson-Signature/SalesPersonSignatureForm";
import { Typography, Box, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { SalesPersonSignatureData } from "../../../types/salesperson-signature";
import { useSession } from "next-auth/react";

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
          ml: -7,
          mb: 10,
          p: { xs: 3, sm: 3, md: 2, lg: 4 },
        }}
      >
        <Button
          variant="outlined"
          onClick={() => window.history.back()}
          startIcon={<ArrowBackIcon />}
          style={{ marginBottom: "20px" }}
        >
          Back
        </Button>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            mb: 5,
            fontSize: {
              xs: "1.5rem",
              sm: "1.75rem",
              md: "2rem",
              lg: "2.25rem",
            },
          }}
        >
          Create Salesperson Signature
        </Typography>
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
