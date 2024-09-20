import React, { useEffect, useState } from "react";
import { Controller, Control } from "react-hook-form";
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

interface SelectAllianceCompanyProps {
  control: Control<any>;
}

const SelectAllianceCompany: React.FC<SelectAllianceCompanyProps> = ({
  control,
}) => {
  const { data: session } = useSession();
  const [allianceCompanies, setAllianceCompanies] = useState<
    AllianceCompanyData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [session?.accessToken]);

  return (
    <Controller
      name="alliance_company_id"
      control={control}
      render={({ field: { onChange, value, ...rest } }) => (
        <FormControl fullWidth>
          <InputLabel id="alliance-select-label">Alliance Company</InputLabel>
          <Select
            labelId="alliance-select-label"
            {...rest}
            value={value ? value.toString() : ""}
            onChange={(e) => {
              const selectedValue = e.target.value;
              onChange(selectedValue ? parseInt(selectedValue, 10) : null);
            }}
            label="Alliance Company"
          >
            <MenuItem value="">N/A</MenuItem>
            {Array.isArray(allianceCompanies) &&
            allianceCompanies.length > 0 ? (
              allianceCompanies.map((company) => (
                <MenuItem
                  key={company.id ?? company.alliance_company_name}
                  value={company.id ? company.id.toString() : ""}
                >
                  {company.alliance_company_name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No alliance companies available</MenuItem>
            )}
          </Select>
          {error && <FormHelperText error>{error}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default SelectAllianceCompany;
