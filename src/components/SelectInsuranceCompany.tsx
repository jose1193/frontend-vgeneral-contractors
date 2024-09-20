import React, { useEffect, useState } from "react";
import { Controller, Control } from "react-hook-form";
import {
  FormControl,
  Autocomplete,
  TextField,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { InsuranceCompanyData } from "../../app/types/insurance-company";
import { checkInsuranceCompaniesAvailable } from "../../app/lib/actions/claimsActions";
import { useSession } from "next-auth/react";

interface SelectInsuranceCompanyProps {
  control: Control<any>;
}

const SelectInsuranceCompany: React.FC<SelectInsuranceCompanyProps> = ({
  control,
}) => {
  const { data: session } = useSession();
  const [insuranceCompanies, setInsuranceCompanies] = useState<
    InsuranceCompanyData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsuranceCompanies = async () => {
      try {
        setLoading(true);
        const token = session?.accessToken as string;
        const response = await checkInsuranceCompaniesAvailable(token);
        console.log("Fetched insurance companies response:", response);

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
  }, [session?.accessToken]);

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
              onChange(newValue ? newValue.id : null);
            }}
            value={
              insuranceCompanies.find((company) => company.id === value) || null
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

export default SelectInsuranceCompany;
