"use client";

import React, { useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Grid,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import {
  DocumentTemplateFormData,
  TEMPLATE_TYPES,
  TemplateType,
} from "../../../app/types/document-template";
import { documentTemplateValidation } from "../Validations/documentTemplateValidation";
import useFormSnackbar from "../../hooks/useFormSnackbar";

import dynamic from "next/dynamic";
interface DocumentTemplateFormProps {
  initialData?: Partial<DocumentTemplateFormData>;
  onSubmit: (data: DocumentTemplateFormData) => Promise<void>;
}

const FileUpload = dynamic(() => import("./FileUpload"), {
  loading: () => <CircularProgress />,
  ssr: false,
});

const DocumentTemplateForm: React.FC<DocumentTemplateFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { snackbar, setSnackbar, handleSnackbarClose } = useFormSnackbar();
  // Inicializamos selectedFile con el archivo inicial si existe
  const [selectedFile, setSelectedFile] = useState<File | null>(
    initialData?.template_path || null
  );

  const methods = useForm<DocumentTemplateFormData>({
    defaultValues: {
      template_name: "",
      template_description: null,
      template_type: TEMPLATE_TYPES[0],
      template_path: initialData?.template_path,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...initialData,
    },
    resolver: yupResolver(documentTemplateValidation),
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = methods;

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setValue("template_path", file as File, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmitHandler = async (data: DocumentTemplateFormData) => {
    if (!selectedFile && !initialData?.template_path) {
      setSnackbar({
        open: true,
        message: "Please select a file",
        severity: "error",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const fileToSubmit = selectedFile || initialData?.template_path;

      await onSubmit({
        ...data,
        template_path: fileToSubmit as File,
      });

      setSnackbar({
        open: true,
        message: `Document template ${
          initialData ? "updated" : "created"
        } successfully!`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="template_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Template Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.template_name}
                    helperText={errors.template_name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="template_description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.template_description}
                    helperText={errors.template_description?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="template_type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Template Type"
                    variant="outlined"
                    fullWidth
                    error={!!errors.template_type}
                    helperText={
                      errors.template_type?.message ||
                      "Please select a template type"
                    }
                  >
                    <MenuItem value="" disabled>
                      Select a type
                    </MenuItem>
                    {TEMPLATE_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="template_path"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <FileUpload
                    {...field}
                    onFileSelect={handleFileSelect}
                    error={errors.template_path?.message}
                    selectedFile={selectedFile}
                    onChange={onChange}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isSubmitting
                ? "Submitting..."
                : initialData
                ? "Update Template"
                : "Create Template"}
            </Button>
          </Box>
        </Box>
      </form>

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
    </FormProvider>
  );
};

export default DocumentTemplateForm;
