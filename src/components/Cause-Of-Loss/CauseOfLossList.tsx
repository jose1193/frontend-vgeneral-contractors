"use client";

import React, { useState } from "react";
import { CauseOfLossData } from "../../../app/types/cause-of-loss";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import { useListPermissions } from "../../hooks/useListPermissions";
import { PERMISSIONS } from "../../config/permissions";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";

interface CauseOfLossListProps {
  causeOfLosses: CauseOfLossData[];
  onDelete: (uuid: string) => void;
  userRole: string | undefined;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

const CauseOfLossList: React.FC<CauseOfLossListProps> = ({
  causeOfLosses,
  onDelete,
  userRole,
}) => {
  const theme = useTheme();
  const { canModifyList, can } = useListPermissions();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [causeToDelete, setCauseToDelete] = useState<CauseOfLossData | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const listConfig = {
    permission: PERMISSIONS.MANAGE_CONFIG,
    restrictedRoles: ["Salesperson"],
  };

  const handleDeleteClick = (row: any) => {
    const cause = causeOfLosses.find((c) => c.uuid === row.uuid);
    if (cause) {
      setCauseToDelete(cause);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (causeToDelete?.uuid) {
      setIsSubmitting(true);
      try {
        await onDelete(causeToDelete.uuid);
        setDeleteDialogOpen(false);
        setSnackbar({
          open: true,
          message: "Cause of loss deleted successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to delete cause of loss",
          severity: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 2,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
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
            padding: "8px 0",
            "& .MuiButton-root": {
              height: "35px",
            },
          }}
        >
          {can(PERMISSIONS.MANAGE_CONFIG) && (
            <Button
              component={Link}
              href={`/dashboard/cause-of-losses/${params.row.uuid}`}
              size="small"
              variant="contained"
              sx={{
                minWidth: "unset",
                padding: "8px 12px",
                backgroundColor: "#2563eb",
                "&:hover": { backgroundColor: "#3b82f6" },
              }}
            >
              <VisibilityIcon fontSize="small" />
            </Button>
          )}

          <Button
            component={Link}
            href={`/dashboard/cause-of-losses/${params.row.uuid}/edit`}
            size="small"
            variant="contained"
            color="warning"
            sx={{
              minWidth: "unset",
              padding: "8px 12px",
            }}
          >
            <EditIcon fontSize="small" />
          </Button>

          {canModifyList(listConfig) && (
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => handleDeleteClick(params.row)}
              sx={{
                minWidth: "unset",
                padding: "8px 12px",
              }}
            >
              <DeleteIcon fontSize="small" />
            </Button>
          )}
        </Box>
      ),
    },
  ];

  const rows = causeOfLosses.map((cause) => ({
    id: cause.uuid,
    uuid: cause.uuid,
    name: cause.cause_loss_name,
    description: cause.description,
  }));

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: { xs: 1, sm: 2, md: 2, lg: 2 },
        maxWidth: {
          xs: "420px", // Por defecto en móviles
          sm: "540px", // ~576px
          md: "720px", // ~768px
          lg: "1120px", // ~1024px+
        },
        mx: "auto", // Para centrar el contenedor
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
              rows={rows}
              columns={columns}
              slots={{ toolbar: GridToolbar }}
              checkboxSelection
              disableRowSelectionOnClick
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
            Are you sure you want to delete this cause of loss?
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              textAlign: "left",
              mb: 2,
            }}
          >
            Name:
            <span style={{ fontWeight: "bold", marginLeft: 10 }}>
              {causeToDelete?.cause_loss_name}
            </span>
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              textAlign: "left",
            }}
          >
            Description:
            <span style={{ fontWeight: "bold", marginLeft: 10 }}>
              {causeToDelete?.description}
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

export default CauseOfLossList;
