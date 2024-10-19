import React, { useEffect, useRef, useCallback } from "react";
import {
  TextField,
  Box,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useGoogleMapsApi } from "../hooks/useGoogleMapsApi";
import { useFormContext, Controller } from "react-hook-form";

interface AddressDetails {
  address: string | null;
  zip_code: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface AddressAutocompleteProps {
  onAddressSelect: (addressDetails: AddressDetails) => void;
  onAddressClear: () => void;
  name: string;
  label: string;
  defaultValue?: string;
}

export default function AddressAutocomplete({
  onAddressSelect,
  onAddressClear,
  name,
  label,
  defaultValue = "",
}: AddressAutocompleteProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const inputRef = useRef<HTMLInputElement>(null);
  const { control, setValue, watch } = useFormContext();

  const addressValue = watch(name);

  const handleAddressSelect = useCallback(
    (place: google.maps.places.PlaceResult) => {
      const addressDetails: AddressDetails = {
        address: "",
        zip_code: null,
        city: null,
        state: null,
        country: null,
        latitude: place.geometry?.location?.lat() || null,
        longitude: place.geometry?.location?.lng() || null,
      };

      place.address_components?.forEach((component) => {
        const types = component.types;

        if (types.includes("street_number") || types.includes("route")) {
          addressDetails.address = (
            addressDetails.address +
            " " +
            component.long_name
          ).trim();
        } else if (types.includes("postal_code")) {
          addressDetails.zip_code = component.long_name;
        } else if (types.includes("locality")) {
          addressDetails.city = component.long_name;
        } else if (types.includes("administrative_area_level_1")) {
          addressDetails.state = component.short_name;
        } else if (types.includes("country")) {
          addressDetails.country = component.long_name;
        }
      });

      Object.entries(addressDetails).forEach(([key, value]) => {
        setValue(key, value);
      });

      onAddressSelect(addressDetails);
    },
    [setValue, onAddressSelect]
  );

  const handleClearAddress = () => {
    setValue(name, "");
    onAddressClear();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue(name, value);
    if (value === "") {
      onAddressClear();
    }
  };

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
            placeholder={`Enter the ${label.toLowerCase()}`}
            disabled={!isLoaded}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <>
                  {!isLoaded && <CircularProgress color="inherit" size={20} />}
                  {addressValue && (
                    <IconButton
                      aria-label="clear address"
                      onClick={handleClearAddress}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                </>
              ),
            }}
          />
        )}
      />
    </Box>
  );
}
