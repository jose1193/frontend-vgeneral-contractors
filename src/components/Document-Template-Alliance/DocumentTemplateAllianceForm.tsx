"use client";

import React, { useState, useEffect } from "react";
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
} from "../../../app/types/document-template-alliance";
import { documentTemplateAllianceValidation } from "../Validations/documentTemplateAllianceValidation";
import useFormSnackbar from "../../hooks/useFormSnackbar";
import dynamic from "next/dynamic";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";

const SelectAllianceCompanyId = dynamic(
  () => import("../SelectAlliancesCompanyId"),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  }
);

const FileUpload = dynamic(() => import("./FileUpload"), {
  loading: () => <CircularProgress />,
  ssr: false,
});

interface DocumentTemplateFormProps {
  initialData?: Partial<DocumentTemplateAllianceData> & {
    template_path_alliance?: string | File | null;
  };
  onSubmit: (data: DocumentTemplateAllianceData) => Promise<void>;
}

export default function DocumentTemplateAllianceForm({
  initialData,
  onSubmit,
}: DocumentTemplateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { snackbar, setSnackbar, handleSnackbarClose } = useFormSnackbar();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingFilePath, setExistingFilePath] = useState<string | null>(
    typeof initialData?.template_path_alliance === "string"
      ? initialData.template_path_alliance
      : null
  );
  // Mejor console.log para debugging
  useEffect(() => {
    console.log("Initial Data Full:", {
      id: initialData?.id,
      alliance_company_id: initialData?.alliance_company_id,
      alliance_company_name: initialData?.alliance_company_name,
      alliance_companies: initialData?.alliance_companies,
      template_path_alliance: initialData?.template_path_alliance,
      signature_path_id: initialData?.signature_path_id,
    });
  }, [initialData]);
  const methods = useForm<DocumentTemplateAllianceData>({
    defaultValues: {
      template_name_alliance: initialData?.template_name_alliance || "",
      template_description_alliance:
        initialData?.template_description_alliance || null,
      template_type_alliance:
        initialData?.template_type_alliance || TEMPLATE_TYPES_ALLIANCE[0],
      template_path_alliance: null,
      template_path_alliance_url:
        typeof initialData?.template_path_alliance === "string"
          ? initialData.template_path_alliance
          : undefined,
      alliance_company_id: initialData?.alliance_company_id || undefined,
      signature_path_id: initialData?.signature_path_id || null,
    },
    resolver: yupResolver(documentTemplateAllianceValidation),
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = methods;

  const watchedAllianceCompanyId = watch("alliance_company_id");
  useEffect(() => {
    console.log("Current alliance_company_id:", watchedAllianceCompanyId);
  }, [watchedAllianceCompanyId]);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setValue("template_path_alliance", file, {
      shouldValidate: true,
      shouldDirty: true,
    });
    // Clear existing file path if new file is selected
    if (file) {
      setExistingFilePath(null);
      setValue("template_path_alliance_url", undefined);
    }
  };

  const onSubmitHandler = async (data: DocumentTemplateAllianceData) => {
    // Validate file requirement for new templates
    if (!selectedFile && !existingFilePath && !initialData) {
      setSnackbar({
        open: true,
        message: "Please select a file",
        severity: "error",
      });
      return;
    }

    // Validate alliance company selection
    if (!data.alliance_company_id) {
      setSnackbar({
        open: true,
        message: "Please select an alliance company",
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData: DocumentTemplateAllianceData = {
        ...data,
        template_path_alliance: selectedFile,
        template_path_alliance_url: !selectedFile
          ? existingFilePath || undefined
          : undefined,
      };

      await onSubmit(submissionData);

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
            {/* Template Name Field */}
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

            {/* Description Field */}
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

            {/* Template Type Field */}
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
                    helperText={errors.template_type_alliance?.message || ""}
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

            {/* Alliance Company Selection */}
            <Grid item xs={12} sm={6}>
              <SelectAllianceCompanyId
                control={control}
                initialCompanyId={initialData?.alliance_company_id}
              />
            </Grid>

            {/* File Upload */}
            <Grid item xs={12}>
              <Controller
                name="template_path_alliance"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <Box>
                    <FileUpload
                      {...field}
                      onFileSelect={handleFileSelect}
                      error={errors.template_path_alliance?.message}
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

          {/* Submit Button */}
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

      {/* Snackbar for notifications */}
      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </FormProvider>
  );
}
