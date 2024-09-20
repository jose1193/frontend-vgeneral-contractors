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
import { checkUsersAvailable } from "../../app/lib/actions/claimsActions";

interface TechnicalService {
  id: string;
  name: string | null;
  last_name: string | null;
}

interface SelectTechnicalServicesProps {
  control: Control<any>;
}

const SelectTechnicalServices: React.FC<SelectTechnicalServicesProps> = ({
  control,
}) => {
  const { data: session } = useSession();
  const [technicalServices, setTechnicalServices] = useState<
    TechnicalService[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTechnicalServices = async () => {
      try {
        setLoading(true);
        const token = session?.accessToken as string;
        const role = "Technical Services";

        const response = await checkUsersAvailable(token, role);

        if (response.success && Array.isArray(response.data)) {
          setTechnicalServices(response.data);
          setError(null);
        } else {
          setTechnicalServices([]);
          setError("Received invalid data format");
        }
      } catch (err) {
        setTechnicalServices([]);
        setError("Failed to fetch Technical Services");
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicalServices();
  }, [session?.accessToken]);

  const getServiceLabel = (service: TechnicalService) => {
    const name = service.name?.toUpperCase() || "";
    const lastName = service.last_name?.toUpperCase() || "";
    return `${name} ${lastName}`.trim() || "Unnamed Service";
  };

  const filteredTechnicalServices = technicalServices.filter((service) =>
    getServiceLabel(service).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Controller
      name="technical_service_ids"
      control={control}
      defaultValue={[]}
      render={({ field, fieldState: { error: fieldError } }) => (
        <FormControl fullWidth error={!!fieldError || !!error}>
          <InputLabel id="technical-services-label">
            Technical Services
          </InputLabel>
          <Select
            {...field}
            multiple
            labelId="technical-services-label"
            label="Technical Services"
            input={<OutlinedInput label="Technical Services" />}
            renderValue={(selected) => (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {(selected as string[]).map((id) => {
                  const service = technicalServices.find((s) => s.id === id);
                  return service ? (
                    <Chip
                      key={id}
                      label={getServiceLabel(service)}
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
                <CircularProgress size={24} /> Loading technical services...
              </MenuItem>
            ) : filteredTechnicalServices.length > 0 ? (
              filteredTechnicalServices.map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  <Checkbox
                    checked={(field.value as string[]).indexOf(service.id) > -1}
                  />
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        {getServiceLabel(service)}
                      </Typography>
                    }
                  />
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No technical services available</MenuItem>
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

export default SelectTechnicalServices;
