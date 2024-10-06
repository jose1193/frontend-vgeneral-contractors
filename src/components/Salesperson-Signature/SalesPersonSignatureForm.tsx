"use client";

import React, { useState, lazy, Suspense } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import * as yup from "yup";
import useFormSnackbar from "../../hooks/useFormSnackbar";
import { useSession } from "next-auth/react";
import SelectSalesperson from "../../components/SelectSalesPerson";
import { SalesPersonSignatureData } from "../../../app/types/salesperson-signature";
const SignaturePad = lazy(() => import("../../../app/components/SignaturePad"));

interface SalesPersonSignatureFormProps {
  initialData?: SalesPersonSignatureData;
  onSubmit: (data: SalesPersonSignatureData) => Promise<void>;
}

const SalesPersonSignatureForm: React.FC<SalesPersonSignatureFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { snackbar, setSnackbar, handleSnackbarClose } = useFormSnackbar();
  const { data: session } = useSession();

  const userRole = session?.user?.user_role;
  const isSuperAdmin = userRole === "Super Admin";
  const isSalesperson = userRole === "Salesperson";
  const isEditMode = !!initialData;

  const signatureValidationSchema = yup.object().shape({
    signature_path: yup.string().required("Signature is required"),
    salesperson_id:
      isSuperAdmin && !isEditMode
        ? yup.number().required("Please, Select a Salesperson")
        : yup.number().nullable(),
  });

  const methods = useForm<SalesPersonSignatureData>({
    defaultValues: initialData || { signature_path: "", salesperson_id: null },
    resolver: yupResolver(signatureValidationSchema),
    mode: "onChange",
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const onSubmitHandler = async (data: SalesPersonSignatureData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      setSnackbar({
        open: true,
        message: `Signature ${
          isEditMode ? "updated" : "submitted"
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

  const salespersonName = isSalesperson
    ? `${session?.user?.name} ${session?.user?.last_name}`
    : "";

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography
              variant="body1"
              component="label"
              sx={{ fontWeight: "500", mb: 2 }}
            >
              Salesperson Signature
              {isSalesperson && (
                <Typography
                  component="span"
                  sx={{ fontWeight: "normal", ml: 1 }}
                >
                  - {salespersonName}
                </Typography>
              )}
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
            {errors.signature_path && (
              <Typography color="error" variant="caption">
                {errors.signature_path.message}
              </Typography>
            )}
          </Box>
          {isSuperAdmin && !isEditMode && (
            <Box
              sx={{
                width: "100%",
                maxWidth: "400px",
                mt: 2,
                justifyItems: "center",
              }}
            >
              <SelectSalesperson control={control} />
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
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
                : isEditMode
                ? "Update Signature"
                : "Submit Signature"}
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

export default SalesPersonSignatureForm;
