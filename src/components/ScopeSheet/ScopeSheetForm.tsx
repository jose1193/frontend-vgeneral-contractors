"use client";

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
import { ScopeSheetData } from "../../../app/types/scope-sheet";
import { ScopeSheetValidation } from "../Validations/scope-sheetValidation";

interface ScopeSheetFormProps {
  initialData?: Partial<ScopeSheetData>;
  onSubmit: (data: ScopeSheetData) => Promise<void>;
}

const ScopeSheetForm: React.FC<ScopeSheetFormProps> = ({
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
  } = useForm<ScopeSheetData>({
    defaultValues: initialData || {},
    resolver: yupResolver(ScopeSheetValidation),
    mode: "onChange",
  });

  const onSubmitHandler = async (data: ScopeSheetData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      setSnackbar({
        open: true,
        message: initialData ? "ScopeSheet updated successfully!" : "ScopeSheet created successfully!",
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
        
        <Grid item xs={12} sm={6}>
          <Controller
            name="uuid"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Uuid"
                fullWidth
                error={!!errors.uuid}
                helperText={errors.uuid?.message}
                
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Controller
            name="claim_id"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Claim_id"
                fullWidth
                error={!!errors.claim_id}
                helperText={errors.claim_id?.message}
                
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Controller
            name="scope_sheet_description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Scope_sheet_description"
                fullWidth
                error={!!errors.scope_sheet_description}
                helperText={errors.scope_sheet_description?.message}
                
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Controller
            name="generated_by"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Generated_by"
                fullWidth
                error={!!errors.generated_by}
                helperText={errors.generated_by?.message}
                
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>
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
            ? "Update ScopeSheet"
            : "Create ScopeSheet"}
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

export default ScopeSheetForm;