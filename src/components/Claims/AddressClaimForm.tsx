import React, { useState, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  Grid,
  TextField,
  Box,
  CircularProgress,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useProperties } from "../../hooks/useProperties";
import { useSession } from "next-auth/react";
import { PropertyData } from "../../../app/types/property";
import { CustomerData } from "../../../app/types/customer";
import { usePropertyContext } from "../../../app/contexts/PropertyContext";
import GiteIcon from "@mui/icons-material/Gite";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

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
  associatedCustomerIds: initialAssociatedCustomerIds,
}) => {
  const [mapCoordinates, setMapCoordinates] = useState({ lat: 0, lng: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [excludeDialogOpen, setExcludeDialogOpen] = useState(false);
  const [customerToExclude, setCustomerToExclude] =
    useState<CustomerData | null>(null);
  const [associatedCustomerIds, setAssociatedCustomerIds] = useState<number[]>(
    []
  );

  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { createProperty } = useProperties(token);
  const { addNewPropertyWithCustomers } = usePropertyContext();

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
    // Initialize with all customer IDs
    const allCustomerIds = customers
      .map((customer) => customer.id)
      .filter((id) => id !== undefined);
    setAssociatedCustomerIds(allCustomerIds);
    setValue("associated_customer_ids", allCustomerIds);
  }, [customers, setValue]);

  const handleAddressSelect = (addressDetails: any) => {
    console.log("Received address details:", addressDetails);

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
        addressDetails.property_complete_address
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

      // Ensure property_address is set
      const shortAddress =
        addressDetails.property_address ||
        addressDetails.property_complete_address.split(",")[0].trim();
      setValue("property.property_address", shortAddress);
    } else {
      console.error("Invalid address details received:", addressDetails);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const customerIds = associatedCustomerIds;

      const propertyData: Omit<PropertyData, "id" | "customers"> = {
        ...data.property,
        customer_id: customerIds,
      };

      console.log("Property data being sent:", propertyData);

      if (!propertyData.property_address) {
        console.error("property_address is missing!");
        return;
      }

      const newProperty = await createProperty(propertyData);
      console.log("Response from server:", newProperty);

      const associatedCustomers = customers.filter(
        (customer) =>
          customer.id !== undefined &&
          associatedCustomerIds.includes(customer.id)
      );

      if (typeof window !== "undefined" && (window as any).handleNewProperty) {
        (window as any).handleNewProperty(newProperty, associatedCustomers);
      }

      onSubmitSuccess();
    } catch (error) {
      console.error("Failed to create property:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset({
      ...watch(),
      property: {
        ...watch("property"),
        property_address_2: "",
      },
    });
    onClose();
  };

  const handleExcludeCustomer = (customer: CustomerData) => {
    setCustomerToExclude(customer);
    setExcludeDialogOpen(true);
  };

  const handleExcludeConfirm = () => {
    if (customerToExclude) {
      const updatedIds = associatedCustomerIds.filter(
        (id) => id !== customerToExclude.id
      );
      setAssociatedCustomerIds(updatedIds);
      setValue("associated_customer_ids", updatedIds);
    }
    setExcludeDialogOpen(false);
  };

  const associatedCustomers = customers.filter(
    (customer) =>
      customer.id !== undefined && associatedCustomerIds.includes(customer.id)
  );

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
          onClick={handleClose}
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
      {associatedCustomers.length > 0 && (
        <Box sx={{ px: 3, py: 2, backgroundColor: "#f0f0f0", mb: 2, mt: -2 }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            textAlign="center"
            sx={{ my: 1 }}
          >
            Associated Customers:
          </Typography>
          <Box
            sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
          >
            {associatedCustomers.map((customer) => (
              <Box
                key={customer.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  m: 1,
                  p: 1,
                  backgroundColor: "#fff",
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#662401",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <PersonIcon sx={{ mr: 1, fontSize: "small" }} />
                  {customer.name} {customer.last_name}
                </Typography>
                <IconButton
                  onClick={() => handleExcludeCustomer(customer)}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <RemoveCircleOutlineIcon color="error" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}
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
                  label="Home Address (Property Number) - (Optional)"
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
      <Dialog
        open={excludeDialogOpen}
        onClose={() => setExcludeDialogOpen(false)}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#ef4444",
            mb: 5,
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Confirm Exclusion
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              textAlign: "left",
              mb: 2,
              fontWeight: "bold",
            }}
          >
            Are you sure you want to exclude this customer from the new
            property?
          </Typography>
          {customerToExclude && (
            <Typography
              variant="body1"
              gutterBottom
              sx={{
                textAlign: "left",
                mb: 2,
              }}
            >
              Customer Name:
              <span style={{ fontWeight: "bold", marginLeft: 10 }}>
                {customerToExclude.name} {customerToExclude.last_name}
              </span>
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExcludeDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleExcludeConfirm}
            color="error"
          >
            Exclude
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddressClaimForm;
