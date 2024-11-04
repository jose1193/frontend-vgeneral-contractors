"use client";

import React, { useState } from "react";
import { DocumentTemplateAllianceData } from "../../../app/types/document-template-alliance";
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
  Snackbar,
  Typography,
  CircularProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import Alert from "@mui/material/Alert";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import useFormSnackbar from "../../hooks/useFormSnackbar";
import { useListPermissions } from "../../hooks/useListPermissions";
import { PERMISSIONS } from "../../config/permissions";

interface DocumentTemplateAllianceListProps {
  documentTemplates: DocumentTemplateAllianceData[];
  onDelete: (uuid: string) => Promise<void>;
}

export default function DocumentTemplateAllianceList({
  documentTemplates,
  onDelete,
}: DocumentTemplateAllianceListProps) {
  const theme = useTheme();
  const { canModifyList, can } = useListPermissions();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] =
    useState<DocumentTemplateAllianceData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { snackbar, setSnackbar, handleSnackbarClose } = useFormSnackbar();

  const listConfig = {
    permission: PERMISSIONS.MANAGE_DOCUMENTS,
    restrictedRoles: ["Salesperson"],
  };

  const handleDeleteClick = (row: any) => {
    const template = documentTemplates.find((t) => t.uuid === row.id);
    if (template) {
      setTemplateToDelete(template);
      setDeleteDialogOpen(true);
    }
  };

  const handleDownload = (template_path_alliance: string) => {
    window.open(template_path_alliance, "_blank");
  };

  const handleDeleteConfirm = async () => {
    if (templateToDelete?.uuid) {
      setIsSubmitting(true);
      try {
        await onDelete(templateToDelete.uuid);
        setDeleteDialogOpen(false);
        setSnackbar({
          open: true,
          message: "Document template alliance deleted successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to delete document template alliance",
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
      headerName: "Template Name",
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
      field: "type",
      headerName: "Document Type",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lastModified",
      headerName: "Last Modified",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
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
          {can(PERMISSIONS.MANAGE_DOCUMENTS) && (
            <Button
              component={Link}
              href={`/dashboard/document-template-alliances/${params.row.id}`}
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

          {canModifyList(listConfig) && (
            <Button
              component={Link}
              href={`/dashboard/document-template-alliances/${params.row.id}/edit`}
              size="small"
              variant="contained"
              color="warning"
              sx={{ minWidth: "unset", padding: "8px 12px" }}
            >
              <EditIcon fontSize="small" />
            </Button>
          )}

          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={() => handleDownload(params.row.template_path_alliance)}
            sx={{ minWidth: "unset", padding: "8px 12px" }}
          >
            <DownloadIcon fontSize="small" />
          </Button>

          {canModifyList(listConfig) && (
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => handleDeleteClick(params.row)}
              sx={{ minWidth: "unset", padding: "8px 12px" }}
            >
              <DeleteIcon fontSize="small" />
            </Button>
          )}
        </Box>
      ),
    },
  ];

  const rows = documentTemplates.map((template) => ({
    id: template.uuid,
    name: template.template_name_alliance,
    description: template.template_description_alliance,
    type: template.template_type_alliance,
    lastModified: template.updated_at
      ? new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(new Date(template.updated_at))
      : "Date not available",
    template_path_alliance: template.template_path_alliance,
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
            Are you sure you want to delete this document template?
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              textAlign: "left",
              mb: 2,
            }}
          >
            Template Name:
            <span style={{ fontWeight: "bold", marginLeft: 10 }}>
              {templateToDelete?.template_name_alliance}
            </span>
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              textAlign: "left",
            }}
          >
            Document Type:
            <span style={{ fontWeight: "bold", marginLeft: 10 }}>
              {templateToDelete?.template_type_alliance}
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
