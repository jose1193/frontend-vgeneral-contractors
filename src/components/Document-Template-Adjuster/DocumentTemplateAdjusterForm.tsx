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
  MenuItem,
} from "@mui/material";
import {
  DocumentTemplateAdjusterData,
  TEMPLATE_TYPES_ADJUSTER,
} from "../../../app/types/document-template-adjuster";
import SelectPublicAdjusterDocument from "../SelectPublicAdjusterDocument";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";
import { documentTemplateAdjusterValidation } from "../Validations/documentTemplateAdjusterValidation";
import dynamic from "next/dynamic";

const FileUpload = dynamic(() => import("./FileUpload"), {
  loading: () => <CircularProgress />,
  ssr: false,
});

interface DocumentTemplateFormProps {
  initialData?: Partial<DocumentTemplateAdjusterData>;
  onSubmit: (data: DocumentTemplateAdjusterData) => Promise<void>;
}

export default function DocumentTemplateAdjusterForm({
  initialData,
  onSubmit,
}: DocumentTemplateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingFilePath, setExistingFilePath] = useState<string | null>(
    typeof initialData?.template_path_adjuster === "string"
      ? initialData.template_path_adjuster
      : null
  );
  const [feedbackState, setFeedbackState] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const methods = useForm<DocumentTemplateAdjusterData>({
    defaultValues: {
      template_description_adjuster: null,
      template_type_adjuster: TEMPLATE_TYPES_ADJUSTER[0],
      template_path_adjuster: initialData?.template_path_adjuster || null,
      public_adjuster_id: null,
      uuid: null,
      ...initialData,
    },
    resolver: yupResolver(documentTemplateAdjusterValidation),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = methods;

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setValue("template_path_adjuster", file as File, {
      shouldValidate: true,
      shouldDirty: true,
    });
    // Clear existing file path if new file is selected
    if (file) {
      setExistingFilePath(null);
    }
  };

  const handleFeedbackClose = () => {
    setFeedbackState((prev) => ({ ...prev, open: false }));
  };

  const onSubmitHandler = async (data: DocumentTemplateAdjusterData) => {
    if (!selectedFile && !existingFilePath && !initialData) {
      setFeedbackState({
        open: true,
        message: "Please select a file",
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const fileToSubmit = selectedFile || data.template_path_adjuster;

      await onSubmit({
        ...data,
        template_path_adjuster: fileToSubmit,
      });

      setFeedbackState({
        open: true,
        message: `Document template ${
          initialData ? "updated" : "created"
        } successfully!`,
        severity: "success",
      });
    } catch (error) {
      setFeedbackState({
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
                name="template_description_adjuster"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.template_description_adjuster}
                    helperText={errors.template_description_adjuster?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="template_type_adjuster"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Template Type"
                    variant="outlined"
                    fullWidth
                    error={!!errors.template_type_adjuster}
                    helperText={errors.template_type_adjuster?.message}
                  >
                    {TEMPLATE_TYPES_ADJUSTER.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <SelectPublicAdjusterDocument
                control={control}
                adjuster={initialData?.adjuster}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="template_path_adjuster"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <Box>
                    <FileUpload
                      {...field}
                      onFileSelect={handleFileSelect}
                      error={errors.template_path_adjuster?.message}
                      selectedFile={selectedFile}
                      initialFile={
                        typeof value === "string" ? value : undefined
                      }
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
        open={feedbackState.open}
        message={feedbackState.message}
        severity={feedbackState.severity}
        onClose={handleFeedbackClose}
      />
    </FormProvider>
  );
}
