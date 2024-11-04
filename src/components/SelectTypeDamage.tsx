import React, { useEffect } from "react";
import { Controller, Control, useWatch } from "react-hook-form";
import {
  FormControl,
  Autocomplete,
  TextField,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { TypeDamageData } from "../../app/types/type-damage";
import { checkTypeDamagesAvailable } from "../../app/lib/actions/claimsActions";
import { useSession } from "next-auth/react";
import { useTypeDamageStore } from "../../app/zustand/useTypeDamageStore";

interface SelectTypeDamageProps {
  control: Control<any>;
  name?: string; // Allow custom field name
  onChange?: (value: any) => void; // Optional callback for parent components
}

const SelectTypeDamage: React.FC<SelectTypeDamageProps> = ({
  control,
  name = "type_damage_id",
  onChange: externalOnChange,
}) => {
  const { data: session } = useSession();
  const { typeDamages, loading, error, setTypeDamages, setLoading, setError } =
    useTypeDamageStore();

  // Watch the field value
  const watchedValue = useWatch({
    control,
    name,
  });

  useEffect(() => {
    const fetchTypeDamages = async () => {
      try {
        setLoading(true);
        const token = session?.accessToken as string;
        const response = await checkTypeDamagesAvailable(token);
        console.log("Fetched type damages response:", response);

        if (response.success && Array.isArray(response.data)) {
          setTypeDamages(response.data);
          setError(null);
        } else {
          console.error(
            "Fetched data is not in the expected format:",
            response
          );
          setTypeDamages([]);
          setError("Received invalid data format");
        }
      } catch (err) {
        console.error("Error fetching type damages:", err);
        setTypeDamages([]);
        setError("Failed to fetch type damages");
      } finally {
        setLoading(false);
      }
    };

    fetchTypeDamages();
  }, [session?.accessToken, setTypeDamages, setLoading, setError]);

  // Find the selected damage based on the watched value
  const selectedDamage = typeDamages.find(
    (damage) => damage.id === watchedValue
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value, ...rest },
        fieldState: { error: fieldError },
      }) => (
        <FormControl fullWidth>
          <Autocomplete
            {...rest}
            options={typeDamages}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.type_damage_name
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Type Damage"
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
              const newId = newValue ? newValue.id : null;
              onChange(newId);
              if (externalOnChange) {
                externalOnChange(newId);
              }
            }}
            value={selectedDamage || null}
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

export default SelectTypeDamage;
