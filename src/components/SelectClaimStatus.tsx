import React, { useEffect, useState } from "react";
import { Controller, Control } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
} from "@mui/material";
import { ClaimStatusData } from "../../app/types/claim-status";
import { getClaimStatuses } from "../../app/lib/actions/claimStatusActions";
import { useSession } from "next-auth/react";

interface SelectClaimStatusProps {
  control: Control<any>;
  initialValue?: ClaimStatusData;
}

const SelectClaimStatus: React.FC<SelectClaimStatusProps> = ({
  control,
  initialValue,
}) => {
  const { data: session } = useSession();
  const [claimStatuses, setClaimStatuses] = useState<ClaimStatusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClaimStatuses = async () => {
      try {
        setLoading(true);
        const token = session?.accessToken as string;
        const response = await getClaimStatuses(token);
        console.log("Fetched claim statuses response:", response);

        if (response.success && Array.isArray(response.data)) {
          setClaimStatuses(response.data);
          setError(null);
        } else {
          console.error(
            "Fetched data is not in the expected format:",
            response
          );
          setClaimStatuses([]);
          setError("Received invalid data format");
        }
      } catch (err) {
        console.error("Error fetching claim statuses:", err);
        setClaimStatuses([]);
        setError("Failed to fetch claim statuses");
      } finally {
        setLoading(false);
      }
    };

    fetchClaimStatuses();
  }, [session?.accessToken]);

  return (
    <Controller
      name="claim_status_id"
      control={control}
      defaultValue={initialValue?.id?.toString() || ""}
      render={({ field: { onChange, value, ...rest } }) => (
        <FormControl fullWidth>
          <InputLabel id="claim-status-select-label">Claim Status</InputLabel>
          <Select
            labelId="claim-status-select-label"
            {...rest}
            value={value ? value.toString() : ""}
            onChange={(e) => {
              const selectedValue = e.target.value;
              onChange(selectedValue ? parseInt(selectedValue, 10) : null);
            }}
            label="Claim Status"
            renderValue={(selected) => {
              const selectedStatus = claimStatuses.find(
                (status) => status.id?.toString() === selected
              );
              if (selectedStatus) {
                return (
                  <Chip
                    label={selectedStatus.claim_status_name}
                    sx={{
                      backgroundColor:
                        selectedStatus.background_color || "#e0e0e0",
                      color: "#ffffff",
                      fontWeight: "bold",
                    }}
                  />
                );
              }
              return "N/A";
            }}
          >
            <MenuItem value="">N/A</MenuItem>
            {Array.isArray(claimStatuses) && claimStatuses.length > 0 ? (
              claimStatuses.map((status) => (
                <MenuItem
                  key={status.id?.toString() ?? status.claim_status_name}
                  value={status.id?.toString() ?? ""}
                >
                  {status.claim_status_name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No claim statuses available</MenuItem>
            )}
          </Select>
          {error && <FormHelperText error>{error}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default SelectClaimStatus;
