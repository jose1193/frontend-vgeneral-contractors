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

export interface AddressDetails {
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  latitude: number;
  longitude: number;
}

interface AddressAutocompleteProps {
  onAddressSelect: (details: AddressDetails) => void;
  onAddressClear: () => void;
  name: string;
  label: string;
  defaultValue?: string;
  error?: boolean;
  helperText?: string;
}

const AddressAutocompleteProfile: React.FC<AddressAutocompleteProps> = ({
  onAddressSelect,
  onAddressClear,
  name,
  label,
  defaultValue = "",
  error: isError,
  helperText,
}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = React.useState(defaultValue);

  const handleAddressSelect = useCallback(
    (place: google.maps.places.PlaceResult) => {
      if (place.address_components && place.geometry?.location) {
        const addressDetails: AddressDetails = {
          address: "",
          city: "",
          state: "",
          country: "",
          zip_code: "",
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        };

        place.address_components.forEach((component) => {
          const componentType = component.types[0];

          switch (componentType) {
            case "street_number": {
              addressDetails.address = `${component.long_name} ${addressDetails.address}`;
              break;
            }
            case "route": {
              addressDetails.address += component.long_name;
              break;
            }
            case "postal_code": {
              addressDetails.zip_code = component.long_name;
              break;
            }
            case "locality":
            case "postal_town": {
              addressDetails.city = component.long_name;
              break;
            }
            case "administrative_area_level_1": {
              addressDetails.state = component.short_name;
              break;
            }
            case "country": {
              addressDetails.country = component.long_name;
              break;
            }
          }
        });

        setInputValue(addressDetails.address);
        onAddressSelect(addressDetails);
      }
    },
    [onAddressSelect]
  );

  const handleClearAddress = useCallback(() => {
    setInputValue("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onAddressClear();
  }, [onAddressClear]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);
      if (value === "") {
        handleClearAddress();
      }
    },
    [handleClearAddress]
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
          fields: ["address_components", "geometry"],
          types: ["address"],
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place) {
          handleAddressSelect(place);
        }
      });
    }
  }, [isLoaded, handleAddressSelect]); // Added handleAddressSelect to dependencies

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <TextField
        inputRef={inputRef}
        variant="outlined"
        fullWidth
        id={name}
        name={name}
        label={label}
        value={inputValue}
        onChange={handleChange}
        disabled={!isLoaded}
        error={isError}
        helperText={helperText}
        placeholder="Enter your address"
        InputProps={{
          endAdornment: (
            <>
              {!isLoaded && <CircularProgress color="inherit" size={20} />}
              {inputValue && (
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
    </Box>
  );
};

export default AddressAutocompleteProfile;
