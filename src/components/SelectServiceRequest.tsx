import React, { useEffect } from "react";
import { Controller, Control, useWatch } from "react-hook-form";
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
import { checkServiceRequestsAvailable } from "../../app/lib/actions/claimsActions";
import { useRequiredServiceStore } from "../../app/zustand/useRequiredServiceStore";
import { ServiceRequestData } from "../../app/types/service-request";

interface SelectServiceRequestProps {
  control: Control<any>;
  name?: string;
  onChange?: (value: number[]) => void;
}

const SelectServiceRequest: React.FC<SelectServiceRequestProps> = ({
  control,
  name = "service_request_id",
  onChange: externalOnChange,
}) => {
  const { data: session } = useSession();
  const {
    services,
    loading,
    error,
    searchTerm,
    setServices,
    setLoading,
    setError,
    setSearchTerm,
    getFilteredServices,
  } = useRequiredServiceStore();

  // Watch for value changes
  const watchedValue = useWatch({
    control,
    name,
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const token = session?.accessToken as string;
        const response = await checkServiceRequestsAvailable(token);

        if (response.success && Array.isArray(response.data)) {
          const validServices = response.data.filter(
            (
              service: ServiceRequestData
            ): service is ServiceRequestData & { id: number } =>
              typeof service.id === "number"
          );
          setServices(validServices);
          setError(null);
        } else {
          setServices([]);
          setError("Received invalid data format");
        }
      } catch (err) {
        setServices([]);
        setError("Failed to fetch Service Requests");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [session?.accessToken, setServices, setError, setLoading]);

  const filteredServices = getFilteredServices();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field, fieldState: { error: fieldError } }) => (
        <FormControl fullWidth error={!!fieldError || !!error}>
          <InputLabel id="service-requests-label">Service Requests</InputLabel>
          <Select
            {...field}
            multiple
            labelId="service-requests-label"
            label="Service Requests"
            input={<OutlinedInput label="Service Requests" />}
            renderValue={(selected) => (
              <div className="flex flex-wrap gap-2">
                {(selected as number[]).map((selectedId: number) => {
                  const service = services.find(
                    (s: ServiceRequestData) => s.id === selectedId
                  );
                  return service?.id ? (
                    <Chip
                      key={service.id}
                      label={service.requested_service}
                      onDelete={() => {
                        const newValue = (field.value as number[]).filter(
                          (v: number) => v !== service.id
                        );
                        field.onChange(newValue);
                        if (externalOnChange) {
                          externalOnChange(newValue);
                        }
                      }}
                    />
                  ) : null;
                })}
              </div>
            )}
            onChange={(e) => {
              field.onChange(e);
              if (externalOnChange) {
                externalOnChange(e.target.value as number[]);
              }
            }}
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
                <CircularProgress size={24} /> Loading service requests...
              </MenuItem>
            ) : filteredServices.length > 0 ? (
              filteredServices.map((service: ServiceRequestData) =>
                service.id ? (
                  <MenuItem key={service.id} value={service.id}>
                    <Checkbox
                      checked={
                        Array.isArray(field.value) &&
                        field.value.includes(service.id)
                      }
                    />
                    <ListItemText primary={service.requested_service} />
                  </MenuItem>
                ) : null
              )
            ) : (
              <MenuItem disabled>No service requests available</MenuItem>
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

export default SelectServiceRequest;
