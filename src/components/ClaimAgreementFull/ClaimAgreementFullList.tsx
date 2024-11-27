"use client";

import React, { useState } from "react";
import { ClaimAgreementFullData } from "../../../app/types/claim-agreement-full";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import {
  Box,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import { useRouter } from "next/navigation";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";

interface ClaimAgreementFullListProps {
  items: ClaimAgreementFullData[];
  onDelete: (uuid: string) => Promise<ClaimAgreementFullData>;
  onRestore: (uuid: string) => Promise<ClaimAgreementFullData>;
  userRole?: string;
}

const ClaimAgreementFullList: React.FC<ClaimAgreementFullListProps> = ({
  items,
  onDelete,
  onRestore,
  userRole,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<ClaimAgreementFullData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const handleView = (claimUuid: string) => {
    if (claimUuid) {
      window.open(`/dashboard/claims/${claimUuid}`, "_blank");
    } else {
      setSnackbar({
        open: true,
        message: "Claim UUID not found",
        severity: "error",
      });
    }
  };

  const handleDownload = (pdfPath: string) => {
    window.open(pdfPath, "_blank");
  };

  const handleDeleteClick = (item: ClaimAgreementFullData) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleRestoreClick = (item: ClaimAgreementFullData) => {
    setSelectedItem(item);
    setRestoreDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedItem?.uuid) {
      setIsSubmitting(true);
      try {
        await onDelete(selectedItem.uuid);
        setDeleteDialogOpen(false);
        setSnackbar({
          open: true,
          message: "Claim Agreement Full suspended successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to suspend Claim Agreement Full",
          severity: "error",
        });
      } finally {
        setIsSubmitting(false);
        setSelectedItem(null);
      }
    }
  };

  const handleRestoreConfirm = async () => {
    if (selectedItem?.uuid) {
      setIsSubmitting(true);
      try {
        await onRestore(selectedItem.uuid);
        setRestoreDialogOpen(false);
        setSnackbar({
          open: true,
          message: "Claim Agreement Full restored successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to restore Claim Agreement Full",
          severity: "error",
        });
      } finally {
        setIsSubmitting(false);
        setSelectedItem(null);
      }
    }
  };

  const columns: GridColDef[] = [
    {
      field: "claim_internal_id",
      headerName: "Claim Internal ID",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "policy_number",
      headerName: "Policy Number",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "customers",
      headerName: "Customers",
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "created_at",
      headerName: "Created At",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Available" ? "success" : "error"}
        />
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          key="view"
          icon={<VisibilityIcon sx={{ color: "#3b82f6" }} />}
          label="View Claim"
          onClick={() => handleView(params.row.claim?.uuid)}
          showInMenu
        />,
        <GridActionsCellItem
          key="download"
          icon={<DownloadIcon sx={{ color: "#10b981" }} />}
          label="Download PDF"
          onClick={() => handleDownload(params.row.full_pdf_path)}
          showInMenu
        />,
        ...(params.row.status === "Available" && userRole !== "Viewer"
          ? [
              <GridActionsCellItem
                key="delete"
                icon={<DeleteIcon sx={{ color: "#ef4444" }} />}
                label="Suspend"
                onClick={() => handleDeleteClick(params.row)}
                showInMenu
              />,
            ]
          : []),
        ...(params.row.status === "Suspended"
          ? [
              <GridActionsCellItem
                key="restore"
                icon={<RestoreIcon sx={{ color: "#f59e0b" }} />}
                label="Restore"
                onClick={() => handleRestoreClick(params.row)}
                showInMenu
              />,
            ]
          : []),
      ],
    },
  ];

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: { xs: 1, sm: 2, md: 2, lg: 2 },
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
              overflow: "hidden",
              "& .MuiDataGrid-root": {
                border: "none",
              },
            }}
          >
            <DataGrid
              rows={items.map((item) => ({
                id: item.id,
                uuid: item.uuid,
                claim_internal_id: item.claim?.claim_internal_id || "-",
                policy_number: item.claim?.policy_number || "-",
                customers: Array.isArray(item.claim?.customers)
                  ? item.claim.customers
                      .map(
                        (customer) => `${customer.name} ${customer.last_name}`
                      )
                      .join(", ")
                  : item.claim?.customers || "-",
                full_pdf_path: item.full_pdf_path,
                claim_id: item.claim_id,
                claim: item.claim,
                created_at: item.created_at,
                updated_at: item.updated_at,
                deleted_at: item.deleted_at,
                status: item.deleted_at ? "Suspended" : "Available",
              }))}
              columns={columns}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[5, 10, 25, 50]}
              disableRowSelectionOnClick
              getRowId={(row) => row.uuid}
              checkboxSelection
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
          Confirm Suspend
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
            Are you sure you want to suspend this agreement?
          </Typography>
          {selectedItem && (
            <Box>
              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                Claim Internal ID:{" "}
                <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                  {selectedItem.claim?.claim_internal_id || "-"}
                </span>
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                Customers:{" "}
                <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                  {Array.isArray(selectedItem.claim?.customers)
                    ? selectedItem.claim.customers
                        .map(
                          (customer) => `${customer.name} ${customer.last_name}`
                        )
                        .join(", ")
                    : selectedItem.claim?.customers || "-"}
                </span>
              </Typography>

              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                UUID:{" "}
                <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                  {selectedItem.uuid}
                </span>
              </Typography>
            </Box>
          )}
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
                Suspending...
              </>
            ) : (
              "Suspend"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={restoreDialogOpen}
        onClose={() => setRestoreDialogOpen(false)}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#16a34a",
            mb: 5,
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Confirm Restore Agreement Full
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
            Are you sure you want to restore this agreement?
          </Typography>
          {selectedItem && (
            <Box>
              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                Claim Internal ID:{" "}
                <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                  {selectedItem.claim?.claim_internal_id || "-"}
                </span>
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                Customers:{" "}
                <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                  {Array.isArray(selectedItem.claim?.customers)
                    ? selectedItem.claim.customers
                        .map(
                          (customer) => `${customer.name} ${customer.last_name}`
                        )
                        .join(", ")
                    : selectedItem.claim?.customers || "-"}
                </span>
              </Typography>

              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                UUID:{" "}
                <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                  {selectedItem.uuid}
                </span>
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestoreDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleRestoreConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Restoring...
              </>
            ) : (
              "Restore"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default ClaimAgreementFullList;
