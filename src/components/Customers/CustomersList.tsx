// src/components/Customers/CustomersList.tsx

"use client";

import React, { useState } from "react";
import { CustomerData } from "../../../app/types/customer";
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
  Chip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import Alert from "@mui/material/Alert";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import useFormSnackbar from "../../hooks/useFormSnackbar";

interface CustomerListProps {
  customers: CustomerData[];
  onDelete: (uuid: string) => void;
  onRestore: (uuid: string) => void;
  userRole: string | undefined;
}

const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  onDelete,
  onRestore,
  userRole,
}) => {
  const theme = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [customerToAction, setCustomerToAction] = useState<CustomerData | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { snackbar, setSnackbar, handleSnackbarClose } = useFormSnackbar();

  const handleDeleteClick = (customer: CustomerData) => {
    setCustomerToAction(customer);
    setDeleteDialogOpen(true);
  };

  const handleRestoreClick = (customer: CustomerData) => {
    setCustomerToAction(customer);
    setRestoreDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (customerToAction?.uuid) {
      setIsSubmitting(true);
      try {
        await onDelete(customerToAction.uuid);
        setDeleteDialogOpen(false);
        setSnackbar({
          open: true,
          message: "Customer suspended successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to suspend customer",
          severity: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRestoreConfirm = async () => {
    if (customerToAction?.uuid) {
      setIsSubmitting(true);
      try {
        await onRestore(customerToAction.uuid);
        setRestoreDialogOpen(false);
        setSnackbar({
          open: true,
          message: "Customer restored successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to restore customer",
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
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "last_name",
      headerName: "Last Name",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "cell_phone",
      headerName: "Cell Phone",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "home_phone",
      headerName: "Home Phone",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "occupation",
      headerName: "Occupation",
      width: 150,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "status",
      headerName: "Status",
      width: 120,
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
          }}
        >
          <Link href={`/dashboard/customers/${params.row.uuid}`} passHref>
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
          <Link href={`/dashboard/customers/${params.row.uuid}/edit`} passHref>
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
          {params.row.status === "Available" &&
            userRole !== "Salesperson" && ( // Add this condition
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
          {params.row.status === "Suspended" && (
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => handleRestoreClick(params.row)}
              sx={{
                minWidth: "unset",
                padding: "8px 12px",
              }}
            >
              <RestoreIcon fontSize="small" />
            </Button>
          )}
        </Box>
      ),
    },
  ];

  const rows = customers.map((customer) => ({
    id: customer.uuid,
    uuid: customer.uuid,
    name: customer.name,
    last_name: customer.last_name,
    email: customer.email,
    cell_phone: customer.cell_phone,
    home_phone: customer.home_phone,
    occupation: customer.occupation,
    status: customer.deleted_at ? "Suspended" : "Available",
    signature: customer.signature_customer?.signature_data ? true : false,
  }));

  return (
    <Box
      component="section"
      sx={{
        flexGrow: 1,
        pr: { xs: 2, sm: 3, md: 4 },
        pl: { xs: 1, sm: 2, md: 3 },
        py: { xs: 2, sm: 3, md: 4 },
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
            Are you sure you want to suspend this customer?
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
              {customerToAction?.name} {customerToAction?.last_name}
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
              {customerToAction?.email}
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
          Confirm Restore Customer
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
            Are you sure you want to restore this customer?
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
              {customerToAction?.name} {customerToAction?.last_name}
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
              {customerToAction?.email}
            </span>
          </Typography>
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

export default CustomerList;
