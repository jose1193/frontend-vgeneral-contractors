"use client";

import React, { useState, lazy, Suspense } from "react";
import { useForm, Resolver, Controller, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button, Box, CircularProgress, Grid } from "@mui/material";
import { MortgageCompanyData } from "../../../app/types/mortgage-company";
import { mortgageCompanyValidation } from "../Validations/mortgageCompanyValidation";
import useCompanyNameFormatter from "../../hooks/useCompanyNameFormatter";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";
import dynamic from "next/dynamic";

const PhoneInputField = lazy(
  () => import("../../../app/components/PhoneInputField")
);

const CompanySignatureAutocomplete = dynamic(
  () => import("../../components/CompanySignatureAutocomplete"),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  }
);

interface MortgageCompanyFormProps {
  initialData?: Partial<MortgageCompanyData>;
  onSubmit: (data: MortgageCompanyData) => Promise<void>;
}

const MortgageCompanyForm: React.FC<MortgageCompanyFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const formatCompanyName = useCompanyNameFormatter();

  const methods = useForm<MortgageCompanyData>({
    defaultValues: initialData || {},
    resolver: yupResolver(
      mortgageCompanyValidation
    ) as Resolver<MortgageCompanyData>,
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = methods;

  const handleAddressSelect = (addressDetails: any) => {
    setValue("address", addressDetails.formatted_address);
  };

  const onSubmitHandler = async (data: MortgageCompanyData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      setSnackbar({
        open: true,
        message: "Mortgage company data submitted successfully!",
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
                name="mortgage_company_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) => {
                      const formattedValue = formatCompanyName(e.target.value);
                      field.onChange(formattedValue);
                    }}
                    label="Mortgage Company Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.mortgage_company_name}
                    helperText={errors.mortgage_company_name?.message}
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
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? null : e.target.value;
                      field.onChange(value);
                    }}
                    label="Website (Optional)"
                    variant="outlined"
                    fullWidth
                    error={!!errors.website}
                    helperText={errors.website?.message}
                    autoComplete="off"
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
                ? "Update Mortgage Company"
                : "Create Mortgage Company"}
            </Button>
          </Box>
        </Box>
      </form>

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </FormProvider>
  );
};

export default MortgageCompanyForm;
