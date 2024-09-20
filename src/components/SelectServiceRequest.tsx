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
import { checkServiceRequestsAvailable } from "../../app/lib/actions/claimsActions";
import { ServiceRequestData } from "../../app/types/service-request";

interface SelectServiceRequestProps {
  control: Control<any>;
}

const SelectServiceRequest: React.FC<SelectServiceRequestProps> = ({
  control,
}) => {
  const { data: session } = useSession();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequestData[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        setLoading(true);
        const token = session?.accessToken as string;
        const response = await checkServiceRequestsAvailable(token);

        if (response.success && Array.isArray(response.data)) {
          setServiceRequests(response.data);
          setError(null);
        } else {
          setServiceRequests([]);
          setError("Received invalid data format");
        }
      } catch (err) {
        setServiceRequests([]);
        setError("Failed to fetch service requests");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequests();
  }, [session?.accessToken]);

  const getServiceLabel = (request: ServiceRequestData) => {
    return request.requested_service || "Unnamed Service";
  };

  const filteredServiceRequests = serviceRequests.filter((request) =>
    getServiceLabel(request).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Controller
      name="service_request_id"
      control={control}
      defaultValue={[]}
      render={({ field, fieldState: { error: fieldError } }) => (
        <FormControl fullWidth error={!!fieldError || !!error}>
          <InputLabel id="service-requests-label">Service Requests</InputLabel>
          <Select
            multiple
            {...field}
            value={Array.isArray(field.value) ? field.value : []}
            input={<OutlinedInput label="Service Requests" />}
            renderValue={(selected) =>
              `${(selected as number[]).length} selected`
            }
          >
            {loading ? (
              <MenuItem disabled>
                <CircularProgress size={24} /> Loading service requests...
              </MenuItem>
            ) : serviceRequests.length > 0 ? (
              serviceRequests.map((request) => (
                <MenuItem
                  key={request.id ?? ""}
                  value={request.id?.toString() ?? ""}
                >
                  <Checkbox
                    checked={
                      Array.isArray(field.value) &&
                      field.value.indexOf(request.id?.toString() ?? "") > -1
                    }
                  />
                  <ListItemText primary={`${request.requested_service}`} />
                </MenuItem>
              ))
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
