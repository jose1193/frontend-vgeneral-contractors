// src/components/typeDamages/TypeDamagesList.tsx

"use client";

import React, { useState } from "react";
import { TypeDamageData } from "../../../app/types/type-damage";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import { withRoleProtection } from "../withRoleProtection";
interface TypeDamagesListProps {
  typeDamages: TypeDamageData[];
  onDelete: (uuid: string) => void;
}

const TypeDamagesList: React.FC<TypeDamagesListProps> = ({
  typeDamages,
  onDelete,
}) => {
  const theme = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [typeDamageToDelete, setTypeDamageToDelete] =
    useState<TypeDamageData | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleDeleteClick = (typeDamage: TypeDamageData) => {
    setTypeDamageToDelete(typeDamage);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (typeDamageToDelete && typeDamageToDelete.uuid) {
      try {
        await onDelete(typeDamageToDelete.uuid);
        setDeleteDialogOpen(false);
        setSnackbar({
          open: true,
          message: "Type damage deleted successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to delete type damage",
          severity: "error",
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns: GridColDef[] = [
    { field: "type_damage_name", headerName: "Name", width: 250 },
    { field: "description", headerName: "Description", width: 400 },
    { field: "created_at", headerName: "Created At", width: 200 },

    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Link
              href={`/dashboard/type-damages/${params.row.uuid}/edit`}
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
        </>
      ),
    },
  ];

  const rows = typeDamages.map((typeDamage) => ({
    uuid: typeDamage.uuid,
    type_damage_name: typeDamage.type_damage_name,
    description: typeDamage.description,
    created_at: typeDamage.created_at,
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
            Are you sure you want to delete this type damage?
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
              {typeDamageToDelete?.type_damage_name}
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
            Description:
            <span style={{ fontWeight: "bold", marginLeft: 10 }}>
              {typeDamageToDelete?.description}
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
export default withRoleProtection(TypeDamagesList, ["Super Admin"]);
