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
  DocumentTemplateAllianceData,
  TEMPLATE_TYPES_ALLIANCE,
  TemplateTypeAlliance,
} from "../../../app/types/document-template-alliance";
import { documentTemplateValidation } from "../Validations/documentTemplateValidation";
import useFormSnackbar from "../../hooks/useFormSnackbar";

import dynamic from "next/dynamic";

const SelectAllianceCompanyId = dynamic(
  () => import("../SelectAllianceCompanyId"),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  }
);

interface DocumentTemplateFormProps {
  initialData?: Partial<DocumentTemplateAllianceData>;
  onSubmit: (data: DocumentTemplateAllianceData) => Promise<void>;
}

const FileUpload = dynamic(() => import("./FileUpload"), {
  loading: () => <CircularProgress />,
  ssr: false,
});

export default function DocumentTemplateAllianceForm({
  initialData,
  onSubmit,
}: DocumentTemplateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { snackbar, setSnackbar, handleSnackbarClose } = useFormSnackbar();
  const [selectedFile, setSelectedFile] = useState<File | null>(
    initialData?.template_path_alliance || null
  );

  const methods = useForm<DocumentTemplateAllianceData>({
    defaultValues: {
      template_name_alliance: "",
      template_description_alliance: null,
      template_type_alliance: TEMPLATE_TYPES_ALLIANCE[0],
      template_path_alliance: initialData?.template_path_alliance,
      ...initialData,
    },
    //resolver: yupResolver(documentTemplateValidation),
    //mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = methods;

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setValue("template_path_alliance", file as File, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // En la función onSubmitHandler
  const onSubmitHandler = async (data: DocumentTemplateAllianceData) => {
    // Solo validamos archivo requerido en creación nueva
    if (!selectedFile && !initialData?.template_path_alliance && !initialData) {
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
      const fileToSubmit =
        selectedFile || initialData?.template_path_alliance || null;

      await onSubmit({
        ...data,
        template_path_alliance: fileToSubmit,
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
                name="template_name_alliance"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Alliance Template Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.template_name_alliance}
                    helperText={errors.template_name_alliance?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="template_description_alliance"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.template_description_alliance}
                    helperText={errors.template_description_alliance?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="template_type_alliance"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Alliance Template Type"
                    variant="outlined"
                    fullWidth
                    error={!!errors.template_type_alliance}
                    helperText={
                      errors.template_type_alliance?.message ||
                      "Please select a template type"
                    }
                  >
                    <MenuItem value="" disabled>
                      Select a type
                    </MenuItem>
                    {TEMPLATE_TYPES_ALLIANCE.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SelectAllianceCompanyId
                control={control}
                initialAlliances={initialData?.alliance_companies || []}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="template_path_alliance"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <FileUpload
                    {...field}
                    onFileSelect={handleFileSelect}
                    error={errors.template_path_alliance?.message}
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
}
