import React, { useState, useCallback, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import {
  Box,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Chip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";
import { ScopeSheetData } from "../../../app/types/scope-sheet";
import { useScopeSheetStore } from "../../../src/stores/scope-sheetStore";

interface ScopeSheetListProps {
  onDelete: (uuid: string) => Promise<void>;
  onRestore: (uuid: string) => Promise<void>;
  userRole?: string;
}

const ScopeSheetList: React.FC<ScopeSheetListProps> = ({
  onDelete,
  onRestore,
  userRole,
}) => {
  const { items, getFilteredItems } = useScopeSheetStore();
  const filteredItems = useMemo(() => getFilteredItems(), [getFilteredItems]);
  const router = useRouter();
  const theme = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ScopeSheetData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const handleView = useCallback(
    (uuid: string) => {
      router.push(`/dashboard/scope-sheets/${uuid}`);
    },
    [router]
  );

  const handleEdit = useCallback(
    (uuid: string) => {
      router.push(`/dashboard/scope-sheets/${uuid}/edit`);
    },
    [router]
  );

  const handleDeleteClick = useCallback((item: ScopeSheetData) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  }, []);

  const handleRestoreClick = useCallback((item: ScopeSheetData) => {
    setSelectedItem(item);
    setRestoreDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedItem?.uuid) return;

    setIsSubmitting(true);
    try {
      await onDelete(selectedItem.uuid);
      setDeleteDialogOpen(false);
      setSnackbar({
        open: true,
        message: "Scope Sheet suspended successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to suspend Scope Sheet",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
      setSelectedItem(null);
    }
  }, [selectedItem, onDelete]);

  const handleRestoreConfirm = useCallback(async () => {
    if (!selectedItem?.uuid) return;

    setIsSubmitting(true);
    try {
      await onRestore(selectedItem.uuid);
      setRestoreDialogOpen(false);
      setSnackbar({
        open: true,
        message: "Scope Sheet restored successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to restore Scope Sheet",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
      setSelectedItem(null);
    }
  }, [selectedItem, onRestore]);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "ID",
        flex: 1,
        minWidth: 150,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "claim_internal_id",
        headerName: "Claim Internal ID",
        flex: 1,
        minWidth: 150,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "scope_sheet_description",
        headerName: "Description",
        flex: 1,
        minWidth: 200,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "generated_by",
        headerName: "Generated By",
        flex: 1,
        minWidth: 150,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "status",
        headerName: "Status",
        width: 120,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          const isDeleted = params.row.deleted_at != null;
          return (
            <Chip
              label={isDeleted ? "Suspended" : "Available"}
              color={isDeleted ? "error" : "success"}
              variant="filled"
            />
          );
        },
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 150,
        getActions: (params) => {
          const isDeleted = params.row.deleted_at != null;
          return [
            <GridActionsCellItem
              key="view"
              icon={<VisibilityIcon sx={{ color: "#3b82f6" }} />}
              label="View"
              onClick={() => handleView(params.row.uuid)}
              showInMenu
            />,
            ...(isDeleted
              ? [
                  <GridActionsCellItem
                    key="restore"
                    icon={<RestoreIcon sx={{ color: "#f59e0b" }} />}
                    label="Restore"
                    onClick={() => handleRestoreClick(params.row)}
                    showInMenu
                  />,
                ]
              : userRole !== "Viewer"
              ? [
                  <GridActionsCellItem
                    key="delete"
                    icon={<DeleteIcon sx={{ color: "#ef4444" }} />}
                    label="Delete"
                    onClick={() => handleDeleteClick(params.row)}
                    showInMenu
                  />,
                ]
              : []),
          ];
        },
      },
    ],
    [handleView, handleDeleteClick, handleRestoreClick, userRole]
  );

  const rows = useMemo(
    () =>
      filteredItems.map((item: ScopeSheetData) => ({
        ...item,
        id: item.id,
        claim_internal_id: item.claim?.claim_internal_id || "",
        status: item.deleted_at ? "Suspended" : "Available",
      })),
    [filteredItems]
  );

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
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[5, 10, 25, 50]}
              disableRowSelectionOnClick
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
            Are you sure you want to suspend this scope sheet?
          </Typography>
          {selectedItem && (
            <>
              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  textAlign: "left",
                  mb: 2,
                }}
              >
                Uuid:
                <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                  {selectedItem.uuid}
                </span>
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  textAlign: "left",
                }}
              >
                Claim Internal ID:
                <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                  {selectedItem.claim?.claim_internal_id}
                </span>
              </Typography>
            </>
          )}
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
          Confirm Restore
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
            Are you sure you want to restore this Scope Sheet?
          </Typography>
          {selectedItem && (
            <>
              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  textAlign: "left",
                  mb: 2,
                }}
              >
                Uuid:
                <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                  {selectedItem.uuid}
                </span>
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  textAlign: "left",
                }}
              >
                Claim Internal ID:
                <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                  {selectedItem.claim?.claim_internal_id}
                </span>
              </Typography>
            </>
          )}
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

export default memo(ScopeSheetList);
