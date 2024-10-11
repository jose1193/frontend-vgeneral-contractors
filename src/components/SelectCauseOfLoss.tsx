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
import { getCauseOfLosses } from "../../app/lib/actions/causeOfLossActions"; // Asume que existe esta función

interface CauseOfLoss {
  id: number;
  cause_loss_name: string;
}

interface SelectCauseOfLossProps {
  control: Control<any>;
}

const SelectCauseOfLoss: React.FC<SelectCauseOfLossProps> = ({ control }) => {
  const { data: session } = useSession();
  const [causesOfLoss, setCausesOfLoss] = useState<CauseOfLoss[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCauses = async () => {
      try {
        setLoading(true);
        const token = session?.accessToken as string;

        const response = await getCauseOfLosses(token);

        if (response.success && Array.isArray(response.data)) {
          setCausesOfLoss(response.data);
          setError(null);
        } else {
          setCausesOfLoss([]);
          setError("Received invalid data format");
        }
      } catch (err) {
        setCausesOfLoss([]);
        setError("Failed to fetch Causes of Loss");
      } finally {
        setLoading(false);
      }
    };

    fetchCauses();
  }, [session?.accessToken]);

  const filteredCausesOfLoss = causesOfLoss.filter((cause) =>
    cause.cause_loss_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Controller
      name="cause_of_loss_id"
      control={control}
      defaultValue={[]}
      render={({ field, fieldState: { error: fieldError } }) => (
        <FormControl fullWidth error={!!fieldError || !!error}>
          <InputLabel id="causes-of-loss-label">Causes of Loss</InputLabel>
          <Select
            {...field}
            multiple
            labelId="causes-of-loss-label"
            label="Causes of Loss"
            input={<OutlinedInput label="Causes of Loss" />}
            renderValue={(selected) => (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {(selected as number[]).map((id) => {
                  const cause = causesOfLoss.find((c) => c.id === id);
                  return cause ? (
                    <Chip
                      key={id}
                      label={cause.cause_loss_name}
                      onDelete={() => {
                        const newValue = (field.value as number[]).filter(
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
                <CircularProgress size={24} /> Loading causes of loss...
              </MenuItem>
            ) : filteredCausesOfLoss.length > 0 ? (
              filteredCausesOfLoss.map((cause) => (
                <MenuItem key={cause.id} value={cause.id}>
                  <Checkbox
                    checked={(field.value as number[]).indexOf(cause.id) > -1}
                  />
                  <ListItemText primary={cause.cause_loss_name} />
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No causes of loss available</MenuItem>
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

export default SelectCauseOfLoss;
