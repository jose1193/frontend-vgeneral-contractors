"use client";

import React, { useState, lazy, Suspense } from "react";
import { useForm, Resolver, Controller, FormProvider } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { InsuranceCompanyData } from "../../../app/types/insurance-company";
import { insuranceCompanyValidation } from "../Validations/insuranceCompanyValidation";
import useFormSnackbar from "../../hooks/useFormSnackbar";
import dynamic from "next/dynamic";
import SelectProhibitedAlliances from "../SelectProhibitedAlliances";
const PhoneInputField = lazy(
  () => import("../../../app/components/PhoneInputField")
);

// Dynamic import for AddressAutocomplete
const CompanySignatureAutocomplete = dynamic(
  () => import("../../components/CompanySignatureAutocomplete"),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  }
);

interface InsuranceCompanyFormProps {
  initialData?: Partial<InsuranceCompanyData>;
  onSubmit: (data: InsuranceCompanyData) => Promise<void>;
}

const InsuranceCompanyForm: React.FC<InsuranceCompanyFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { snackbar, setSnackbar, handleSnackbarClose } = useFormSnackbar();

  const methods = useForm<InsuranceCompanyData>({
    defaultValues: initialData || {},
    resolver: yupResolver(
      insuranceCompanyValidation
    ) as Resolver<InsuranceCompanyData>,
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    setError,
  } = methods;

  const handleAddressSelect = (addressDetails: any) => {
    setValue("address", addressDetails.formatted_address);
  };

  const onSubmitHandler = async (data: InsuranceCompanyData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      setSnackbar({
        open: true,
        message: "Insurance company data submitted successfully!",
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
                name="insurance_company_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Insurance Company Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.insurance_company_name}
                    helperText={errors.insurance_company_name?.message}
                    autoComplete="off"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CompanySignatureAutocomplete
                onAddressSelect={handleAddressSelect}
                name="address"
                label="Company Address"
                defaultValue={initialData?.address || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
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
            <Grid item xs={12} sm={6}>
              <Suspense fallback={<CircularProgress />}>
                <PhoneInputField name="phone" label="Phone" />
              </Suspense>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
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
            <Grid item xs={12} sm={6} sx={{ mt: 5 }}>
              <SelectProhibitedAlliances
                control={control}
                initialAlliances={initialData?.alliance_companies || []}
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
                ? "Update Insurance Company"
                : "Create Insurance Company"}
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

export default InsuranceCompanyForm;
