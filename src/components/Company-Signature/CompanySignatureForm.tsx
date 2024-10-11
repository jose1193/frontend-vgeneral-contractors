"use client";

import React, { useState, lazy, Suspense, useEffect } from "react";
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
  Typography,
} from "@mui/material";
import { CompanySignatureData } from "../../../app/types/company-signature";
import { companySignatureValidation } from "../Validations/companySignatureValidation";
import useFormSnackbar from "../../hooks/useFormSnackbar";
import dynamic from "next/dynamic";

const PhoneInputField = lazy(
  () => import("../../../app/components/PhoneInputField")
);
const SignaturePad = lazy(() => import("../../../app/components/SignaturePad"));

// Dynamic import for AddressAutocomplete
const CompanySignatureAutocomplete = dynamic(
  () => import("../../../src/components/CompanySignatureAutocomplete"),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  }
);

// Dynamic import for GoogleMapComponent
const GoogleMapComponent = dynamic(() => import("../GoogleMap"), {
  loading: () => <CircularProgress />,
  ssr: false,
});

interface CompanySignatureFormProps {
  initialData?: CompanySignatureData;
  onSubmit: (data: CompanySignatureData) => Promise<void>;
}

const CompanySignatureForm: React.FC<CompanySignatureFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { snackbar, setSnackbar, handleSnackbarClose } = useFormSnackbar();
  const [mapCoordinates, setMapCoordinates] = useState({ lat: 0, lng: 0 });

  const methods = useForm<CompanySignatureData>({
    defaultValues: initialData || {},
    resolver: yupResolver(companySignatureValidation),
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = methods;

  useEffect(() => {
    if (initialData && initialData.address) {
      setValue("address", initialData.address);
      if (initialData.latitude && initialData.longitude) {
        setMapCoordinates({
          lat: initialData.latitude,
          lng: initialData.longitude,
        });
      }
    }
  }, [initialData, setValue]);

  const handleAddressSelect = (addressDetails: any) => {
    console.log("Address details received:", addressDetails);
    if (addressDetails.latitude && addressDetails.longitude) {
      setMapCoordinates({
        lat: addressDetails.latitude,
        lng: addressDetails.longitude,
      });
      setValue("latitude", addressDetails.latitude);
      setValue("longitude", addressDetails.longitude);
      setValue("address", addressDetails.address);
    }
  };

  const onSubmitHandler = async (data: CompanySignatureData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
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
                <PhoneInputField name="phone" label="Phone" />
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
              <CompanySignatureAutocomplete
                onAddressSelect={(addressDetails) => {
                  console.log(addressDetails.formatted_address);
                  // Aquí puedes hacer lo que necesites con la dirección completa
                }}
                name="address"
                label="Company Address"
                defaultValue={initialData?.address || ""}
              />
            </Grid>
            {initialData && (
              <Grid item xs={12}>
                {mapCoordinates.lat !== 0 && mapCoordinates.lng !== 0 && (
                  <Box
                    height={300}
                    width="100%"
                    position="relative"
                    sx={{ mb: 5 }}
                  >
                    <GoogleMapComponent
                      latitude={mapCoordinates.lat}
                      longitude={mapCoordinates.lng}
                    />
                  </Box>
                )}
              </Grid>
            )}
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
                sx={{ display: "block", fontWeight: "500", mb: 3, mt: 2 }}
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

          <input type="hidden" {...methods.register("latitude")} />
          <input type="hidden" {...methods.register("longitude")} />

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
