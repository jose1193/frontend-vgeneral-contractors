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
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingFilePath, setExistingFilePath] = useState<string | null>(
    typeof initialData?.template_path === "string"
      ? initialData.template_path
      : null
  );

  const methods = useForm<DocumentTemplateFormData>({
    defaultValues: {
      template_name: "",
      template_description: null,
      template_type: TEMPLATE_TYPES[0],
      template_path: initialData?.template_path,
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
    // Clear existing file path if new file is selected
    if (file) {
      setExistingFilePath(null);
    }
  };

  const onSubmitHandler = async (data: DocumentTemplateFormData) => {
    // Solo validamos archivo requerido en creación nueva
    if (!selectedFile && !existingFilePath && !initialData) {
      setSnackbar({
        open: true,
        message: "Please select a file",
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Si hay un nuevo archivo seleccionado, usamos ese
      // Si no, y es una actualización, mantenemos el archivo existente
      const fileToSubmit = selectedFile || initialData?.template_path || null;

      await onSubmit({
        ...data,
        template_path: fileToSubmit,
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
                  <Box>
                    <FileUpload
                      {...field}
                      onFileSelect={handleFileSelect}
                      error={errors.template_path?.message}
                      selectedFile={selectedFile}
                      onChange={onChange}
                    />
                    {existingFilePath && !selectedFile && (
                      <Box
                        sx={{
                          mt: 1,
                          color: "success.main",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          fontWeight: 500,
                        }}
                      >
                        Current file:
                        <span style={{ wordBreak: "break-all" }}>
                          {existingFilePath.split("/").pop()}
                        </span>
                      </Box>
                    )}
                  </Box>
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

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </FormProvider>
  );
};

export default DocumentTemplateForm;
