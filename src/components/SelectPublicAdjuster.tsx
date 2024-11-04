import React, { useEffect } from "react";
import { Controller, Control, useWatch } from "react-hook-form";
import {
  FormControl,
  Autocomplete,
  TextField,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { checkUsersAvailable } from "../../app/lib/actions/claimsActions";
import { ClaimsData } from "../../app/types/claims";
import { useUserStore } from "../../app/zustand/useUserStore";

interface SelectPublicAdjusterProps {
  control: Control<ClaimsData>;
  publicAdjusterAssignment?: {
    id?: number;
    name: string;
    last_name?: string | null;
  } | null;
}

const SelectPublicAdjuster: React.FC<SelectPublicAdjusterProps> = ({
  control,
  publicAdjusterAssignment,
}) => {
  const { data: session } = useSession();
  const {
    users: publicAdjusters,
    loading,
    error,
    setUsers: setPublicAdjusters,
    setLoading,
    setError,
  } = useUserStore();

  // Watch the field value
  const watchedValue = useWatch({
    control,
    name: "public_adjuster_id" as const,
  });

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
          console.error(
            "Fetched data is not in the expected format:",
            response
          );
          setPublicAdjusters([]);
          setError("Received invalid data format");
        }
      } catch (err) {
        console.error("Error fetching public adjusters:", err);
        setPublicAdjusters([]);
        setError("Failed to fetch Public Adjusters");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicAdjusters();
  }, [session?.accessToken, setPublicAdjusters, setLoading, setError]);

  // Find the selected adjuster based on the watched value or initialData
  const selectedAdjuster =
    publicAdjusters.find((adjuster) => adjuster.id === watchedValue) ||
    publicAdjusterAssignment ||
    null;

  return (
    <Controller
      name="public_adjuster_id"
      control={control}
      defaultValue={publicAdjusterAssignment?.id || null}
      render={({
        field: { onChange, value, ...rest },
        fieldState: { error: fieldError },
      }) => (
        <FormControl fullWidth>
          <Autocomplete
            {...rest}
            options={publicAdjusters}
            getOptionLabel={(option) =>
              typeof option === "string"
                ? option
                : `${option.name} ${option.last_name || ""}`.trim()
            }
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
              const newId = newValue ? newValue.id : null;
              onChange(newId);
            }}
            value={selectedAdjuster}
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
