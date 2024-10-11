import React, { useEffect, useRef, useCallback } from "react";
import { TextField, Box, Typography, CircularProgress } from "@mui/material";
import { useGoogleMapsApi } from "../hooks/useGoogleMapsApi";
import { useFormContext } from "react-hook-form";

interface AddressDetails {
  formatted_address: string;
  latitude: number;
  longitude: number;
}

interface CompanySignatureAutocompleteProps {
  onAddressSelect: (addressDetails: AddressDetails) => void;
  name: string;
  label: string;
  defaultValue?: string;
}

export default function CompanySignatureAutocomplete({
  onAddressSelect,
  name,
  label,
  defaultValue = "",
}: CompanySignatureAutocompleteProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { setValue } = useFormContext();

  const removeCountryFromAddress = (address: string): string => {
    const parts = address.split(",");
    if (parts.length > 1) {
      // Remove the last part (country) and join the rest
      return parts.slice(0, -1).join(",").trim();
    }
    return address;
  };

  const handleAddressSelect = useCallback(
    (place: google.maps.places.PlaceResult) => {
      if (place.formatted_address && place.geometry?.location) {
        const addressWithoutCountry = removeCountryFromAddress(
          place.formatted_address
        );
        const addressDetails: AddressDetails = {
          formatted_address: addressWithoutCountry,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        };
        onAddressSelect(addressDetails);
        setValue(name, addressDetails.formatted_address, {
          shouldValidate: true,
        });
        setValue("latitude", addressDetails.latitude, { shouldValidate: true });
        setValue("longitude", addressDetails.longitude, {
          shouldValidate: true,
        });
      }
    },
    [onAddressSelect, setValue, name]
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
          fields: ["formatted_address", "geometry"],
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
        label={label}
        placeholder={`Enter company address`}
        disabled={!isLoaded}
        defaultValue={defaultValue}
        InputProps={{
          endAdornment: !isLoaded && (
            <CircularProgress color="inherit" size={20} />
          ),
        }}
      />
    </Box>
  );
}
