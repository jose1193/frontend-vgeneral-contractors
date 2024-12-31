// scripts/generators/generators/components.ts
import { promises as fs } from "fs";
import path from "path";
import { GeneratorConfig } from "../types";
import {
  toPascalCase,
  toKebabCase,
  toCamelCase,
  ensureDirectoryExists,
} from "../utils";

export async function generateComponents(config: GeneratorConfig) {
  const { name, fields, baseDir } = config;
  const componentDir = path.join(baseDir, "src/components", name);

  await ensureDirectoryExists(componentDir);

  // Generar Form
  const formContent = `"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Grid,
} from "@mui/material";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";
import { ${name}Data } from "../../../app/types/${toKebabCase(name)}";
import { ${name}Validation } from "../Validations/${toKebabCase(
    name
  )}Validation";

interface ${name}FormProps {
  initialData?: Partial<${name}Data>;
  onSubmit: (data: ${name}Data) => Promise<void>;
}

const ${name}Form: React.FC<${name}FormProps> = ({
  initialData,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<${name}Data>({
    defaultValues: initialData || {},
    resolver: yupResolver(${name}Validation),
    mode: "onChange",
  });

  const onSubmitHandler = async (data: ${name}Data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      setSnackbar({
        open: true,
        message: initialData ? "${name} updated successfully!" : "${name} created successfully!",
        severity: "success",
      });
      if (!initialData) {
        reset();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : "An unknown error occurred",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmitHandler)}
      noValidate
      sx={{ mt: 1 }}
    >
      <Grid container spacing={2}>
        ${fields
          .map(
            (field) => `
        <Grid item xs={12} sm={6}>
          <Controller
            name="${field.name}"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="${toPascalCase(field.name)}"
                fullWidth
                error={!!errors.${field.name}}
                helperText={errors.${field.name}?.message}
                ${field.required ? "required" : ""}
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>`
          )
          .join("\n        ")}
      </Grid>

      <Box sx={{ mt: 3, mb: 2 }}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting
            ? "Submitting..."
            : initialData
            ? "Update ${name}"
            : "Create ${name}"}
        </Button>
      </Box>

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default ${name}Form;`;

  // Generar List
  const listContent = `"use client";

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
  import { ${name}Data } from "../../../app/types/${toKebabCase(name)}";
  import { use${name}Store } from "../../../src/stores/${toKebabCase(name)}Store";
  
  interface ${name}ListProps {
    onDelete: (uuid: string) => Promise<void>;
    onRestore: (uuid: string) => Promise<void>;
    userRole?: string;
  }
  
  const ${name}List: React.FC<${name}ListProps> = ({
    onDelete,
    onRestore,
    userRole,
  }) => {
    const { items, getFilteredItems } = use${name}Store();
    const filteredItems = useMemo(() => getFilteredItems(), [items, getFilteredItems]);
    const router = useRouter();
    const theme = useTheme();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<${name}Data | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "success" as "success" | "error" | "info" | "warning",
    });
  
    const handleView = useCallback((uuid: string) => {
      router.push(\`/dashboard/${toKebabCase(name)}s/\${uuid}\`);
    }, [router]);
  
    const handleEdit = useCallback((uuid: string) => {
      router.push(\`/dashboard/${toKebabCase(name)}s/\${uuid}/edit\`);
    }, [router]);
  
    const handleDeleteClick = useCallback((item: ${name}Data) => {
      setSelectedItem(item);
      setDeleteDialogOpen(true);
    }, []);
  
    const handleRestoreClick = useCallback((item: ${name}Data) => {
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
          message: "${name} suspended successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to suspend ${name}",
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
          message: "${name} restored successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to restore ${name}",
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
  
    const columns: GridColDef[] = useMemo(() => [
      {
        field: "id",
        headerName: "ID",
        flex: 1,
        minWidth: 150,
        headerAlign: "center",
        align: "center",
      },
      ${fields.map(field => `{
        field: "${field.name}",
        headerName: "${toPascalCase(field.name)}",
        flex: 1,
        minWidth: 150,
        headerAlign: "center",
        align: "center",
      }`).join(',\n    ')},
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
            <GridActionsCellItem
              key="edit"
              icon={<EditIcon sx={{ color: "#10b981" }} />}
              label="Edit"
              onClick={() => handleEdit(params.row.uuid)}
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
    ], [handleView, handleEdit, handleDeleteClick, handleRestoreClick, userRole]);
  
    const rows = useMemo(() => 
      filteredItems.map((item: ${name}Data) => ({
        ...item,
        id: item.id,
        status: item.deleted_at ? "Suspended" : "Available"
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
  
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
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
              Are you sure you want to suspend this ${name.toLowerCase()}?
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
                  UUID:
                  <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                    {selectedItem.uuid}
                  </span>
                </Typography>
                ${fields
                  .map(
                    (field) => `<Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    textAlign: "left",
                  }}
                >
                  ${toPascalCase(field.name)}:
                  <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                    {selectedItem.${field.name}}
                  </span>
                </Typography>`
                  )
                  .join("\n              ")}
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
  
        <Dialog open={restoreDialogOpen} onClose={() => setRestoreDialogOpen(false)}>
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
              Are you sure you want to restore this ${name}?
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
                  UUID:
                  <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                    {selectedItem.uuid}
                  </span>
                </Typography>
                ${fields
                  .map(
                    (field) => `<Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    textAlign: "left",
                  }}
                >
                  ${toPascalCase(field.name)}:
                  <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                    {selectedItem.${field.name}}
                  </span>
                </Typography>`
                  )
                  .join("\n              ")}
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
  
  export default memo(${name}List);`;

  // Escribir los archivos
  await fs.writeFile(path.join(componentDir, `${name}Form.tsx`), formContent);
  await fs.writeFile(path.join(componentDir, `${name}List.tsx`), listContent);
}
