// src/components/Claims/ClaimsList.tsx

"use client";

import React, { useState } from "react";
import { ClaimsData } from "../../../app/types/claims";
import Link from "next/link";
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
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RestoreIcon from "@mui/icons-material/Restore";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import { withRoleProtection } from "../withRoleProtection";

// Define the new Claims interface
interface ClaimsListProps {
  claims: ClaimsData[];
  onDelete: (uuid: string) => void;
  onRestore: (uuid: string) => void;
}

const ClaimsList: React.FC<ClaimsListProps> = ({
  claims,
  onDelete,
  onRestore,
}) => {
  const theme = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogOpenRestore, setDeleteDialogOpenRestore] = useState(false);
  const [claimToDelete, setClaimToDelete] = useState<ClaimsData | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleDeleteClick = (claim: ClaimsData) => {
    setClaimToDelete(claim);
    setDeleteDialogOpen(true);
  };

  const handleRestoreClick = (claim: any) => {
    setClaimToDelete(claim);
    setDeleteDialogOpenRestore(true);
  };
  const handleDeleteConfirm = async () => {
    if (claimToDelete && claimToDelete.uuid) {
      try {
        await onDelete(claimToDelete.uuid);
        setDeleteDialogOpen(false);
        setSnackbar({
          open: true,
          message: "Claim deleted successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to delete claim",
          severity: "error",
        });
      }
    }
  };

  const handleDeleteConfirmRestore = async () => {
    if (claimToDelete && claimToDelete.uuid) {
      try {
        await onRestore(claimToDelete.uuid);
        setDeleteDialogOpenRestore(false);
        setSnackbar({
          open: true,
          message: "Claim restored successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to delete claim",
          severity: "error",
        });
      }
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns: GridColDef[] = [
    {
      field: "claim_internal_id",
      headerName: "Claim Internal",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "policy_number",
      headerName: "Policy Number",
      width: 170,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "type_damage",
      headerName: "Type Damage",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "property",
      headerName: "Property",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "customers",
      headerName: "Customers",
      width: 220,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "date_of_loss",
      headerName: "Date of Loss",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "claim_status",
      headerName: "Status",
      width: 130,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        let color:
          | "default"
          | "primary"
          | "secondary"
          | "error"
          | "info"
          | "success"
          | "warning";
        let label;
        switch (params.value) {
          case "Completed":
            color = "success";
            label = "Completed";
            break;
          case "In Progress":
            color = "primary";
            label = "In Progress";
            break;
          case "Pending":
            color = "default";
            label = "Pending";
            break;
          default:
            color = "default";
            label = params.value;
        }
        return <Chip label={label} color={color} />;
      },
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 200,
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
        <>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Link href={`/dashboard/claims/${params.row.uuid}`} passHref>
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
            <Link href={`/dashboard/claims/${params.row.uuid}/edit`} passHref>
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
          </Box>
        </>
      ),
    },
  ];

  const rows = claims.map((claim) => ({
    uuid: claim.uuid,
    claim_internal_id: claim.claim_internal_id,
    property: claim.property,
    policy_number: claim.policy_number,
    type_damage: claim.type_damage,
    customers: Array.isArray(claim.customers)
      ? claim.customers
          .map((customer) => `${customer.name} ${customer.last_name}`)
          .join(", ")
      : claim.customers || "",

    date_of_loss: claim.date_of_loss,

    claim_status: claim.claim_status,
    created_at: claim.created_at,
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
            Are you sure you want to delete this claim?
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              textAlign: "left",
              mb: 2,
            }}
          >
            Claim Internal ID:
            <span style={{ fontWeight: "bold", marginLeft: 10 }}>
              {claimToDelete?.claim_internal_id}
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
            Policy Number:
            <span style={{ fontWeight: "bold", marginLeft: 10 }}>
              {claimToDelete?.policy_number}
            </span>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleDeleteConfirm}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpenRestore}
        onClose={() => setDeleteDialogOpenRestore(false)}
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
          Confirm Restore Claim
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
            Are you sure you want to Restore this Claim?
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              textAlign: "left",
              mb: 2,
            }}
          >
            Claim Internal ID:
            <span style={{ fontWeight: "bold", marginLeft: 10 }}>
              {claimToDelete?.claim_internal_id}
            </span>
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              textAlign: "left",
            }}
          >
            Policy Number:
            <span style={{ fontWeight: "bold", marginLeft: 10 }}>
              {" "}
              {claimToDelete?.policy_number}
            </span>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpenRestore(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteConfirmRestore}
            color="success"
          >
            Restore
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
};

export default withRoleProtection(ClaimsList, ["Super Admin"]);
