"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MortgageCompanyData } from "../../../../app/types/mortgage-company";
import { getData } from "../../../lib/actions/mortgageCompanyActions";
import {
  Typography,
  Paper,
  Avatar,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSession } from "next-auth/react";
import DetailsSkeleton from "../../../../src/components/skeletons/DetailsSkeleton";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import TypographyHeading from "../../../components/TypographyHeading";
import { PERMISSIONS } from "../../../../src/config/permissions";

interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
}

const MortgageCompanyPage = () => {
  const { uuid } = useParams();
  const [mortgageCompany, setMortgageCompany] =
    useState<MortgageCompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchMortgageCompany = async () => {
      try {
        const token = session?.accessToken as string;
        const data = await getData(token, uuid as string);
        setMortgageCompany(data);
        setLoading(false);
      } catch (err) {
        setError("No mortgage company found");
        setLoading(false);
      }
    };

    fetchMortgageCompany();
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

  if (error || !mortgageCompany) {
    return (
      <Box sx={{ mt: 2, mb: 10, p: { xs: 3, sm: 3, md: 2, lg: 4 } }}>
        <Button
          variant="outlined"
          onClick={() => window.history.back()}
          startIcon={<ArrowBackIcon />}
          style={{ marginBottom: "20px" }}
        >
          Back
        </Button>
        <Typography variant="h6" color="error">
          {error || "No mortgage company found"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "hidden",

        mb: 10,
        p: { xs: 1, lg: 2 },
      }}
    >
      <TypographyHeading> Mortgage Company Details</TypographyHeading>

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
          aria-label="mortgage company"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar
            alt="Mortgage Company"
            sx={{
              width: 50,
              height: 50,
              bgcolor: "#EBF4FF",
              color: "#7F9CF5",
            }}
          >
            {mortgageCompany.mortgage_company_name
              ? mortgageCompany.mortgage_company_name[0].toUpperCase()
              : "M"}
          </Avatar>
        </IconButton>
        <Typography variant="h6" gutterBottom>
          {mortgageCompany.mortgage_company_name}
        </Typography>
        <DetailRow label="Phone" value={mortgageCompany.phone} />
        <DetailRow label="Email" value={mortgageCompany.email} />
        <DetailRow label="Address" value={mortgageCompany.address} />
        <DetailRow label="Website" value={mortgageCompany.website} />
      </Paper>
    </Box>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_COMPANIES],
};

export default withRoleProtection(MortgageCompanyPage, protectionConfig);
