import React, { useEffect, useRef, useCallback } from "react";
import { TextField, Box, Typography, CircularProgress } from "@mui/material";
import { useGoogleMapsApi } from "../hooks/useGoogleMapsApi";
import { useFormContext, Controller } from "react-hook-form";

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface AddressDetails {
  formatted_address: string;
  address_components: AddressComponent[];
  latitude: number;
  longitude: number;
}

interface AddressAutocompleteProps {
  onAddressSelect: (addressDetails: AddressDetails) => void;
  name: string;
  label: string;
  defaultValue?: string;
}

export default function AddressAutocomplete({
  onAddressSelect,
  name,
  label,
  defaultValue = "",
}: AddressAutocompleteProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const inputRef = useRef<HTMLInputElement>(null);
  const { control, setValue } = useFormContext();

  const populateAddressFields = useCallback(
    (addressDetails: AddressDetails) => {
      let address = "";
      let address2 = "";
      let zipCode = "";
      let city = "";
      let state = "";
      let country = "";

      addressDetails.address_components.forEach((component) => {
        const { types, long_name, short_name } = component;

        if (types.includes("street_number")) {
          address = long_name + " ";
        } else if (types.includes("route")) {
          address += long_name;
        } else if (types.includes("subpremise")) {
          address2 = long_name;
        } else if (types.includes("postal_code")) {
          zipCode = long_name;
        } else if (
          types.includes("locality") ||
          types.includes("postal_town")
        ) {
          city = long_name;
        } else if (types.includes("administrative_area_level_1")) {
          state = short_name;
        } else if (types.includes("country")) {
          country = long_name;
        }
      });

      setValue(name, address, { shouldValidate: true });
      setValue("address_2", address2, { shouldValidate: true });
      setValue("zip_code", zipCode, { shouldValidate: true });
      setValue("city", city, { shouldValidate: true });
      setValue("state", state, { shouldValidate: true });
      setValue("country", country, { shouldValidate: true });
      setValue("latitude", addressDetails.latitude, { shouldValidate: true });
      setValue("longitude", addressDetails.longitude, { shouldValidate: true });
    },
    [setValue, name]
  );

  const handleAddressSelect = useCallback(
    (addressDetails: AddressDetails) => {
      onAddressSelect(addressDetails);
      populateAddressFields(addressDetails);
    },
    [onAddressSelect, populateAddressFields]
  );

  const { initAutocomplete, isLoaded, error } = useGoogleMapsApi({
    apiKey,
    onAddressSelect: handleAddressSelect,
  });

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      initAutocomplete(inputRef.current);
    }
  }, [isLoaded, initAutocomplete]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "sm", marginTop: 2, marginBottom: 2 }}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <TextField
            {...field}
            inputRef={inputRef}
            variant="outlined"
            fullWidth
            id={name}
            label={label}
            placeholder={`Enter your ${label.toLowerCase()}`}
            disabled={!isLoaded}
            InputProps={{
              endAdornment: !isLoaded && (
                <CircularProgress color="inherit" size={20} />
              ),
            }}
          />
        )}
      />
    </Box>
  );
}
