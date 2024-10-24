"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { InsuranceCompanyData } from "../../../../app/types/insurance-company";
import { getData } from "../../../lib/actions/insuranceCompanyActions";
import {
  Typography,
  Paper,
  Avatar,
  IconButton,
  Box,
  Button,
  Alert,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import { PERMISSIONS } from "../../../../src/config/permissions";
import DetailsSkeleton from "../../../../src/components/skeletons/DetailsSkeleton";

interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
}

const ErrorComponent = ({ message }: { message: string }) => (
  <Box sx={{ p: 3 }}>
    <Alert severity="error" sx={{ mb: 2 }}>
      {message}
    </Alert>
    <Button
      variant="contained"
      onClick={() => window.history.back()}
      startIcon={<ArrowBackIcon />}
    >
      Go Back
    </Button>
  </Box>
);

const InsuranceCompanyPage = () => {
  const { uuid } = useParams();
  const [insuranceCompany, setInsuranceCompany] =
    useState<InsuranceCompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchInsuranceCompany = async () => {
      try {
        const token = session?.accessToken as string;
        if (!token || !uuid) {
          setError("Invalid request parameters");
          return;
        }
        const data = await getData(token, uuid as string);
        if (!data) {
          setError("Insurance company not found");
          return;
        }
        setInsuranceCompany(data);
      } catch (err) {
        setError("Failed to fetch insurance company");
      } finally {
        setLoading(false);
      }
    };

    fetchInsuranceCompany();
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

  if (error || !insuranceCompany) {
    return <ErrorComponent message={error || "No insurance company found"} />;
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "hidden",
        ml: -6,
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
        sx={{ mb: 5, fontWeight: "bold" }}
      >
        Insurance Company Details
      </Typography>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          marginBottom: "20px",
        }}
      >
        <IconButton
          size="large"
          edge="end"
          aria-label="insurance company"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar
            alt="Insurance Company"
            sx={{
              width: 50,
              height: 50,
              bgcolor: "#EBF4FF",
              color: "#7F9CF5",
            }}
          >
            {insuranceCompany.insurance_company_name
              ? insuranceCompany.insurance_company_name[0].toUpperCase()
              : "I"}
          </Avatar>
        </IconButton>
        <Typography variant="h6" gutterBottom>
          {insuranceCompany.insurance_company_name}
        </Typography>
        <DetailRow label="Phone" value={insuranceCompany.phone} />
        <DetailRow label="Email" value={insuranceCompany.email} />
        <DetailRow label="Address" value={insuranceCompany.address} />
        <DetailRow label="Website" value={insuranceCompany.website} />

        <Divider sx={{ my: 2 }} />

        {/* Información del creador */}
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Created By
          </Typography>
          <DetailRow
            label="Name"
            value={`${insuranceCompany.created_by_user?.name} ${insuranceCompany.created_by_user?.last_name}`}
          />
          <DetailRow
            label="Email"
            value={insuranceCompany.created_by_user?.email}
          />
          <DetailRow
            label="Created At"
            value={
              insuranceCompany.created_at
                ? new Date(insuranceCompany.created_at).toLocaleDateString()
                : null
            }
          />
          <DetailRow
            label="Last Updated"
            value={
              insuranceCompany.updated_at
                ? new Date(insuranceCompany.updated_at).toLocaleDateString()
                : null
            }
          />
        </Box>
      </Paper>
    </Box>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_COMPANIES],
};

export default withRoleProtection(InsuranceCompanyPage, protectionConfig);
