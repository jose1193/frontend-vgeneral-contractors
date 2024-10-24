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
  Alert,
} from "@mui/material";
import { CustomerData } from "../../../app/types/customer";
import { customerSchema } from "../Validations/customersValidation";
import useFormSnackbar from "../../hooks/useFormSnackbar";
import EmailCustomerInputField from "../Customers/EmailCustomerInputField";
import useCapitalizeWords from "../../hooks/useCapitalizeWords";
const PhoneInputField = lazy(
  () => import("../../../app/components/PhoneInputField")
);

interface CustomerFormProps {
  initialData?: CustomerData;
  uuid?: string;
  onSubmit: (data: CustomerData) => Promise<void>;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  initialData,
  onSubmit,
  uuid,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { snackbar, setSnackbar, handleSnackbarClose } = useFormSnackbar();
  const capitalizeWords = useCapitalizeWords();
  const methods = useForm<CustomerData>({
    defaultValues: initialData || {},
    resolver: yupResolver(customerSchema),
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = methods;

  const onSubmitHandler = async (data: CustomerData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      setSnackbar({
        open: true,
        message: "Customer submitted successfully!",
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
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) =>
                      field.onChange(capitalizeWords(e.target.value))
                    }
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    autoComplete="off"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="last_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) =>
                      field.onChange(capitalizeWords(e.target.value))
                    }
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.last_name}
                    helperText={errors.last_name?.message}
                    autoComplete="off"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <EmailCustomerInputField
                    field={field}
                    form={{
                      touched: { email: fieldState.isTouched },
                      errors: { email: fieldState.error?.message },
                      setFieldValue: (name: string, value: string) =>
                        field.onChange(value),
                    }}
                    uuid={uuid || ""}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="occupation"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) =>
                      field.onChange(capitalizeWords(e.target.value))
                    }
                    label="Occupation - (Optional)"
                    variant="outlined"
                    fullWidth
                    error={!!errors.occupation}
                    helperText={errors.occupation?.message}
                    autoComplete="off"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Suspense fallback={<CircularProgress />}>
                <PhoneInputField name="cell_phone" label="Cell Phone" />
              </Suspense>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Suspense fallback={<CircularProgress />}>
                <PhoneInputField name="home_phone" label="Home Phone" />
              </Suspense>
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
                ? "Update Customer"
                : "Create Customer"}
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

export default CustomerForm;
