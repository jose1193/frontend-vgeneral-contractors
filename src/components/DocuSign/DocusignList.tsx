"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DocusignData, DocusignStatus } from "../../../app/types/docusign";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  Grid,
  Paper,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AutoStories from "@mui/icons-material/AutoStories";
import { useTheme } from "@mui/material/styles";
import { useDocuSignConnection } from "../../hooks/useDocuSign";
import { useSession } from "next-auth/react";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";
import { useListPermissions } from "../../hooks/useListPermissions";
import { PERMISSIONS } from "../../config/permissions";

interface DocusignListProps {
  userRole: string | undefined;
  onDelete: (uuid: string) => Promise<void>;
}

const DocusignList: React.FC<DocusignListProps> = ({ userRole, onDelete }) => {
  const theme = useTheme();
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const {
    documents,
    loading,
    error,
    loadDocuments,
    checkMultipleDocumentStatus,
  } = useDocuSignConnection(token);
  const { can, canModifyList } = useListPermissions();

  // Estados
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<DocusignData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentStatuses, setDocumentStatuses] = useState<
    Record<string, DocusignStatus>
  >({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const loadDocumentStatuses = useCallback(async () => {
    if (!documents?.length) return;

    const envelopeIds = documents
      .filter((doc) => doc.envelope_id)
      .map((doc) => doc.envelope_id as string);

    if (envelopeIds.length === 0) return;

    try {
      setIsLoadingStatus(true);
      const statuses = await checkMultipleDocumentStatus(envelopeIds);

      const validStatuses = Object.entries(statuses).reduce(
        (acc, [key, value]) => {
          if (value?.details?.status) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, DocusignStatus>
      );

      setDocumentStatuses(validStatuses);
    } catch (error) {
      console.error("Error loading document statuses:", error);
      setSnackbar({
        open: true,
        message: "Failed to load document statuses",
        severity: "error",
      });
    } finally {
      setIsLoadingStatus(false);
    }
  }, [documents, checkMultipleDocumentStatus]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        await loadDocuments();
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to load documents",
          severity: "error",
        });
      }
    };

    fetchDocuments();
  }, [loadDocuments]);

  useEffect(() => {
    loadDocumentStatuses();
  }, [loadDocumentStatuses]);

  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error,
        severity: "error",
      });
    }
  }, [error]);

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleDeleteClick = (row: any) => {
    const doc = documents.find((d) => d.uuid === row.uuid);
    if (doc) {
      setDocToDelete(doc);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (docToDelete?.uuid) {
      setIsSubmitting(true);
      try {
        await onDelete(docToDelete.uuid);
        setDeleteDialogOpen(false);
        setSnackbar({
          open: true,
          message: "Document deleted successfully",
          severity: "success",
        });
        await loadDocuments();
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to delete document",
          severity: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getStatusColor = (
    status: string | undefined
  ): "default" | "primary" | "success" | "error" | "info" => {
    if (!status) return "default";

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
      case "created":
        return "default";
      default:
        return "default";
    }
  };

  const columns: GridColDef[] = [
    {
      field: "envelope_id",
      headerName: "Envelope ID",
      flex: 1,
      headerAlign: "center",
      align: "center",
      cellClassName: "wrapped-cell",
      minWidth: 150,
    },
    {
      field: "claim_internal_id",
      headerName: "Claim Internal ID",
      flex: 1,
      headerAlign: "center",
      align: "center",
      cellClassName: "wrapped-cell",
      minWidth: 150,
    },

    {
      field: "policy_number",
      headerName: "Policy Number",
      flex: 1,
      headerAlign: "center",
      align: "center",
      cellClassName: "wrapped-cell",
      minWidth: 120,
    },
    {
      field: "signers",
      headerName: "Signers",
      flex: 1.5,
      headerAlign: "center",
      align: "center",
      cellClassName: "wrapped-cell",
      minWidth: 200,
    },
    {
      field: "generated_by",
      headerName: "Generated By",
      flex: 1.5,
      headerAlign: "center",
      align: "center",
      cellClassName: "wrapped-cell",
      minWidth: 150,
    },
    {
      field: "docusign_status",
      headerName: "DocuSign Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 140,
      renderCell: (params) => {
        const status =
          documentStatuses[params.row.envelope_id]?.details?.status;
        const isLoading = isLoadingStatus && !status;

        if (isLoading) {
          return <CircularProgress size={20} />;
        }

        return (
          <Chip
            label={status ? status : "Unknown"}
            color={getStatusColor(status)}
            sx={{
              fontWeight: "bold",
              textTransform: "capitalize",
              minWidth: 85,
              "& .MuiChip-label": {
                px: 2,
              },
            }}
          />
        );
      },
    },
    {
      field: "created_at",
      headerName: "Created At",
      flex: 1,
      minWidth: 180,
      headerAlign: "center",
      align: "center",
      cellClassName: "wrapped-cell",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            py: 1,
          }}
        >
          {can(PERMISSIONS.MANAGE_CLAIMS) && (
            <>
              <Button
                size="small"
                variant="contained"
                sx={{
                  minWidth: "unset",
                  padding: "8px 12px",
                  backgroundColor: "#2563eb",
                  "&:hover": { backgroundColor: "#3b82f6" },
                  height: 35,
                  width: 35,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() =>
                  window.open(
                    `/dashboard/claims/${params.row.claim_uuid}`,
                    "_blank"
                  )
                }
              >
                <VisibilityIcon fontSize="small" />
              </Button>

              <Button
                size="small"
                variant="contained"
                color="info"
                sx={{
                  minWidth: "unset",
                  padding: "8px 12px",
                  height: 35,
                  width: 35,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => {
                  if (params.row.envelope_id) {
                    window.open(
                      `/dashboard/docusign/documents/${params.row.envelope_id}`,
                      "_blank"
                    );
                  }
                }}
                disabled={!params.row.envelope_id}
              >
                <AutoStories fontSize="small" />
              </Button>
            </>
          )}

          {canModifyList({
            permission: PERMISSIONS.MANAGE_CONFIG,
            restrictedRoles: ["Salesperson"],
          }) && (
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => handleDeleteClick(params.row)}
              sx={{
                minWidth: "unset",
                padding: "8px 12px",
                height: 35,
                width: 35,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DeleteIcon fontSize="small" />
            </Button>
          )}
        </Box>
      ),
    },
  ];

  const rows = documents
    ? documents.map((doc: DocusignData) => ({
        id: doc.id,
        uuid: doc.uuid,
        envelope_id: doc.envelope_id,
        claim_id: doc.claim_id,
        claim_uuid: doc.claims?.uuid || "",
        claim_internal_id: doc.claims?.claim_internal_id || "N/A",
        policy_number: doc.claims?.policy_number || "N/A",
        signers: doc.claims?.customers
          ? doc.claims.customers
              .map((customer) => `${customer.name} ${customer.last_name}`)
              .join(", ")
          : "N/A",
        generated_by: doc.generated_by
          ? `${doc.generated_by.name} ${doc.generated_by.last_name}`
          : "N/A",
        docusign_status: documentStatuses[doc.envelope_id || ""],
        created_at: doc.created_at
          ? new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }).format(new Date(doc.created_at))
          : "Date not available",
      }))
    : [];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: { xs: 1, lg: 1 },
        maxWidth: {
          xs: "420px",
          sm: "540px",
          md: "720px",
          lg: "1120px",
        },
        mx: "auto",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 5,
              height: 600,
              width: "100%",
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "52px !important",
                padding: "8px",
              },
              "& .wrapped-cell": {
                whiteSpace: "normal !important",
                lineHeight: "1.2 !important",
                display: "flex",
                alignItems: "center",
                padding: "8px",
                "& > div": {
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  textAlign: "center",
                },
              },
              "& .MuiDataGrid-row": {
                minHeight: "52px !important",
                "& > div": {
                  minHeight: "52px !important",
                },
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                borderBottom: "2px solid #e0e0e0",
              },
              "& .MuiDataGrid-virtualScroller": {
                overflow: "auto",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "2px solid #e0e0e0",
              },
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row.uuid}
              slots={{ toolbar: GridToolbar }}
              checkboxSelection
              disableRowSelectionOnClick
              getRowHeight={() => "auto"}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25, 50, 100]}
            />
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#ef4444",
            mb: 5,
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              textAlign: "left",
              mb: 2,
              fontWeight: "bold",
            }}
          >
            Are you sure you want to delete this document?
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              textAlign: "left",
              mb: 2,
            }}
          >
            Envelope ID:
            <span style={{ fontWeight: "bold", marginLeft: 10 }}>
              {docToDelete?.envelope_id}
            </span>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleDeleteConfirm}
            color="error"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
};

export default DocusignList;
