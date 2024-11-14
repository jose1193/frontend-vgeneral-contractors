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
  const componentDir = path.join(baseDir, "components", name);

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
import FeedbackSnackbar from "@/app/components/FeedbackSnackbar";
import { ${name}Data } from "@/types/${toKebabCase(name)}";
import { ${name}Validation } from "@/lib/validations/${toKebabCase(
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

import React, { useState } from "react";
import { ${name}Data } from "@/types/${toKebabCase(name)}";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import {
  Box,
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
import { useRouter } from "next/navigation";
import FeedbackSnackbar from "@/app/components/FeedbackSnackbar";

interface ${name}ListProps {
  items: ${name}Data[];
  onDelete: (uuid: string) => Promise<void>;
  onRestore: (uuid: string) => Promise<void>;
  userRole?: string;
}

const ${name}List: React.FC<${name}ListProps> = ({
  items,
  onDelete,
  onRestore,
  userRole,
}) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<${name}Data | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const handleView = (uuid: string) => {
    router.push(\`/dashboard/${toKebabCase(name)}s/\${uuid}\`);
  };

  const handleEdit = (uuid: string) => {
    router.push(\`/dashboard/${toKebabCase(name)}s/\${uuid}/edit\`);
  };

  const handleDeleteClick = (item: ${name}Data) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleRestoreClick = (item: ${name}Data) => {
    setSelectedItem(item);
    setRestoreDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedItem?.uuid) {
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
    }
  };

  const handleRestoreConfirm = async () => {
    if (selectedItem?.uuid) {
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
    }
  };

  const columns: GridColDef[] = [
    ${fields
      .map(
        (field) => `{
      field: "${field.name}",
      headerName: "${toPascalCase(field.name)}",
      flex: 1,
      minWidth: 150,
    }`
      )
      .join(",\n    ")},
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Available" ? "success" : "error"}
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          key="view"
          icon={<VisibilityIcon />}
          label="View"
          onClick={() => handleView(params.row.uuid)}
          showInMenu
        />,
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEdit(params.row.uuid)}
          showInMenu
        />,
        ...(params.row.status === "Available" && userRole !== "Viewer"
          ? [
              <GridActionsCellItem
                key="delete"
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => handleDeleteClick(params.row)}
                showInMenu
              />,
            ]
          : []),
        ...(params.row.status === "Suspended"
          ? [
              <GridActionsCellItem
                key="restore"
                icon={<RestoreIcon />}
                label="Restore"
                onClick={() => handleRestoreClick(params.row)}
                showInMenu
              />,
            ]
          : []),
      ],
    },
  ];

  return (
    <Paper elevation={3} sx={{ height: 600, width: "100%", p: 2 }}>
      <DataGrid
        rows={items.map(item => ({
          id: item.uuid,
          uuid: item.uuid,
          ${fields
            .map((field) => `${field.name}: item.${field.name}`)
            .join(",\n          ")},
          status: item.deleted_at ? "Suspended" : "Available",
        }))}
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
        getRowId={(row) => row.uuid}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle color="error">Confirm Suspend</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to suspend this ${name.toLowerCase()}?
          </Typography>
          {selectedItem && (
            <Box sx={{ mt: 2 }}>
              ${fields
                .map(
                  (field) => `
              <Typography variant="body2" color="text.secondary">
                ${toPascalCase(field.name)}: {selectedItem.${field.name}}
              </Typography>`
                )
                .join("\n              ")}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? "Suspending..." : "Suspend"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={restoreDialogOpen} onClose={() => setRestoreDialogOpen(false)}>
        <DialogTitle color="success">Confirm Restore</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to restore this ${name.toLowerCase()}?
          </Typography>
          {selectedItem && (
            <Box sx={{ mt: 2 }}>
              ${fields
                .map(
                  (field) => `
              <Typography variant="body2" color="text.secondary">
                ${toPascalCase(field.name)}: {selectedItem.${field.name}}
              </Typography>`
                )
                .join("\n              ")}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestoreDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRestoreConfirm}
            color="success"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? "Restoring..." : "Restore"}
          </Button>
        </DialogActions>
      </Dialog>

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Paper>
  );
};

export default ${name}List;`;

  // Escribir los archivos
  await fs.writeFile(path.join(componentDir, `${name}Form.tsx`), formContent);
  await fs.writeFile(path.join(componentDir, `${name}List.tsx`), listContent);
}
