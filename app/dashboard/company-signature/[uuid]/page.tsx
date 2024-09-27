"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { CompanySignatureData } from "../../../../app/types/company-signature";
import { getData } from "../../../lib/actions/companySignatureActions";
import {
  Container,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import Image from "next/image";
import DetailsSkeleton from "../../../../src/components/skeletons/DetailsSkeleton";
interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
}

const CompanySignaturePage = () => {
  const { uuid } = useParams();
  const [companySignature, setCompanySignature] =
    useState<CompanySignatureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchCompanySignature = async () => {
      try {
        const token = session?.accessToken as string;
        const data = await getData(token, uuid as string);
        setCompanySignature(data);
        setLoading(false);
      } catch (err) {
        setError("No company signature found");
        setLoading(false);
      }
    };

    fetchCompanySignature();
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

  if (error || !companySignature) {
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
          {error || "No company signature found"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "hidden",
        mt: 2,
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
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 5 }}>
        Company Signature Details
      </Typography>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <IconButton
          size="large"
          edge="end"
          aria-label="company signature"
          aria-haspopup="true"
          color="inherit"
        >
          {companySignature.signature_path ? (
            <Box sx={{ width: 100, height: 100, position: "relative" }}>
              <Image
                src={companySignature.signature_path}
                alt="Company Signature"
                layout="fill"
                objectFit="contain"
              />
            </Box>
          ) : (
            <Avatar
              alt="Company Signature"
              sx={{
                width: 50,
                height: 50,
                bgcolor: "#EBF4FF",
                color: "#7F9CF5",
              }}
            >
              {companySignature.company_name
                ? companySignature.company_name[0].toUpperCase()
                : "C"}
            </Avatar>
          )}
        </IconButton>
        <Typography variant="h6" gutterBottom>
          {companySignature.company_name}
        </Typography>
        <DetailRow label="Phone" value={companySignature.phone} />
        <DetailRow label="Email" value={companySignature.email} />
        <DetailRow label="Address" value={companySignature.address} />
      </Paper>
    </Box>
  );
};

export default withRoleProtection(CompanySignaturePage, ["Super Admin"]);
