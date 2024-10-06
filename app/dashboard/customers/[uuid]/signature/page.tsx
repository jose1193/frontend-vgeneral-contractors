"use client";

import React, { useEffect, lazy, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Paper,
  Box,
  Button,
  Typography,
  Avatar,
  CircularProgress,
  Grid,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CustomerData } from "../../../../../app/types/customer";
import { CustomerSignatureData } from "../../../../../app/types/customer-signature";
import { UserData } from "../../../../../app/types/user";
import DetailsSkeleton from "../../../../../src/components/skeletons/DetailsSkeleton";
import { useSession } from "next-auth/react";
import { getData } from "../../../../lib/actions/customersActions";
import {
  createData,
  updateData,
} from "../../../../lib/actions/customerSignatureActions";
import useFormSnackbar from "../../../../../src/hooks/useFormSnackbar";

const SignaturePad = lazy(
  () => import("../../../../../app/components/SignaturePad")
);

interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <Typography variant="body1" gutterBottom>
    <strong>{label}:</strong>{" "}
    {value !== null && value !== undefined ? value : "N/A"}
  </Typography>
);

const formatDate = (date: string | undefined): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString();
};

const formatUserName = (user: UserData | undefined): string => {
  if (!user) return "N/A";
  return `${user.name} ${user.last_name}`;
};

const CustomerSignaturePage = () => {
  const { uuid } = useParams();
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { snackbar, setSnackbar, handleSnackbarClose } = useFormSnackbar();
  const router = useRouter();
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!session?.accessToken) {
        setError("Session not found");
        setLoading(false);
        return;
      }
      try {
        const data = await getData(session.accessToken, uuid as string);
        setCustomer(data);
        setSignatureData(data.signature_customer?.signature_data || null);
      } catch (err) {
        setError("No customer found");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [uuid, session?.accessToken]);

  const handleSignatureChange = (newSignatureData: string | null) => {
    setSignatureData(newSignatureData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !signatureData || !session?.accessToken) {
      console.error("Missing required data:", {
        customer,
        signatureData,
        sessionAccessToken: !!session?.accessToken,
      });
      setSnackbar({
        open: true,
        message: "Missing required data",
        severity: "error",
      });
      return;
    }

    const customerId = customer.id;
    const userId = session.user?.id;

    const numericCustomerId = Number(customerId);
    const numericUserId = Number(userId);

    if (isNaN(numericCustomerId) || isNaN(numericUserId)) {
      console.error("Invalid customer or user ID after conversion:", {
        numericCustomerId,
        numericUserId,
      });
      setSnackbar({
        open: true,
        message: "Invalid customer or user ID",
        severity: "error",
      });
      return;
    }

    setSubmitting(true);
    try {
      const signaturePayload: CustomerSignatureData = {
        customer_id: numericCustomerId,
        signature_data: signatureData,
        user_id_ref_by: numericUserId,
      };

      if (customer.signature_customer?.uuid) {
        // Update existing signature
        const updatePayload = {
          ...signaturePayload,
          uuid: customer.signature_customer.uuid,
        };
        console.log("Updating signature with data:", updatePayload);
        await updateData(
          session.accessToken,
          customer.signature_customer.uuid,
          updatePayload
        );
        setSnackbar({
          open: true,
          message: "Signature updated successfully",
          severity: "success",
        });
      } else {
        // Create new signature
        console.log("Creating new signature with data:", signaturePayload);
        await createData(session.accessToken, signaturePayload);
        setSnackbar({
          open: true,
          message: "Signature created successfully",
          severity: "success",
        });
      }

      // Refresh customer data to get the updated signature
      const updatedData = await getData(session.accessToken, uuid as string);
      setCustomer(updatedData);
      setSignatureData(updatedData.signature_customer?.signature_data || null);

      // Redirect to the customer page
      router.push(`/dashboard/customers/${uuid}`);
    } catch (err) {
      console.error("Error submitting signature:", err);
      setSnackbar({
        open: true,
        message: "Failed to save signature",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <DetailsSkeleton />;
  }

  if (error || !customer) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Button
            variant="outlined"
            onClick={() => window.history.back()}
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2 }}
          >
            Back
          </Button>
          <Typography variant="h6" color="error">
            {error || "No customer found"}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4, marginLeft: -7 }}>
        <Button
          variant="outlined"
          onClick={() => window.history.back()}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          Customer Signature
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar
                alt="Customer Avatar"
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: "#EBF4FF",
                  color: "#7F9CF5",
                }}
              >
                {customer.name[0].toUpperCase()}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h6">{`${customer.name} ${customer.last_name}`}</Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <DetailRow label="Email" value={customer.email} />
            <DetailRow label="Cell Phone" value={customer.cell_phone} />
            <DetailRow label="Home Phone" value={customer.home_phone} />
            <DetailRow label="Occupation" value={customer.occupation} />
            <DetailRow label="Customer ID" value={customer.id} />
            <DetailRow
              label="Signature UUID"
              value={customer.signature_customer?.uuid || "Not yet created"}
            />
            <DetailRow
              label="Signature Created At"
              value={formatDate(customer.signature_customer?.created_at)}
            />
            <DetailRow
              label="Signature Last Updated"
              value={formatDate(customer.signature_customer?.updated_at)}
            />
            <DetailRow
              label="Signature Created By"
              value={formatUserName(
                customer.signature_customer?.created_by_user
              )}
            />
          </Box>
        </Paper>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Customer Signature
          </Typography>
          <form onSubmit={handleSubmit}>
            <Suspense fallback={<CircularProgress />}>
              <SignaturePad
                name="customer_signature"
                onChange={handleSignatureChange}
                initialValue={customer.signature_customer?.signature_data || ""}
              />
            </Suspense>
            <Box sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting || !signatureData}
                startIcon={
                  submitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {submitting ? "Saving..." : "Save Signature"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CustomerSignaturePage;
