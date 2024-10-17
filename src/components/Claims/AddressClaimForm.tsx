import React, { useState, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  Grid,
  TextField,
  Box,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
  Typography,
  IconButton,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useProperties } from "../../hooks/useProperties";
import { useSession } from "next-auth/react";
import { PropertyData } from "../../../app/types/property";
import { CustomerData } from "../../../app/types/customer";
import { usePropertyContext } from "../../../app/contexts/PropertyContext";
import GiteIcon from "@mui/icons-material/Gite";
import CloseIcon from "@mui/icons-material/Close";

const AddressAutocompleteProperty = dynamic(
  () => import("./AddressAutocompleteProperty"),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  }
);

const GoogleMapComponent = dynamic(() => import("../GoogleMap"), {
  loading: () => <CircularProgress />,
  ssr: false,
});

interface AddressClaimFormProps {
  customers: CustomerData[];
  onSubmitSuccess: () => void;
  onClose: () => void;
  associatedCustomerIds: number[];
}

const AddressClaimForm: React.FC<AddressClaimFormProps> = ({
  customers,
  onSubmitSuccess,
  onClose,
  associatedCustomerIds,
}) => {
  const [mapCoordinates, setMapCoordinates] = useState({ lat: 0, lng: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { createProperty } = useProperties(token);
  const { addProperty } = usePropertyContext();

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useFormContext();

  const selectedCustomerId = watch("customer_id");

  useEffect(() => {
    console.log("Associated customer IDs:", associatedCustomerIds);
    setValue("associated_customer_ids", associatedCustomerIds);
  }, [associatedCustomerIds, setValue]);

  const handleAddressSelect = (addressDetails: any) => {
    console.log("Received address details:", addressDetails); // Para depuración

    if (addressDetails.property_latitude && addressDetails.property_longitude) {
      setMapCoordinates({
        lat: addressDetails.property_latitude,
        lng: addressDetails.property_longitude,
      });

      setValue("property.property_latitude", addressDetails.property_latitude);
      setValue(
        "property.property_longitude",
        addressDetails.property_longitude
      );
      setValue(
        "property.property_complete_address",
        addressDetails.property_address
      );
      setValue("property.property_city", addressDetails.property_city || "");
      setValue("property.property_state", addressDetails.property_state || "");
      setValue(
        "property.property_country",
        addressDetails.property_country || ""
      );
      setValue(
        "property.property_postal_code",
        addressDetails.property_postal_code || ""
      );

      // Extraer la dirección corta (asumiendo que es la primera parte hasta la primera coma)
      const shortAddress = addressDetails.property_address.split(",")[0].trim();
      setValue("property.property_address", shortAddress);
    } else {
      console.error("Invalid address details received:", addressDetails);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const customerIds =
        data.associated_customer_ids.length > 0
          ? data.associated_customer_ids
          : [selectedCustomerId];

      const propertyData: Omit<PropertyData, "id"> = {
        ...data.property,
        customer_id: customerIds,
      };

      console.log("Property data being sent:", propertyData);

      const newProperty = await createProperty(propertyData);
      console.log("Response from server:", newProperty);
      addProperty(newProperty);
      setValue("property_id", newProperty.id);
      setSnackbar({
        open: true,
        message: "Property created successfully",
        severity: "success",
      });
      reset();
      onSubmitSuccess();
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

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "grey.300",
        borderRadius: 2,
        overflow: "hidden",
        my: 5,
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2,
          backgroundColor: "#16a34a",
          mb: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: "#fff",
            fontWeight: "bold",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
          }}
        >
          <GiteIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          New Property
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: "white",
            position: "absolute",
            top: 8,
            right: 8,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ px: 3, py: 2 }}>
        <Grid container spacing={2} sx={{ mb: 5 }}>
          <Grid item xs={12}>
            <AddressAutocompleteProperty
              onAddressSelect={handleAddressSelect}
              name="property.property_complete_address"
              label="Property Address"
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="property.property_address_2"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Property Address 2 (Optional)"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            {mapCoordinates.lat !== 0 && mapCoordinates.lng !== 0 && (
              <Box height={400} width="100%" position="relative" sx={{ mt: 2 }}>
                <GoogleMapComponent
                  latitude={mapCoordinates.lat}
                  longitude={mapCoordinates.lng}
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              color="success"
              fullWidth
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </Box>
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
    </Box>
  );
};

export default AddressClaimForm;
