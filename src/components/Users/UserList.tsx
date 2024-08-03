// src/components/Users/UsersList.tsx

"use client";

import React, { useState } from "react";
import { UserData } from "../../../app/types/user";
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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import RestoreIcon from "@mui/icons-material/Restore";

import { withRoleProtection } from "../withRoleProtection";
interface UsersListProps {
  users: UserData[];
  onDelete: (uuid: string) => void;
  onRestore: (uuid: string) => void;
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  onDelete,
  onRestore,
}) => {
  const theme = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogOpenRestore, setDeleteDialogOpenRestore] = useState(false);

  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleRestoreClick = (user: any) => {
    setUserToDelete(user);
    setDeleteDialogOpenRestore(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await onDelete(userToDelete.uuid);
      setDeleteDialogOpen(false);
      setSnackbar({
        open: true,
        message: "User deleted successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete user",
        severity: "error",
      });
    }
  };

  const handleDeleteConfirmRestore = async () => {
    try {
      await onRestore(userToDelete.uuid);
      setDeleteDialogOpenRestore(false);
      setSnackbar({
        open: true,
        message: "User restored successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete user",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const IconButtonStyled = ({ color, onClick, children }: any) => (
    <IconButton
      sx={{
        padding: "8px",
        borderRadius: "50%",
        "&:hover": {},
        marginRight: "8px",
      }}
      onClick={onClick}
    >
      {children}
    </IconButton>
  );
  const columns: GridColDef[] = [
    { field: "user_role", headerName: "Role", width: 150 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "last_name", headerName: "Last Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },

    { field: "country", headerName: "Country", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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

  const rows = users.map((user) => ({
    user_role: user.user_role,
    id: user.uuid,
    uuid: user.uuid,
    name: user.name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    country: user.country,
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
              {userToDelete?.name}
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
              {" "}
              {userToDelete?.email}
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
            Are you sure you want to Restore this user?
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
              {userToDelete?.name}
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
              {" "}
              {userToDelete?.email}
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
            Delete
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

export default withRoleProtection(UsersList, ["Super Admin", "Admin"]);
