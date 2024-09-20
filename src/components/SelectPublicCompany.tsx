import React, { useEffect, useState } from "react";
import { Controller, Control } from "react-hook-form";
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

interface SelectPublicCompanyProps {
  control: Control<any>;
}

const SelectPublicCompany: React.FC<SelectPublicCompanyProps> = ({
  control,
}) => {
  const { data: session } = useSession();
  const [publicCompanies, setPublicCompanies] = useState<PublicCompanyData[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [session?.accessToken]);

  return (
    <Controller
      name="public_company_id"
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
              onChange(newValue ? newValue.id : null);
            }}
            value={
              publicCompanies.find((company) => company.id === value) || null
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

export default SelectPublicCompany;
