// src/components/Users/UsersList.tsx

"use client";

import React, { useState } from "react";
import { UserData } from "../../../app/types/user";
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
  Chip,
  CircularProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import Alert from "@mui/material/Alert";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import { withRoleProtection } from "../withRoleProtection";
import usePhoneFormatter from "../../hooks/usePhoneFormatter ";
import { PERMISSIONS } from "../../../src/config/permissions";
interface UsersListProps {
  users: UserData[];
  onDelete: (uuid: string) => Promise<void>;
  onRestore: (uuid: string) => Promise<void>;
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  onDelete,
  onRestore,
}) => {
  const theme = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [userToAction, setUserToAction] = useState<UserData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleDeleteClick = (user: UserData) => {
    setUserToAction(user);
    setDeleteDialogOpen(true);
  };

  const handleRestoreClick = (user: UserData) => {
    setUserToAction(user);
    setRestoreDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToAction?.uuid) {
      setIsSubmitting(true);
      try {
        await onDelete(userToAction.uuid);
        setDeleteDialogOpen(false);
        setSnackbar({
          open: true,
          message: "User suspended successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to suspend user",
          severity: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRestoreConfirm = async () => {
    if (userToAction?.uuid) {
      setIsSubmitting(true);
      try {
        await onRestore(userToAction.uuid);
        setRestoreDialogOpen(false);
        setSnackbar({
          open: true,
          message: "User restored successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to restore user",
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
      field: "username",
      headerName: "Username",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "email",
      headerName: "Email",
      width: 220,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => formatPhoneNumber(params.value),
    },
    {
      field: "user_role",
      headerName: "Role",
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
          color={params.value === "Active" ? "success" : "error"}
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
          <Link href={`/dashboard/users/${params.row.uuid}`} passHref>
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
          <Link href={`/dashboard/users/${params.row.uuid}/edit`} passHref>
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
          {params.row.status === "Active" && (
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

  const rows = users.map((user) => ({
    user_role: user.user_role,
    username: user.username,
    id: user.uuid,
    uuid: user.uuid,
    name: `${user.name || ""} ${user.last_name || ""}`.trim(),
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    state: user.state,
    country: user.country,
    status: user.deleted_at ? "Suspended" : "Active",
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
            Are you sure you want to suspend this user?
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
              {userToAction?.name} {userToAction?.last_name}
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
              {userToAction?.email}
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
          Confirm Restore User
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
            Are you sure you want to restore this user?
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
              {userToAction?.name} {userToAction?.last_name}
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
              {userToAction?.email}
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
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

export default withRoleProtection(UsersList, protectionConfig);
