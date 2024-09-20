import React, { useEffect, useState } from "react";
import { Controller, Control } from "react-hook-form";
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

interface SelectTypeDamageProps {
  control: Control<any>;
}

const SelectTypeDamage: React.FC<SelectTypeDamageProps> = ({ control }) => {
  const { data: session } = useSession();
  const [typeDamages, setTypeDamages] = useState<TypeDamageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [session?.accessToken]);

  return (
    <Controller
      name="type_damage_id"
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
              onChange(newValue ? newValue.id : null);
            }}
            value={typeDamages.find((damage) => damage.id === value) || null}
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
