"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Box,
} from "@mui/material";
import GiteIcon from "@mui/icons-material/Gite";
import { useProperties } from "../../hooks/useProperties";
import { useSession } from "next-auth/react";
import { propertySchema } from "../Validations/propertyValidation";
import { PropertyData } from "../../../app/types/property";
import { useCustomerContext } from "../../../app/contexts/CustomerContext";
import { usePropertyContext } from "../../../app/contexts/PropertyContext";
import EnhancedCustomerSelection from "../EnhancedCustomerSelection";
interface PropertyFormProps {
  open: boolean;
  onClose: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ open, onClose }) => {
  const { addProperty } = usePropertyContext();
  const { customers } = useCustomerContext();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { createProperty } = useProperties(token);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PropertyData>({
    resolver: yupResolver(propertySchema),
    defaultValues: {
      property_address: "",
      property_state: "",
      property_city: "",
      property_postal_code: "",
      property_country: "",
      customer_id: [],
    },
    mode: "onChange",
  });

  const onSubmit = async (data: PropertyData) => {
    setIsSubmitting(true);
    try {
      const newProperty = await createProperty(data);
      addProperty(newProperty); // Añade la nueva propiedad al contexto
      setSnackbar({
        open: true,
        message: "Property created successfully",
        severity: "success",
      });
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to create property:", error);
      setSnackbar({
        open: true,
        message: "Failed to create property",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
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
            backgroundColor: "#212121",
            mb: 5,
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          {" "}
          <Box display="flex" alignItems="center" justifyContent="center">
            <GiteIcon sx={{ mr: 1 }} /> {/* Margen a la derecha del icono */}
            New Property
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="property_address"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Address"
                      variant="outlined"
                      error={!!errors.property_address}
                      helperText={errors.property_address?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="property_city"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="City"
                      variant="outlined"
                      error={!!errors.property_city}
                      helperText={errors.property_city?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="property_state"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="State"
                      variant="outlined"
                      error={!!errors.property_state}
                      helperText={errors.property_state?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="property_postal_code"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Postal Code"
                      variant="outlined"
                      error={!!errors.property_postal_code}
                      helperText={errors.property_postal_code?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="property_country"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Country"
                      variant="outlined"
                      error={!!errors.property_country}
                      helperText={errors.property_country?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <EnhancedCustomerSelection
                    control={control}
                    customers={customers}
                    errors={errors}
                  />
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
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
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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

export default PropertyForm;
