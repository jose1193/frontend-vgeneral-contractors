"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { CustomerData } from "../../../../app/types/customer";
import { getData } from "../../../lib/actions/customersActions";
import {
  Container,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Box,
  Button,
  Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSession } from "next-auth/react";
import Image from "next/image";
import DetailsSkeleton from "../../../../src/components/skeletons/DetailsSkeleton";
import TypographyHeading from "../../../components/TypographyHeading";
interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
}

const CustomerPage = () => {
  const { uuid } = useParams();
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const token = session?.accessToken as string;
        const data = await getData(token, uuid as string);
        setCustomer(data);
        setLoading(false);
      } catch (err) {
        setError("No customer found");
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [uuid, session?.accessToken]);

  const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
    <Box display="flex" alignItems="center" my={1}>
      <Typography variant="body1" component="span" mr={1}>
        {label}:
      </Typography>
      <Typography variant="body1" component="span" fontWeight="bold">
        {value ?? "N/A"}
      </Typography>
    </Box>
  );

  if (loading) {
    return <DetailsSkeleton />;
  }

  if (error || !customer) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h6" color="error">
            {error || "No customer found"}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Suspense fallback={<DetailsSkeleton />}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <TypographyHeading> Customer Details</TypographyHeading>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    alt="Customer Avatar"
                    sx={{
                      width: 50,
                      height: 50,
                      bgcolor: "#EBF4FF",
                      color: "#7F9CF5",
                      mr: 2,
                    }}
                  >
                    {customer.name ? customer.name[0].toUpperCase() : "C"}
                  </Avatar>
                  <Typography variant="h6">
                    {`${customer.name} ${customer.last_name}`}
                  </Typography>
                </Box>
                <DetailRow label="Email" value={customer.email} />
                <DetailRow label="Cell Phone" value={customer.cell_phone} />
                <DetailRow label="Home Phone" value={customer.home_phone} />
                <DetailRow label="Occupation" value={customer.occupation} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Customer Signature
                </Typography>
                {customer.signature_customer?.signature_data ? (
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Image
                      src={customer.signature_customer.signature_data}
                      alt="Customer Signature"
                      width={300}
                      height={150}
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </Box>
                ) : (
                  <Typography>No signature available</Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Suspense>
  );
};

export default CustomerPage;
