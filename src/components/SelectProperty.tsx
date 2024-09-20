import React, { useEffect, useState } from "react";
import { Controller, Control } from "react-hook-form";
import {
  FormControl,
  Autocomplete,
  TextField,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { PropertyData } from "../../app/types/property";
import { checkPropertiesAvailable } from "../../app/lib/actions/claimsActions";
import { useSession } from "next-auth/react";

interface SelectPropertyProps {
  control: Control<any>;
}

const SelectProperty: React.FC<SelectPropertyProps> = ({ control }) => {
  const { data: session } = useSession();
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const token = session?.accessToken as string;
        const response = await checkPropertiesAvailable(token);
        console.log("Fetched properties response:", response);

        if (response.success && Array.isArray(response.data)) {
          setProperties(response.data);
          setError(null);
        } else {
          console.error(
            "Fetched data is not in the expected format:",
            response
          );
          setProperties([]);
          setError("Received invalid data format");
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        setProperties([]);
        setError("Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [session?.accessToken]);

  return (
    <Controller
      name="property_id"
      control={control}
      render={({
        field: { onChange, value, ...rest },
        fieldState: { error: fieldError },
      }) => (
        <FormControl fullWidth>
          <Autocomplete
            {...rest}
            options={properties}
            getOptionLabel={(option) => {
              if (typeof option === "string") {
                return option;
              }

              // Concatenar los campos para mostrar
              return `${option.property_address}, ${option.property_city}, ${option.property_state} ${option.property_postal_code}, ${option.property_country}`;
            }}
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
            onChange={(_, newValue) => {
              onChange(newValue ? newValue.id : null);
            }}
            value={properties.find((property) => property.id === value) || null}
            isOptionEqualToValue={(option, value) =>
              option.id === (value?.id ?? value)
            }
          />
          {error && <FormHelperText error>{error}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default SelectProperty;
