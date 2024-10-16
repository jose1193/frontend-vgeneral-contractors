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
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { control, setValue } = useFormContext();

  const populatePropertyFields = useCallback(
    (place: google.maps.places.PlaceResult) => {
      let propertyData: Partial<PropertyData> = {
        property_address: "",
        property_city: "",
        property_state: "",
        property_postal_code: "",
        property_country: "",
        property_latitude: place.geometry?.location?.lat() || 0,
        property_longitude: place.geometry?.location?.lng() || 0,
      };

      place.address_components?.forEach((component: AddressComponent) => {
        const { types, long_name, short_name } = component;

        if (types.includes("street_number") || types.includes("route")) {
          propertyData.property_address += propertyData.property_address
            ? " " + long_name
            : long_name;
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
      });

      // Set form values
      Object.entries(propertyData).forEach(([key, value]) => {
        setValue(`${name}.${key}`, value, { shouldValidate: true });
      });

      onAddressSelect(propertyData);
    },
    [setValue, onAddressSelect, name]
  );

  const { isLoaded, error } = useGoogleMapsApi({
    apiKey,
    onAddressSelect: populatePropertyFields,
  });

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: ["address_components", "formatted_address", "geometry"],
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place) {
          populatePropertyFields(place);
        }
      });
    }
  }, [isLoaded, populatePropertyFields]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "sm", marginTop: 2, marginBottom: 2 }}>
      <Controller
        name={`${name}.property_address`}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <TextField
            {...field}
            inputRef={inputRef}
            variant="outlined"
            fullWidth
            id={`${name}.property_address`}
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
