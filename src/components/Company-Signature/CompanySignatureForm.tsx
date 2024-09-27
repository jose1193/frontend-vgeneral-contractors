"use client";

import React, { useState, lazy, Suspense } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import { CompanySignatureData } from "../../../app/types/company-signature";
import { companySignatureValidation } from "../Validations/companySignatureValidation";

const Alert = lazy(() => import("@mui/material/Alert"));
const PhoneInputField = lazy(
  () => import("../../../app/components/PhoneInputField")
);
const SignaturePad = lazy(() => import("../../../app/components/SignaturePad"));
import type { SignaturePadRef } from "../../../app/components/SignaturePad";

interface CompanySignatureFormProps {
  initialData?: CompanySignatureData;
  onSubmit: (data: CompanySignatureData) => Promise<void>;
}

const CompanySignatureForm: React.FC<CompanySignatureFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const methods = useForm<CompanySignatureData>({
    defaultValues: initialData || {},
    resolver: yupResolver(companySignatureValidation),
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = methods;

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmitHandler = async (data: CompanySignatureData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      console.log("submitting form:", data);
      setSnackbar({
        open: true,
        message: "Signature submitted successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        severity: "error",
      });
      console.error("Error submitting form:", error);
      console.log("submitting form:", data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="company_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Company Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.company_name}
                    helperText={errors.company_name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Suspense fallback={<CircularProgress />}>
                <PhoneInputField name="phone" label="" />
              </Suspense>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    variant="outlined"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="website"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Website"
                    variant="outlined"
                    fullWidth
                    error={!!errors.website}
                    helperText={errors.website?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Typography
                variant="body1"
                component="label"
                sx={{
                  display: "block",
                  fontWeight: "500",
                  mb: 3,
                  mt: 2,
                }}
              >
                Signature Company
              </Typography>
              <Controller
                name="signature_path"
                control={control}
                render={({ field }) => (
                  <Suspense fallback={<CircularProgress />}>
                    <SignaturePad
                      name={field.name}
                      onChange={field.onChange}
                      initialValue={field.value}
                    />
                  </Suspense>
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
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
                ? "Update Signature"
                : "Create Signature"}
            </Button>
          </Box>
        </Box>
      </form>
      <Suspense>
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
      </Suspense>
    </FormProvider>
  );
};

export default CompanySignatureForm;
