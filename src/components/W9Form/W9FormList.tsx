"use client";

import React, { useState } from "react";
import { W9FormData } from "../../../app/types/w9form";
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import DownloadIcon from "@mui/icons-material/Download";
import { useRouter } from "next/navigation";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";

interface W9FormListProps {
  items: W9FormData[];
  onDelete: (uuid: string) => Promise<void>;
  onRestore: (uuid: string) => Promise<void>;
  userRole?: string;
}

const W9FormList: React.FC<W9FormListProps> = ({
  items,
  onDelete,
  onRestore,
  userRole,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<W9FormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const handleView = (uuid: string) => {
    router.push(`/dashboard/w9forms/${uuid}`);
  };

  const handleDownload = (documentPath: string) => {
    if (documentPath) {
      window.open(documentPath, "_blank");
    } else {
      setSnackbar({
        open: true,
        message: "Document not found",
        severity: "error",
      });
    }
  };

  const handleEdit = (uuid: string) => {
    router.push(`/dashboard/w9forms/${uuid}/edit`);
  };

  const handleDeleteClick = (item: W9FormData) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleRestoreClick = (item: W9FormData) => {
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
          message: "W9Form suspended successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to suspend W9Form",
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
          message: "W9Form restored successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to restore W9Form",
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
      field: "name",
      headerName: "Full Name",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "business_name",
      headerName: "Business Name",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "state",
      headerName: "State",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "recordStatus",
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
          label="View"
          onClick={() => handleView(params.row.uuid)}
          showInMenu
        />,
        <GridActionsCellItem
          key="download"
          icon={<DownloadIcon sx={{ color: "#6366f1" }} />}
          label="Download"
          onClick={() => handleDownload(params.row.document_path)}
          showInMenu
        />,
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon sx={{ color: "#10b981" }} />}
          label="Edit"
          onClick={() => handleEdit(params.row.uuid)}
          showInMenu
        />,
        ...(params.row.recordStatus === "Available"
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
        ...(params.row.recordStatus === "Suspended"
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
                id: item.uuid,
                uuid: item.uuid,
                name: item.name,
                business_name: item.business_name,
                address: item.address,
                city: item.city,
                state: item.state,
                document_path: item.document_path,
                status: item.status,
                recordStatus: item.deleted_at ? "Suspended" : "Available",
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
            Are you sure you want to suspend this W9 Form?
          </Typography>
          {selectedItem && (
            <Box>
              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                Name:{" "}
                <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                  {selectedItem.name}
                </span>
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                Business Name:{" "}
                <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                  {selectedItem.business_name}
                </span>
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                Address:{" "}
                <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                  {selectedItem.address}
                </span>
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                City:{" "}
                <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                  {selectedItem.city}
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
          Confirm Restore Form
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
            Are you sure you want to restore this W9 Form?
          </Typography>
          {selectedItem && (
            <Box>
              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                Name:{" "}
                <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                  {selectedItem.name}
                </span>
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                Business Name:{" "}
                <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                  {selectedItem.business_name}
                </span>
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                Address:{" "}
                <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                  {selectedItem.address}
                </span>
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                City:{" "}
                <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                  {selectedItem.city}
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

export default W9FormList;
