// src/app/customers/create/page.tsx
"use client";

import React, { Suspense } from "react";
import { useCustomers } from "../../../../src/hooks/useCustomers";
import CustomerForm from "../../../../src/components/Customers/CustomerForm";
import { Typography, Box, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { CustomerData } from "../../../../app/types/customer";
import { useSession } from "next-auth/react";
import TypographyHeading from "../../../components/TypographyHeading";
const CreateCustomerPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { createCustomer } = useCustomers(token);
  const handleSubmit = async (data: CustomerData) => {
    await createCustomer(data);
    console.log("Customer data to submit:", data);
    router.push("/dashboard/customers");
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
        <Button
          variant="outlined"
          onClick={() => window.history.back()}
          startIcon={<ArrowBackIcon />}
          style={{ marginBottom: "20px" }}
        >
          Back
        </Button>

        <TypographyHeading> Create Customer</TypographyHeading>

        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <CustomerForm onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
};

export default CreateCustomerPage;
