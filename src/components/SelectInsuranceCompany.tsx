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
import { useInsuranceCompanyStore } from "../../app/zustand/useInsuranceCompanyStore";
import { checkInsuranceCompaniesAvailable } from "../../app/lib/actions/claimsActions";

interface SelectInsuranceCompanyProps {
  control: Control<any>;
  name?: string; // Allow custom field name
  onChange?: (value: any) => void; // Optional callback for parent components
}

const SelectInsuranceCompany: React.FC<SelectInsuranceCompanyProps> = ({
  control,
  name = "insurance_company_id",
  onChange: externalOnChange,
}) => {
  const { data: session } = useSession();
  const {
    insuranceCompanies,
    loading,
    error,
    setInsuranceCompanies,
    setLoading,
    setError,
  } = useInsuranceCompanyStore();

  // Watch the field value
  const watchedValue = useWatch({
    control,
    name,
  });

  useEffect(() => {
    const fetchInsuranceCompanies = async () => {
      try {
        setLoading(true);
        const token = session?.accessToken as string;
        const response = await checkInsuranceCompaniesAvailable(token);

        if (response.success && Array.isArray(response.data)) {
          setInsuranceCompanies(response.data);
          setError(null);
        } else {
          console.error(
            "Fetched data is not in the expected format:",
            response
          );
          setInsuranceCompanies([]);
          setError("Received invalid data format");
        }
      } catch (err) {
        console.error("Error fetching insurance companies:", err);
        setInsuranceCompanies([]);
        setError("Failed to fetch insurance companies");
      } finally {
        setLoading(false);
      }
    };

    fetchInsuranceCompanies();
  }, [session?.accessToken, setInsuranceCompanies, setLoading, setError]);

  // Find the selected company based on the watched value
  const selectedCompany = insuranceCompanies.find(
    (company) => company.id === watchedValue
  );

  return (
    <Controller
      name="insurance_company_id"
      control={control}
      render={({
        field: { onChange, value, ...rest },
        fieldState: { error: fieldError },
      }) => (
        <FormControl fullWidth>
          <Autocomplete
            {...rest}
            options={insuranceCompanies}
            getOptionLabel={(option) =>
              typeof option === "string"
                ? option
                : option.insurance_company_name
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Insurance Company"
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

export default SelectInsuranceCompany;
