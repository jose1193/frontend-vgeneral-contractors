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
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { control, setValue, watch } = useFormContext();

  const addressValue = watch(name);

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

      setValue("address", address, { shouldValidate: true });
      setValue("address_2", address2, { shouldValidate: true });
      setValue("zip_code", zipCode, { shouldValidate: true });
      setValue("city", city, { shouldValidate: true });
      setValue("state", state, { shouldValidate: true });
      setValue("country", country, { shouldValidate: true });
      setValue("latitude", addressDetails.latitude, { shouldValidate: true });
      setValue("longitude", addressDetails.longitude, { shouldValidate: true });

      console.log("Populated address fields:", {
        address,
        address2,
        zipCode,
        city,
        state,
        country,
        latitude: addressDetails.latitude,
        longitude: addressDetails.longitude,
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

        console.log("Selected address details:", addressDetails);
      }
    },
    [onAddressSelect, populateAddressFields]
  );

  const handleClearAddress = () => {
    setValue(name, "");
    setValue("address", "");
    setValue("address_2", "");
    setValue("zip_code", "");
    setValue("city", "");
    setValue("state", "");
    setValue("country", "");
    setValue("latitude", null);
    setValue("longitude", null);
    onAddressClear();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue(name, value);
    if (value === "") {
      handleClearAddress();
    }
  };

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
