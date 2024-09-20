import React from "react";
import { Controller, Control } from "react-hook-form";
import {
  FormControl,
  Autocomplete,
  TextField,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { PropertyData } from "../../app/types/property";
import { usePropertyContext } from "../../app/contexts/PropertyContext";

interface SelectPropertyProps {
  control: Control<any>;
}

const SelectProperty: React.FC<SelectPropertyProps> = ({ control }) => {
  const { properties, loading, error } = usePropertyContext();

  const formatPropertyLabel = (option: PropertyData): string => {
    return `${option.property_address.toUpperCase()}, ${option.property_city.toUpperCase()}, ${option.property_state.toUpperCase()} ${option.property_postal_code.toUpperCase()}, ${option.property_country.toUpperCase()}`;
  };

  return (
    <Controller
      name="property_id"
      control={control}
      render={({
        field: { onChange, value, ...rest },
        fieldState: { error: fieldError },
      }) => (
        <FormControl fullWidth>
          <Autocomplete<PropertyData, false, false, false>
            {...rest}
            options={properties}
            getOptionLabel={(option: PropertyData | string): string => {
              if (typeof option === "string") {
                return option.toUpperCase();
              }
              return formatPropertyLabel(option);
            }}
            renderOption={(props, option: PropertyData) => (
              <li {...props}>{formatPropertyLabel(option)}</li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Property"
                error={!!fieldError}
                helperText={fieldError?.message}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            loading={loading}
            onChange={(_, newValue: PropertyData | null) => {
              onChange(newValue ? newValue.id : null);
            }}
            value={properties.find((property) => property.id === value) || null}
            isOptionEqualToValue={(
              option: PropertyData,
              value: PropertyData | string
            ) => option.id === (typeof value === "string" ? value : value.id)}
          />
          {error && <FormHelperText error>{error}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default SelectProperty;
