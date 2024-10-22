"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PublicCompanyData } from "../../../../app/types/public-company";
import { getData } from "../../../lib/actions/publicCompanyActions";
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
import Image from "next/image";
import DetailsSkeleton from "../../../../src/components/skeletons/DetailsSkeleton";

interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
}

const PublicCompanyPage = () => {
  const { uuid } = useParams();
  const [publicCompany, setPublicCompany] = useState<PublicCompanyData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPublicCompany = async () => {
      try {
        const token = session?.accessToken as string;
        const data = await getData(token, uuid as string);
        setPublicCompany(data);
        setLoading(false);
      } catch (err) {
        setError("No public company found");
        setLoading(false);
      }
    };

    fetchPublicCompany();
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

  if (error || !publicCompany) {
    return (
      <Box sx={{ mt: 2, ml: -6, mb: 10, p: { xs: 3, sm: 3, md: 2, lg: 4 } }}>
        <Button
          variant="outlined"
          onClick={() => window.history.back()}
          startIcon={<ArrowBackIcon />}
          style={{ marginBottom: "20px" }}
        >
          Back
        </Button>
        <Typography variant="h6" color="error">
          {error || "No public company found"}
        </Typography>
      </Box>
    );
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
        Public Company Details
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
          aria-label="public company"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar
            alt="Public Company"
            sx={{
              width: 50,
              height: 50,
              bgcolor: "#EBF4FF",
              color: "#7F9CF5",
            }}
          >
            {publicCompany.public_company_name
              ? publicCompany.public_company_name[0].toUpperCase()
              : "P"}
          </Avatar>
        </IconButton>
        <Typography variant="h6" gutterBottom>
          {publicCompany.public_company_name}
        </Typography>
        <DetailRow label="Phone" value={publicCompany.phone} />
        <DetailRow label="Email" value={publicCompany.email} />
        <DetailRow label="Address" value={publicCompany.address} />
        <DetailRow label="Website" value={publicCompany.website} />
      </Paper>
    </Box>
  );
};

export default PublicCompanyPage;
