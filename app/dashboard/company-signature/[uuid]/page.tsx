"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { CompanySignatureData } from "../../../../app/types/company-signature";
import { getData } from "../../../lib/actions/companySignatureActions";
import TypographyHeading from "../../../components/TypographyHeading";
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
import { PERMISSIONS } from "../../../../src/config/permissions";
import Image from "next/image";
import DetailsSkeleton from "../../../../src/components/skeletons/DetailsSkeleton";
import dynamic from "next/dynamic";

// Dynamic import of GoogleMapComponent
const GoogleMapComponent = dynamic(
  () => import("../../../../src/components/GoogleMap"),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  }
);

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
  const [mapCoordinates, setMapCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    const fetchCompanySignature = async () => {
      try {
        const token = session?.accessToken as string;
        const data = await getData(token, uuid as string);
        setCompanySignature(data);
        if (data.latitude && data.longitude) {
          setMapCoordinates({
            lat: Number(data.latitude),
            lng: Number(data.longitude),
          });
        }
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

        mb: 10,
        p: { xs: 1, lg: 2 },
      }}
    >
      <TypographyHeading> Company Signature Details</TypographyHeading>

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
      {mapCoordinates ? (
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Company Location
          </Typography>
          <Box height={400} width="100%" position="relative">
            <GoogleMapComponent
              latitude={mapCoordinates.lat}
              longitude={mapCoordinates.lng}
            />
          </Box>
        </Paper>
      ) : (
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Typography variant="body1">No location data available</Typography>
        </Paper>
      )}
    </Box>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

export default withRoleProtection(CompanySignaturePage, protectionConfig);
