import React, { useEffect } from "react";
import { Controller, Control, useWatch } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { AllianceCompanyData } from "../../app/types/alliance-company";
import { checkAllianceCompaniesAvailable } from "../../app/lib/actions/claimsActions";
import { useSession } from "next-auth/react";
import { useAllianceCompanyStore } from "../../app/zustand/useAllianceCompanyStore";

interface SelectAllianceCompanyProps {
  control: Control<any>;
  name?: string; // Allow custom field name
  onChange?: (value: any) => void;
}

const SelectAllianceCompany: React.FC<SelectAllianceCompanyProps> = ({
  control,
  name = "alliance_company_id",
  onChange: externalOnChange,
}) => {
  const { data: session } = useSession();
  const {
    allianceCompanies,
    loading,
    error,
    setAllianceCompanies,
    setLoading,
    setError,
  } = useAllianceCompanyStore();

  // Watch the field value
  const watchedValue = useWatch({
    control,
    name,
  });

  useEffect(() => {
    const fetchAllianceCompanies = async () => {
      try {
        setLoading(true);
        const token = session?.accessToken as string;
        const response = await checkAllianceCompaniesAvailable(token);
        console.log("Fetched alliance companies response:", response);

        if (response.success && Array.isArray(response.data)) {
          setAllianceCompanies(response.data);
          setError(null);
        } else {
          console.error(
            "Fetched data is not in the expected format:",
            response
          );
          setAllianceCompanies([]);
          setError("Received invalid data format");
        }
      } catch (err) {
        console.error("Error fetching alliance companies:", err);
        setAllianceCompanies([]);
        setError("Failed to fetch alliance companies");
      } finally {
        setLoading(false);
      }
    };

    fetchAllianceCompanies();
  }, [session?.accessToken, setAllianceCompanies, setLoading, setError]);

  // Find the selected company based on the watched value
  const selectedCompany = allianceCompanies.find(
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
        <FormControl fullWidth error={!!fieldError}>
          <InputLabel id="alliance-select-label">Alliance Company</InputLabel>
          <Select
            labelId="alliance-select-label"
            {...rest}
            value={value ?? ""}
            onChange={(e) => {
              const selectedValue = e.target.value;
              const newValue =
                selectedValue === "" ? null : Number(selectedValue);
              onChange(newValue);
              if (externalOnChange) {
                externalOnChange(newValue);
              }
            }}
            label="Alliance Company"
          >
            <MenuItem value="">N/A</MenuItem>
            {allianceCompanies.map((company) => (
              <MenuItem key={company.id} value={company.id}>
                {company.alliance_company_name}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText error>{error}</FormHelperText>}
          {fieldError && (
            <FormHelperText error>{fieldError.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default SelectAllianceCompany;
