// app/dashboard/docusign/[envelopeId]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DocusignStatus } from "../../../../../app/types/docusign";
import {
  Typography,
  Paper,
  Box,
  Button,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSession } from "next-auth/react";
import { useDocuSignConnection } from "../../../../../src/hooks/useDocuSign";
import { withRoleProtection } from "../../../../../src/components/withRoleProtection";
import { PERMISSIONS } from "../../../../../src/config/permissions";
import DetailsSkeleton from "../../../../../src/components/skeletons/DetailsSkeleton";
import TypographyHeading from "../../../../../app/components/TypographyHeading";

interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
}

interface RouteParams {
  envelopeId: string;
  uuid?: string;
}

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

const DocusignDetailsPage = () => {
  const params = useParams();
  // Extraer el envelopeId correctamente del parámetro de ruta
  const envelopeId = Array.isArray(params.envelopeId)
    ? params.envelopeId[0]
    : params.envelopeId;

  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { checkDocumentStatus } = useDocuSignConnection(token);
  const [documentStatus, setDocumentStatus] = useState<DocusignStatus | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Extraer el uuid directamente y mostrarlo
    console.log("UUID:", params.uuid);

    const fetchDocumentStatus = async () => {
      try {
        if (!token) {
          setError("Authentication required");
          return;
        }

        const uuid = Array.isArray(params.uuid) ? params.uuid[0] : params.uuid;

        if (!uuid) {
          setError("Invalid envelope ID");
          return;
        }

        console.log("Fetching status for envelope:", uuid);
        const status = await checkDocumentStatus({
          envelope_id: uuid,
        });

        console.log("Received status:", status);
        setDocumentStatus(status);
      } catch (err) {
        console.error("Error fetching document status:", err);
        setError("Failed to fetch document status");
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentStatus();
  }, [params, token, checkDocumentStatus]);

  if (loading) return <DetailsSkeleton />;

  if (error || !documentStatus) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "No document status found"}
        </Alert>
      </Box>
    );
  }

  const getStatusColor = (
    status: string
  ): "default" | "primary" | "success" | "error" | "info" => {
    switch (status.toLowerCase()) {
      case "sent":
        return "info";
      case "delivered":
        return "info";
      case "completed":
        return "success";
      case "declined":
        return "error";
      case "voided":
        return "error";
      default:
        return "default";
    }
  };

  const getExpirationColor = (expireDateTime: string) => {
    const expirationDate = new Date(expireDateTime);
    return expirationDate > new Date() ? "success" : "error";
  };
  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "hidden",
        mb: 10,
        p: { xs: 1, lg: 2 },
      }}
    >
      <TypographyHeading>DocuSign Document Details</TypographyHeading>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          border: "1px solid rgba(255, 255, 255, 0.2)",
          mb: 2,
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h6" component="div">
            Status:
          </Typography>
          <Chip
            label={documentStatus.details.status}
            color={getStatusColor(documentStatus.details.status)}
            sx={{
              ml: 2,
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <DetailRow
          label="Envelope ID"
          value={documentStatus.details.envelopeId}
        />
        <DetailRow
          label="Email Subject"
          value={documentStatus.details.emailSubject}
        />
        <DetailRow
          label="Created Date"
          value={new Date(
            documentStatus.details.initialSentDateTime
          ).toLocaleString()}
        />
        <DetailRow
          label="Sent Date"
          value={new Date(documentStatus.details.sentDateTime).toLocaleString()}
        />
        <DetailRow
          label="Last Modified"
          value={new Date(
            documentStatus.details.lastModifiedDateTime
          ).toLocaleString()}
        />
        <Box display="flex" alignItems="center" my={1}>
          <Typography variant="body1" component="span" mr={1}>
            Expires At:
          </Typography>
          <Chip
            label={new Date(
              documentStatus.details.expireDateTime
            ).toLocaleString()}
            color={getExpirationColor(documentStatus.details.expireDateTime)}
            sx={{
              ml: 2,
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Sender Information
        </Typography>
        <DetailRow
          label="Name"
          value={documentStatus.details.sender.userName}
        />
        <DetailRow label="Email" value={documentStatus.details.sender.email} />
      </Paper>
    </Box>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CLAIMS],
};

export default withRoleProtection(DocusignDetailsPage, protectionConfig);
