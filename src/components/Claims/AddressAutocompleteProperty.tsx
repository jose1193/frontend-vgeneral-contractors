import React, { useEffect, useRef, useCallback } from "react";
import { TextField, Box, Typography, CircularProgress } from "@mui/material";
import { useGoogleMapsApi } from "../../hooks/useGoogleMapsApi";
import { useFormContext, Controller } from "react-hook-form";
import { PropertyData } from "../../../app/types/property";

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface AddressAutocompletePropertyProps {
  onAddressSelect: (propertyData: Partial<PropertyData>) => void;
  name: string;
  label: string;
  defaultValue?: string;
}

export default function AddressAutocompleteProperty({
  onAddressSelect,
  name,
  label,
  defaultValue = "",
}: AddressAutocompletePropertyProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const inputRef = useRef<HTMLInputElement>(null);
  const { control, setValue } = useFormContext();

  const handleAddressSelect = useCallback(
    (addressDetails: {
      formatted_address: string;
      address_components: google.maps.GeocoderAddressComponent[];
      latitude: number;
      longitude: number;
    }) => {
      let propertyData: Partial<PropertyData> = {
        property_address: "",
        property_complete_address: addressDetails.formatted_address,
        property_city: "",
        property_state: "",
        property_postal_code: "",
        property_country: "",
        property_latitude: addressDetails.latitude,
        property_longitude: addressDetails.longitude,
      };

      addressDetails.address_components.forEach(
        (component: AddressComponent) => {
          const { types, long_name, short_name } = component;

          if (types.includes("street_number")) {
            propertyData.property_address = long_name + " ";
          } else if (types.includes("route")) {
            propertyData.property_address += long_name;
          } else if (
            types.includes("locality") ||
            types.includes("postal_town")
          ) {
            propertyData.property_city = long_name;
          } else if (types.includes("administrative_area_level_1")) {
            propertyData.property_state = short_name;
          } else if (types.includes("postal_code")) {
            propertyData.property_postal_code = long_name;
          } else if (types.includes("country")) {
            propertyData.property_country = long_name;
          }
        }
      );

      // Ensure property_address is set
      if (!propertyData.property_address) {
        propertyData.property_address =
          propertyData.property_complete_address?.split(",")[0] || "";
      }

      // Set form values
      Object.entries(propertyData).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(`${name}.${key}`, value, { shouldValidate: true });
        }
      });

      console.log("Property data being set:", propertyData);
      onAddressSelect(propertyData);
    },
    [setValue, onAddressSelect, name]
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
        name={`${name}.property_complete_address`}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <TextField
            {...field}
            inputRef={inputRef}
            variant="outlined"
            fullWidth
            id={`${name}.property_complete_address`}
            label={label}
            placeholder={`Enter the ${label.toLowerCase()}`}
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
