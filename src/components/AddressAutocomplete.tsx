import React from "react";
import { TextField, Box, Typography, CircularProgress } from "@mui/material";
import { useGoogleMapsApi } from "../hooks/useGoogleMapsApi";

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
}

export default function AddressAutocomplete({
  onAddressSelect,
}: AddressAutocompleteProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const { inputRef, isLoaded, error } = useGoogleMapsApi({
    apiKey,
    onAddressSelect: (place: google.maps.places.PlaceResult) => {
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
        console.log("Address details:", addressDetails);
      }
    },
  });

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "sm" }}>
      <TextField
        inputRef={inputRef}
        label="Address Map"
        variant="outlined"
        fullWidth
        id="address"
        placeholder="Enter your address"
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
