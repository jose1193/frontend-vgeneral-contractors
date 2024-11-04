"use client";

import React, { useState } from "react";
import { CompanySignatureData } from "../../../app/types/company-signature";
import Link from "next/link";
import Image from "next/image";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Typography,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Alert from "@mui/material/Alert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useTheme } from "@mui/material/styles";
import { withRoleProtection } from "../withRoleProtection";
import usePhoneFormatter from "../../hooks/usePhoneFormatter ";

import { PERMISSIONS } from "../../../src/config/permissions";
interface CompanySignaturesListProps {
  companySignatures: CompanySignatureData[];
  onDelete: (uuid: string) => void;
}

function Component({
  companySignatures,
  onDelete,
}: CompanySignaturesListProps) {
  const theme = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companySignatureToDelete, setCompanySignatureToDelete] =
    useState<CompanySignatureData | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleDeleteClick = (companySignature: CompanySignatureData) => {
    setCompanySignatureToDelete(companySignature);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (companySignatureToDelete && companySignatureToDelete.uuid) {
      setIsSubmitting(true);
      try {
        await onDelete(companySignatureToDelete.uuid);
        setDeleteDialogOpen(false);
        setSnackbar({
          open: true,
          message: "Company signature deleted successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to delete company signature",
          severity: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Hook Format Phone
  const formatPhoneNumber = usePhoneFormatter();

  const columns: GridColDef[] = [
    {
      field: "company_name",
      headerName: "Company",
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => formatPhoneNumber(params.value),
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "address",
      headerName: "Address",
      width: 220,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "signature_path",
      headerName: "Signature",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ width: 100, height: 50, position: "relative" }}>
          <Image
            src={params.value || "/placeholder.svg"}
            alt="Signature"
            layout="fill"
            objectFit="contain"
          />
        </Box>
      ),
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
          }}
        >
          <Link
            href={`/dashboard/company-signature/${params.row.uuid}`}
            passHref
          >
            <Button
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
          </Link>
          <Link
            href={`/dashboard/company-signature/${params.row.uuid}/edit`}
            passHref
          >
            <Button
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
          </Link>
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
        </Box>
      ),
    },
  ];

  const rows = companySignatures.map((companySignature) => ({
    uuid: companySignature.uuid,
    company_name: companySignature.company_name,
    phone: companySignature.phone,
    email: companySignature.email,
    address: companySignature.address,
    signature_path: companySignature.signature_path,
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
              getRowId={(row) => row.uuid}
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
            Are you sure you want to delete this company signature?
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
              {companySignatureToDelete?.company_name}
            </span>
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              textAlign: "left",
              mb: 2,
            }}
          >
            Address:
            <span style={{ fontWeight: "bold", marginLeft: 10 }}>
              {companySignatureToDelete?.address}
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
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Configuración de protección basada en permisos
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

export default withRoleProtection(Component, protectionConfig);
