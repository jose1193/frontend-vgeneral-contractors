"use client";

import React, { useState, useEffect } from "react";
import { SalesPersonSignatureData } from "../../../app/types/salesperson-signature";
import { UserData } from "../../../app/types/user";
import Link from "next/link";
import Image from "next/image";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  Grid,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Typography,
  CircularProgress,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import ButtonCreate from "../../../app/components/ButtonCreate";

interface SalesPersonSignatureListProps {
  signatures: SalesPersonSignatureData[];
  onDelete: (uuid: string) => Promise<void>;
  userRole?: string;
}

const SalesPersonSignatureList: React.FC<SalesPersonSignatureListProps> = ({
  signatures,
  onDelete,
  userRole,
}) => {
  const theme = useTheme();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [signatureToDelete, setSignatureToDelete] =
    useState<SalesPersonSignatureData | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [userHasSignature, setUserHasSignature] = useState(false);

  useEffect(() => {
    if (userRole === "Salesperson" && userId) {
      const hasSignature = signatures.some(
        (sig) => sig.salesperson_id?.toString() === userId.toString()
      );
      setUserHasSignature(hasSignature);
    }
  }, [signatures, userRole, userId]);

  const handleDeleteClick = (signature: SalesPersonSignatureData) => {
    setSignatureToDelete(signature);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (signatureToDelete && signatureToDelete.uuid) {
      setIsDeleting(true);
      try {
        await onDelete(signatureToDelete.uuid);
        setDeleteDialogOpen(false);
        setSnackbar({
          open: true,
          message: "Salesperson signature deleted successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to delete salesperson signature",
          severity: "error",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderUserCell = (user: UserData | undefined) => {
    if (!user) return "-";
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          mt: 1.5,
        }}
      >
        <Avatar sx={{ width: 24, height: 24 }}>{user.name[0]}</Avatar>
        <Typography>{`${user.name} ${user.last_name}`}</Typography>
      </Box>
    );
  };

  const columns: GridColDef[] = [
    {
      field: "salesPerson",
      headerName: "Sales Person",
      width: 200,
      headerAlign: "center",
      align: "center",

      renderCell: (params) => renderUserCell(params.value),
    },
    {
      field: "signature_path",
      headerName: "Signature",
      width: 150,
      headerAlign: "center",
      align: "center",

      renderCell: (params) => (
        <Image
          src={params.value}
          alt="Signature"
          width={100}
          height={50}
          style={{
            width: "auto",
            height: "auto",
            maxWidth: "100%",
            maxHeight: "50px",
          }}
        />
      ),
    },
    {
      field: "registeredBy",
      headerName: "Registered By",
      width: 200,
      headerAlign: "center",
      align: "center",

      renderCell: (params) => renderUserCell(params.value),
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      width: 200,
      headerAlign: "center",
      align: "center",
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
          {(userRole === "Super Admin" ||
            (userRole === "Salesperson" &&
              params.row.salesperson_id?.toString() ===
                userId?.toString())) && (
            <Link
              href={`/dashboard/salesperson-signature/${params.row.uuid}/edit`}
              passHref
            >
              <Button
                size="small"
                variant="contained"
                color="success"
                sx={{
                  minWidth: "unset",
                  padding: "8px 12px",
                }}
              >
                <EditIcon fontSize="small" />
              </Button>
            </Link>
          )}
          {userRole === "Super Admin" && (
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

  const rows = signatures.map((signature) => ({
    ...signature,
    id: signature.id || 0,
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
      {(userRole === "Super Admin" ||
        (userRole === "Salesperson" && !userHasSignature)) && (
        <Link href="/dashboard/salesperson-signature/create" passHref>
          <ButtonCreate sx={{ mt: -4, mb: 5 }}>Create Signature</ButtonCreate>
        </Link>
      )}
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

      {userRole === "Super Admin" && (
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
              Are you sure you want to delete this salesperson signature?
            </Typography>
            {signatureToDelete?.salesPerson && (
              <>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    textAlign: "left",
                    mb: 1,
                  }}
                >
                  Salesperson Name:
                  <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                    {`${signatureToDelete.salesPerson.name} ${signatureToDelete.salesPerson.last_name}`}
                  </span>
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    textAlign: "left",
                    mb: 1,
                  }}
                >
                  Salesperson Email:
                  <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                    {signatureToDelete.salesPerson.email}
                  </span>
                </Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleDeleteConfirm}
              color="error"
              disabled={isDeleting}
            >
              {isDeleting ? (
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
      )}

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

export default SalesPersonSignatureList;
