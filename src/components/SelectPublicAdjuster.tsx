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
import { checkUsersAvailable } from "../../app/lib/actions/claimsActions"; // Ajusta la importación según tu estructura de proyecto

interface PublicAdjuster {
  id: string;
  name: string;
  last_name: string;
}

interface SelectPublicAdjusterProps {
  control: Control<any>;
}

const SelectPublicAdjuster: React.FC<SelectPublicAdjusterProps> = ({
  control,
}) => {
  const { data: session } = useSession();
  const [publicAdjusters, setPublicAdjusters] = useState<PublicAdjuster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicAdjusters = async () => {
      try {
        setLoading(true);
        const token = session?.accessToken as string;
        const role = "Public Adjuster";

        const response = await checkUsersAvailable(token, role);

        if (response.success && Array.isArray(response.data)) {
          setPublicAdjusters(response.data);
          setError(null);
        } else {
          setPublicAdjusters([]);
          setError("Received invalid data format");
        }
      } catch (err) {
        setPublicAdjusters([]);
        setError("Failed to fetch Public Adjusters");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicAdjusters(); // Ejecuta la función al cargar el componente
  }, [session?.accessToken]);

  return (
    <Controller
      name="public_adjuster_id"
      control={control}
      render={({
        field: { onChange, value, ...rest },
        fieldState: { error: fieldError },
      }) => (
        <FormControl fullWidth>
          <Autocomplete
            {...rest}
            options={publicAdjusters}
            getOptionLabel={(option) => `${option.name} ${option.last_name}`}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Public Adjuster"
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
              publicAdjusters.find((adjuster) => adjuster.id === value) || null
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

export default SelectPublicAdjuster;
