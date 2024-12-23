import React, { useEffect } from "react";
import { Controller, Control, useWatch } from "react-hook-form";
import {
  FormControl,
  Autocomplete,
  TextField,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { PublicCompanyData } from "../../app/types/public-company";
import { checkPublicCompaniesAvailable } from "../../app/lib/actions/claimsActions";
import { useSession } from "next-auth/react";
import { usePublicCompanyStore } from "../../app/zustand/usePublicCompanyStore";

interface SelectPublicCompanyProps {
  control: Control<any>;
  name?: string; // Allow custom field name
  onChange?: (value: any) => void; // Optional callback for parent components
}

const SelectPublicCompany: React.FC<SelectPublicCompanyProps> = ({
  control,
  name = "public_company_id",
  onChange: externalOnChange,
}) => {
  const { data: session } = useSession();
  const {
    publicCompanies,
    loading,
    error,
    setPublicCompanies,
    setLoading,
    setError,
  } = usePublicCompanyStore();

  // Watch the field value
  const watchedValue = useWatch({
    control,
    name,
  });

  useEffect(() => {
    const fetchPublicCompanies = async () => {
      try {
        setLoading(true);
        const token = session?.accessToken as string;
        const response = await checkPublicCompaniesAvailable(token);
        console.log("Fetched public companies response:", response);

        if (response.success && Array.isArray(response.data)) {
          setPublicCompanies(response.data);
          setError(null);
        } else {
          console.error(
            "Fetched data is not in the expected format:",
            response
          );
          setPublicCompanies([]);
          setError("Received invalid data format");
        }
      } catch (err) {
        console.error("Error fetching public companies:", err);
        setPublicCompanies([]);
        setError("Failed to fetch public companies");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicCompanies();
  }, [session?.accessToken, setPublicCompanies, setLoading, setError]);

  // Find the selected company based on the watched value
  const selectedCompany = publicCompanies.find(
    (company) => company.id === watchedValue
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
            options={publicCompanies}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.public_company_name
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Public Company"
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
            value={selectedCompany || null}
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

export default SelectPublicCompany;
