import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  AutoStories as AutoStoriesIcon,
  Schedule as ScheduleIcon,
  ErrorOutline as ErrorOutlineIcon,
} from "@mui/icons-material";
import { ClaimsData } from "../../../app/types/claims";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDocuSignConnection } from "../../hooks/useDocuSign";
import { DocusignStatus } from "../../../app/types/docusign";

interface DocusignDetailsTabProps {
  claim: ClaimsData;
}

const DocusignDetailsTab: React.FC<DocusignDetailsTabProps> = ({ claim }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { checkDocumentStatus } = useDocuSignConnection(token);
  const [documentStatuses, setDocumentStatuses] = useState<
    Record<string, DocusignStatus>
  >({});
  const [loadingStatuses, setLoadingStatuses] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const loadDocumentStatus = async (envelopeId: string) => {
      if (!envelopeId) return;

      try {
        setLoadingStatuses((prev) => ({ ...prev, [envelopeId]: true }));
        const status = await checkDocumentStatus({ envelope_id: envelopeId });
        setDocumentStatuses((prev) => ({ ...prev, [envelopeId]: status }));
      } catch (error) {
        console.error(
          `Error loading status for document ${envelopeId}:`,
          error
        );
      } finally {
        setLoadingStatuses((prev) => ({ ...prev, [envelopeId]: false }));
      }
    };

    if (claim.claims_docusign?.length) {
      claim.claims_docusign.forEach((doc) => {
        if (doc.envelope_id) {
          loadDocumentStatus(doc.envelope_id);
        }
      });
    }
  }, [claim.claims_docusign, checkDocumentStatus]);

  const getStatusColor = (
    status: string
  ): "default" | "primary" | "success" | "error" | "info" => {
    switch (status?.toLowerCase()) {
      case "sent":
        return "info";
      case "delivered":
        return "primary";
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpired = (expireDateTime: string) => {
    return new Date(expireDateTime) < new Date();
  };

  return (
    <Paper elevation={0} sx={{ p: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" color="text.primary">
          DocuSign Agreements
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Document Information</TableCell>
              <TableCell>Signers</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Details</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {claim.claims_docusign?.map((doc) => {
              const status = documentStatuses[doc.envelope_id || ""]?.details;
              const isLoading = loadingStatuses[doc.envelope_id || ""];

              return (
                <TableRow key={doc.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Created:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {formatDateTime(doc.created_at || "")}
                        </span>
                      </Typography>
                      {status && (
                        <>
                          <Typography variant="body2" color="text.secondary">
                            Subject:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {status.emailSubject}
                            </span>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Last Modified:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {formatDateTime(status.lastModifiedDateTime)}
                            </span>
                          </Typography>
                          {status.expireDateTime && (
                            <Tooltip
                              title={`Expires: ${formatDateTime(
                                status.expireDateTime
                              )}`}
                            >
                              <Chip
                                icon={<ScheduleIcon />}
                                label={
                                  isExpired(status.expireDateTime)
                                    ? "Expired"
                                    : "Active"
                                }
                                size="small"
                                color={
                                  isExpired(status.expireDateTime)
                                    ? "error"
                                    : "success"
                                }
                                sx={{ mt: 1 }}
                              />
                            </Tooltip>
                          )}
                        </>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Recipients:
                      </Typography>
                      {claim.customers?.map((customer, idx) => (
                        <Typography
                          key={idx}
                          variant="body2"
                          color="text.secondary"
                        >
                          <span style={{ fontWeight: "bold" }}>
                            {customer.name} {customer.last_name}
                          </span>
                        </Typography>
                      ))}
                      {status?.sender && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          Sender:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {status.sender.userName}
                          </span>
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {isLoading ? (
                      <CircularProgress size={20} />
                    ) : status ? (
                      <Chip
                        label={status.status || "Pending"}
                        color={getStatusColor(status.status || "")}
                        sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                      />
                    ) : (
                      <Tooltip title="Status not available">
                        <ErrorOutlineIcon color="error" />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {status && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Envelope ID:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {status.envelopeId}
                          </span>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Location:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {status.signingLocation}
                          </span>
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AutoStoriesIcon />}
                      onClick={() =>
                        router.push(
                          `/dashboard/docusign/documents/${doc.envelope_id}`
                        )
                      }
                      sx={{
                        backgroundColor: "#0288d1",
                        "&:hover": { backgroundColor: "#0277bd" },
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DocusignDetailsTab;
