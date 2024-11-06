// src/components/Zones/ZoneList.tsx
"use client";

import React, { useState } from "react";
import { ZoneData } from "../../../app/types/zone";
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
import Tooltip from "@mui/material/Tooltip";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";
import ButtonCreate from "../../../app/components/ButtonCreate";
import { PERMISSIONS } from "../../../src/config/permissions";
import { useListPermissions } from "../../../src/hooks/useListPermissions";
interface ZoneListProps {
  zones: ZoneData[];
  onDelete: (uuid: string) => void;
  onRestore: (uuid: string) => void;
  userRole: string | undefined;
  loading: boolean;
  error: string | null;
}

const ZoneList: React.FC<ZoneListProps> = ({
  zones,
  onDelete,
  onRestore,
  userRole,
  loading,
  error,
}) => {
  const theme = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [zoneToAction, setZoneToAction] = useState<ZoneData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { snackbar, setSnackbar, handleSnackbarClose } = useFormSnackbar();
  const { canModifyList } = useListPermissions();
  const handleDeleteClick = (zone: ZoneData) => {
    setZoneToAction(zone);
    setDeleteDialogOpen(true);
  };

  const handleRestoreClick = (zone: ZoneData) => {
    setZoneToAction(zone);
    setRestoreDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (zoneToAction?.uuid) {
      setIsSubmitting(true);
      try {
        await onDelete(zoneToAction.uuid);
        setDeleteDialogOpen(false);
        setSnackbar({
          open: true,
          message: "Zone deleted successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to delete zone",
          severity: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRestoreConfirm = async () => {
    if (zoneToAction?.uuid) {
      setIsSubmitting(true);
      try {
        await onRestore(zoneToAction.uuid);
        setRestoreDialogOpen(false);
        setSnackbar({
          open: true,
          message: "Zone restored successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to restore zone",
          severity: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  const columns: GridColDef[] = [
    {
      field: "zone_name",
      headerName: "Name",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "zone_type",
      headerName: "Type",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Chip
          label={capitalizeFirstLetter(params.value || "interior")}
          color={params.value === "exterior" ? "primary" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "code",
      headerName: "Code",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
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
          size="small"
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
          <Link href={`/dashboard/zones/${params.row.uuid}`} passHref>
            <Tooltip title="View Details">
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
            </Tooltip>
          </Link>
          <Link href={`/dashboard/zones/${params.row.uuid}/edit`} passHref>
            <Tooltip title="Edit Zone">
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
            </Tooltip>
          </Link>
          {params.row.status === "Active" && userRole !== "Salesperson" && (
            <Tooltip title="Delete Zone">
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
            </Tooltip>
          )}
          {params.row.status === "Suspended" && (
            <Tooltip title="Restore Zone">
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
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  const rows = zones.map((zone) => ({
    id: zone.uuid,
    uuid: zone.uuid,
    zone_name: zone.zone_name,
    zone_type: zone.zone_type,
    code: zone.code,
    description: zone.description,
    status: zone.deleted_at ? "Suspended" : "Active",
  }));
  const listConfig = {
    permission: PERMISSIONS.MANAGE_CONFIG,
    restrictedRoles: ["Salesperson"],
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: { xs: 1, sm: 2, md: 2, lg: 2 },
        maxWidth: {
          xs: "420px",
          sm: "540px",
          md: "720px",
          lg: "1120px",
        },
        mx: "auto",
      }}
    >
      {canModifyList(listConfig) && (
        <Link href="/dashboard/zones/create" passHref>
          <ButtonCreate>Create Zone</ButtonCreate>
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
              loading={loading}
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
            Are you sure you want to delete this zone?
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
              {zoneToAction?.zone_name}
            </span>
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              textAlign: "left",
            }}
          >
            Code:
            <span style={{ fontWeight: "bold", marginLeft: 10 }}>
              {zoneToAction?.code}
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
          Confirm Restore Zone
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
            Are you sure you want to restore this zone?
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
              {zoneToAction?.zone_name}
            </span>
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              textAlign: "left",
            }}
          >
            Code:
            <span style={{ fontWeight: "bold", marginLeft: 10 }}>
              {zoneToAction?.code}
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

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
};

export default ZoneList;
