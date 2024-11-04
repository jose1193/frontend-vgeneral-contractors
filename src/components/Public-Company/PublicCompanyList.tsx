"use client";

import React, { useState } from "react";
import { PublicCompanyData } from "../../../app/types/public-company";
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
import Alert from "@mui/material/Alert";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import useFormSnackbar from "../../hooks/useFormSnackbar";
import usePhoneFormatter from "../../hooks/usePhoneFormatter ";
import { useListPermissions } from "../../hooks/useListPermissions";
import { PERMISSIONS } from "../../config/permissions";

interface PublicCompanyListProps {
  publicCompanies: PublicCompanyData[];
  onDelete: (uuid: string) => void;
  userRole: string | undefined;
}

const PublicCompanyList: React.FC<PublicCompanyListProps> = ({
  publicCompanies,
  onDelete,
  userRole,
}) => {
  const theme = useTheme();
  const { canModifyList, can } = useListPermissions();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] =
    useState<PublicCompanyData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { snackbar, setSnackbar, handleSnackbarClose } = useFormSnackbar();
  const formatPhoneNumber = usePhoneFormatter();

  const listConfig = {
    permission: PERMISSIONS.MANAGE_COMPANIES,
    restrictedRoles: ["Salesperson"],
  };

  const handleDeleteClick = (row: any) => {
    const company = publicCompanies.find((c) => c.uuid === row.uuid);
    if (company) {
      setCompanyToDelete(company);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (companyToDelete?.uuid) {
      setIsSubmitting(true);
      try {
        await onDelete(companyToDelete.uuid);
        setDeleteDialogOpen(false);
        setSnackbar({
          open: true,
          message: "Public company deleted successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to delete public company",
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
      field: "email",
      headerName: "Email",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => formatPhoneNumber(params.value),
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
          {/* View button - always visible for users with permission */}
          {can(PERMISSIONS.MANAGE_COMPANIES) && (
            <Button
              component={Link}
              href={`/dashboard/public-companies/${params.row.uuid}`}
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
            href={`/dashboard/public-companies/${params.row.uuid}/edit`}
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
            <>
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
            </>
          )}
        </Box>
      ),
    },
  ];

  const rows = publicCompanies.map((company) => ({
    id: company.uuid,
    uuid: company.uuid,
    name: company.public_company_name,
    email: company.email,
    phone: company.phone,
    address: company.address,
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
            Are you sure you want to delete this public company?
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
              {companyToDelete?.public_company_name}
            </span>
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              textAlign: "left",
            }}
          >
            Email:
            <span style={{ fontWeight: "bold", marginLeft: 10 }}>
              {companyToDelete?.email}
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
};

export default PublicCompanyList;
