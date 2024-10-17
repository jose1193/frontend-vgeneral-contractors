"use client";

import React, { useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import { useCustomers } from "../../hooks/useCustomers";
import { useSession } from "next-auth/react";
import { customerSchema } from "../../components/Validations/customersValidation";
import { CustomerData } from "../../../app/types/customer";
import { PropertyData } from "../../../app/types/property";
import { useCustomerContext } from "../../../app/contexts/CustomerContext";
import PhoneInputField from "../../../app/components/PhoneInputField";
import useCapitalizeWords from "../../hooks/useCapitalizeWords";
import EmailCustomerInputField from "../Customers/EmailCustomerInputField";

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
  selectedProperty: PropertyData | null;
}

const AddSecondCustomerModal: React.FC<CustomerFormProps> = ({
  open,
  onClose,
  selectedProperty,
}) => {
  const capitalizeWords = useCapitalizeWords();
  const { addCustomer, refreshCustomers } = useCustomerContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { createCustomer } = useCustomers(token);
  const methods = useForm<CustomerData>({
    resolver: yupResolver(customerSchema),
    mode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: CustomerData) => {
    setIsSubmitting(true);

    try {
      const { id, ...customerDataWithoutId } = data;
      const newCustomerData = {
        ...customerDataWithoutId,
        property_id: selectedProperty?.id,
      };
      const newCustomer = await createCustomer(newCustomerData);
      addCustomer(newCustomer);
      await refreshCustomers();
      setSnackbar({
        open: true,
        message: "Customer assigned to property successfully",
        severity: "success",
      });
      onClose();
      reset();
    } catch (error) {
      console.error("Failed to create customer:", error);
      setSnackbar({
        open: true,
        message: "Failed to create customer",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(onSubmit)(e);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle
          sx={{
            backgroundColor: "#15803d",
            mb: 5,
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <PermContactCalendarIcon sx={{ mr: 1 }} /> New Customer Signature
          </Box>
        </DialogTitle>
        {selectedProperty && (
          <Box sx={{ px: 3, py: 2, backgroundColor: "#f0f0f0", mb: 2, mt: -5 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Selected Property:
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#662401", fontWeight: "bold" }}
            >
              {selectedProperty.property_address},{" "}
              {selectedProperty.property_city},{" "}
              {selectedProperty.property_state}{" "}
              {selectedProperty.property_postal_code},{" "}
              {selectedProperty.property_country}
            </Typography>
          </Box>
        )}
        <FormProvider {...methods}>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Name"
                        onChange={(e) =>
                          field.onChange(capitalizeWords(e.target.value))
                        }
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
                        fullWidth
                        label="Last Name"
                        onChange={(e) =>
                          field.onChange(capitalizeWords(e.target.value))
                        }
                        error={!!errors.last_name}
                        helperText={errors.last_name?.message}
                        autoComplete="off"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PhoneInputField name="cell_phone" label="Cell Phone" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PhoneInputField
                    name="home_phone"
                    label="Home Phone - (Optional)"
                  />
                </Grid>
                <Grid item xs={12}>
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
                        uuid=""
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="occupation"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Occupation - (Optional)"
                        onChange={(e) =>
                          field.onChange(capitalizeWords(e.target.value))
                        }
                        error={!!errors.occupation}
                        helperText={errors.occupation?.message}
                        autoComplete="off"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>
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
    </>
  );
};

export default AddSecondCustomerModal;
