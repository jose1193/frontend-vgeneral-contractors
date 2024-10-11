import React, { useEffect, useRef, useCallback } from "react";
import { TextField, Box, Typography, CircularProgress } from "@mui/material";
import { useGoogleMapsApi } from "../hooks/useGoogleMapsApi";
import { UseFormSetValue } from "react-hook-form";

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

interface PropertyAddressAutocompleteProps {
  onAddressSelect: (addressDetails: AddressDetails) => void;
  name: string;
  label: string;
  setValue: UseFormSetValue<any>;
}

export default function PropertyAddressAutocomplete({
  onAddressSelect,
  name,
  label,
  setValue,
}: PropertyAddressAutocompleteProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const populateAddressFields = useCallback(
    (addressDetails: AddressDetails) => {
      let propertyAddress = "";
      let propertyCity = "";
      let propertyState = "";
      let propertyPostalCode = "";
      let propertyCountry = "";

      addressDetails.address_components.forEach((component) => {
        const { types, long_name, short_name } = component;

        if (types.includes("street_number") || types.includes("route")) {
          propertyAddress += propertyAddress ? " " + long_name : long_name;
        } else if (
          types.includes("locality") ||
          types.includes("postal_town")
        ) {
          propertyCity = long_name;
        } else if (types.includes("administrative_area_level_1")) {
          propertyState = short_name;
        } else if (types.includes("postal_code")) {
          propertyPostalCode = long_name;
        } else if (types.includes("country")) {
          propertyCountry = long_name;
        }
      });

      setValue("property_address", propertyAddress, { shouldValidate: true });
      setValue("property_city", propertyCity, { shouldValidate: true });
      setValue("property_state", propertyState, { shouldValidate: true });
      setValue("property_postal_code", propertyPostalCode, {
        shouldValidate: true,
      });
      setValue("property_country", propertyCountry, { shouldValidate: true });
      setValue("property_latitude", addressDetails.latitude, {
        shouldValidate: true,
      });
      setValue("property_longitude", addressDetails.longitude, {
        shouldValidate: true,
      });
    },
    [setValue]
  );

  const handleAddressSelect = useCallback(
    (place: google.maps.places.PlaceResult) => {
      if (
        place.formatted_address &&
        place.address_components &&
        place.geometry?.location
      ) {
        const addressDetails: AddressDetails = {
          formatted_address: place.formatted_address,
          address_components: place.address_components,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        };
        onAddressSelect(addressDetails);
        populateAddressFields(addressDetails);
      }
    },
    [onAddressSelect, populateAddressFields]
  );

  const { isLoaded, error } = useGoogleMapsApi({
    apiKey,
    onAddressSelect: handleAddressSelect,
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
          handleAddressSelect(place);
        }
      });
    }
  }, [isLoaded, handleAddressSelect]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "sm", marginTop: 2, marginBottom: 2 }}>
      <TextField
        inputRef={inputRef}
        name={name}
        variant="outlined"
        fullWidth
        id={name}
        placeholder={`Enter the property ${label.toLowerCase()}`}
        disabled={!isLoaded}
        InputProps={{
          endAdornment: !isLoaded && (
            <CircularProgress color="inherit" size={20} />
          ),
        }}
      />
    </Box>
  );
}
