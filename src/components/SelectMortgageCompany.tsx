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
import { useMortgageCompanyStore } from "../../app/zustand/useMortgageCompanyStore";
import { useMortgageCompanies } from "../../src/hooks/useMortgageCompanies";
import { MortgageCompanyData } from "../../app/types/mortgage-company";
import { ClaimsData } from "../../app/types/claims";

interface SelectMortgageCompanyProps {
  control: Control<ClaimsData>;
  name: `affidavit.${keyof ClaimsData["affidavit"]}`;
  onChange?: (value: any) => void;
}

const SelectMortgageCompany: React.FC<SelectMortgageCompanyProps> = ({
  control,
  name = "affidavit.mortgage_company_id",
  onChange: externalOnChange,
}) => {
  const { data: session } = useSession();
  const token = session?.accessToken as string;

  // Properly typed useWatch
  const watchedValue = useWatch({
    control,
    name: name as keyof ClaimsData,
  });

  const {
    mortgageCompanies: hookCompanies,
    loading: hookLoading,
    error: hookError,
  } = useMortgageCompanies(token);

  const {
    mortgageCompanies,
    loading,
    error,
    setMortgageCompanies,
    setLoading,
    setError,
  } = useMortgageCompanyStore();

  useEffect(() => {
    setLoading(hookLoading);
    setError(hookError);
    if (hookCompanies.length > 0) {
      setMortgageCompanies(hookCompanies);
    }
  }, [
    hookCompanies,
    hookLoading,
    hookError,
    setMortgageCompanies,
    setLoading,
    setError,
  ]);

  const selectedCompany = mortgageCompanies.find(
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
        <FormControl fullWidth error={!!fieldError || !!error}>
          <Autocomplete
            {...rest}
            options={mortgageCompanies}
            getOptionLabel={(option: MortgageCompanyData | string) =>
              typeof option === "string" ? option : option.mortgage_company_name
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Mortgage Company"
                error={!!fieldError || !!error}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading && (
                        <CircularProgress color="inherit" size={20} />
                      )}
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
          {(error || fieldError) && (
            <FormHelperText>{fieldError?.message || error}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default SelectMortgageCompany;
