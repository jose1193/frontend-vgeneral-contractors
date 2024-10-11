import React, { useEffect, useState } from "react";
import { Controller, Control } from "react-hook-form";
import {
  FormControl,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  Typography,
  TextField,
  Chip,
  ListSubheader,
  InputAdornment,
  CircularProgress,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSession } from "next-auth/react";
import { checkAllianceCompaniesAvailable } from "../../app/lib/actions/claimsActions";
import { AllianceCompanyData } from "../../app/types/alliance-company";

interface SelectProhibitedAlliancesProps {
  control: Control<any>;
  initialAlliances: AllianceCompanyData[];
}

const SelectProhibitedAlliances: React.FC<SelectProhibitedAlliancesProps> = ({
  control,
  initialAlliances,
}) => {
  const { data: session } = useSession();
  const [allianceCompanies, setAllianceCompanies] = useState<
    AllianceCompanyData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllianceCompanies = async () => {
      try {
        setLoading(true);
        const token = session?.accessToken as string;

        const response = await checkAllianceCompaniesAvailable(token);

        if (response.success && Array.isArray(response.data)) {
          // Combinar las alianzas iniciales con las obtenidas de la API
          const combinedAlliances = [...initialAlliances, ...response.data];
          // Eliminar duplicados basados en el uuid
          const uniqueAlliances = Array.from(
            new Map(combinedAlliances.map((item) => [item.uuid, item])).values()
          );
          setAllianceCompanies(uniqueAlliances);
          setError(null);
        } else {
          setAllianceCompanies(initialAlliances);
          setError("Received invalid data format");
        }
      } catch (err) {
        setAllianceCompanies(initialAlliances);
        setError("Failed to fetch Alliance Companies");
      } finally {
        setLoading(false);
      }
    };

    fetchAllianceCompanies();
  }, [session?.accessToken, initialAlliances]);

  const filteredAllianceCompanies = allianceCompanies.filter((company) =>
    company.alliance_company_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Helper function to get a unique identifier for each company
  const getCompanyId = (company: AllianceCompanyData): string => {
    return (
      company.uuid || company.id?.toString() || company.alliance_company_name
    );
  };

  return (
    <Controller
      name="prohibited_alliances"
      control={control}
      defaultValue={initialAlliances.map((alliance) => getCompanyId(alliance))}
      render={({ field, fieldState: { error: fieldError } }) => (
        <FormControl fullWidth error={!!fieldError || !!error}>
          <InputLabel id="prohibited-alliances-label">
            Prohibited Alliances
          </InputLabel>
          <Select
            {...field}
            multiple
            labelId="prohibited-alliances-label"
            label="Prohibited With Alliances"
            input={<OutlinedInput label="Prohibited Alliances" />}
            renderValue={(selected) => (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {(selected as string[]).map((id) => {
                  const company = allianceCompanies.find(
                    (c) => getCompanyId(c) === id
                  );
                  return company ? (
                    <Chip
                      key={id}
                      label={company.alliance_company_name}
                      onDelete={() => {
                        const newValue = (field.value as string[]).filter(
                          (v) => v !== id
                        );
                        field.onChange(newValue);
                      }}
                    />
                  ) : null;
                })}
              </div>
            )}
          >
            <ListSubheader>
              <TextField
                size="small"
                autoFocus
                placeholder="Type to search..."
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Escape") {
                    e.stopPropagation();
                  }
                }}
              />
            </ListSubheader>
            {loading ? (
              <MenuItem disabled>
                <CircularProgress size={24} /> Loading alliance companies...
              </MenuItem>
            ) : filteredAllianceCompanies.length > 0 ? (
              filteredAllianceCompanies.map((company) => (
                <MenuItem
                  key={getCompanyId(company)}
                  value={getCompanyId(company)}
                >
                  <Checkbox
                    checked={
                      (field.value as string[]).indexOf(getCompanyId(company)) >
                      -1
                    }
                  />
                  <ListItemText primary={company.alliance_company_name} />
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No alliance companies available</MenuItem>
            )}
          </Select>
          {(error || fieldError) && (
            <Typography color="error" variant="caption">
              {error || fieldError?.message}
            </Typography>
          )}
        </FormControl>
      )}
    />
  );
};

export default SelectProhibitedAlliances;
