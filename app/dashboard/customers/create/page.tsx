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
          Create Customer
        </Typography>
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
