"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { getData } from "../../../../lib/actions/customersActions";
import { useCustomers } from "@/hooks/useCustomers";
import CustomerForm from "../../../../../src/components/Customers/CustomerForm";
import { CustomerData } from "../../../../types/customer";
import { Typography, Box, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GeneralFormSkeleton from "@/components/skeletons/GeneralFormSkeleton";
import { useSession } from "next-auth/react";

function EditCustomerPage() {
  const { uuid } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { updateCustomer } = useCustomers(token);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await getData(token, uuid as string);
        setCustomer(data);
      } catch (err) {
        setError("No customer found");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [uuid, token]);

  const handleSubmit = async (data: CustomerData) => {
    await updateCustomer(uuid as string, data);
    router.push("/dashboard/customers");
  };

  if (loading) {
    return <GeneralFormSkeleton />;
  }

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
        <Paper
          elevation={3}
          sx={{
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 2,
            p: 3,
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
            gutterBottom
            sx={{ marginBottom: 4, marginTop: 2 }}
          >
            Edit Customer
          </Typography>
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : customer ? (
            <CustomerForm
              initialData={customer}
              onSubmit={handleSubmit}
              uuid={uuid as string}
            />
          ) : (
            <Typography>No customer found</Typography>
          )}
        </Paper>
      </Box>
    </Suspense>
  );
}

export default EditCustomerPage;
