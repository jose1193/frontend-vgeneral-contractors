import React, { useEffect, useState } from "react";
import { Controller, Control } from "react-hook-form";
import {
  FormControl,
  TextField,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useSession } from "next-auth/react";
import { checkUsersAvailable } from "../../app/lib/actions/claimsActions";

interface Salesperson {
  id: string;
  name: string;
  last_name: string;
}

interface SelectSalespersonProps {
  control: Control<any>;
}

const SelectSalesperson: React.FC<SelectSalespersonProps> = ({ control }) => {
  const { data: session } = useSession();
  const [salespersons, setSalespersons] = useState<Salesperson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalespersons = async () => {
      try {
        setLoading(true);
        const token = session?.accessToken as string;
        const role = "Salesperson";

        const response = await checkUsersAvailable(token, role);

        if (response.success && Array.isArray(response.data)) {
          setSalespersons(response.data);
          setError(null);
        } else {
          setSalespersons([]);
          setError("Received invalid data format");
        }
      } catch (err) {
        setSalespersons([]);
        setError("Failed to fetch Salespersons");
      } finally {
        setLoading(false);
      }
    };

    fetchSalespersons();
  }, [session?.accessToken]);

  return (
    <Controller
      name="salesperson_id"
      control={control}
      render={({
        field: { onChange, value, ...rest },
        fieldState: { error: fieldError },
      }) => (
        <FormControl fullWidth>
          <Autocomplete
            {...rest}
            options={salespersons}
            getOptionLabel={(option) => `${option.name} ${option.last_name}`}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Salesperson"
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
            value={
              salespersons.find((salesperson) => salesperson.id === value) ||
              null
            }
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

export default SelectSalesperson;
