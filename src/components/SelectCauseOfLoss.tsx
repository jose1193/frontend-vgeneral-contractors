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
import { getCauseOfLosses } from "../../app/lib/actions/causeOfLossActions";
import { useCauseOfLossStore } from "../../app/zustand/useCauseOfLossStore";
import { CauseOfLossData } from "../../app/types/cause-of-loss";

interface SelectCauseOfLossProps {
  control: Control<any>;
  name?: string;
  onChange?: (value: number[]) => void;
}

const SelectCauseOfLoss: React.FC<SelectCauseOfLossProps> = ({
  control,
  name = "cause_of_loss_id",
  onChange: externalOnChange,
}) => {
  const { data: session } = useSession();
  const {
    causesOfLoss,
    loading,
    error,
    searchTerm,
    setCausesOfLoss,
    setLoading,
    setError,
    setSearchTerm,
    getFilteredCauses,
  } = useCauseOfLossStore();

  // Watch for value changes
  const watchedValue = useWatch({
    control,
    name,
  });

  useEffect(() => {
    const fetchCauses = async () => {
      try {
        setLoading(true);
        const token = session?.accessToken as string;
        const response = await getCauseOfLosses(token);

        if (response.success && Array.isArray(response.data)) {
          const validCauses = response.data.filter(
            (
              cause: CauseOfLossData
            ): cause is CauseOfLossData & { id: number } =>
              typeof cause.id === "number"
          );
          setCausesOfLoss(validCauses);
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
  }, [session?.accessToken, setCausesOfLoss, setError, setLoading]);

  const filteredCausesOfLoss = getFilteredCauses();

  return (
    <Controller
      name={name}
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
              <div className="flex flex-wrap gap-2">
                {(selected as number[]).map((selectedId: number) => {
                  const cause = causesOfLoss.find(
                    (c: CauseOfLossData) => c.id === selectedId
                  );
                  return cause?.id ? (
                    <Chip
                      key={cause.id}
                      label={cause.cause_loss_name}
                      onDelete={() => {
                        const newValue = (field.value as number[]).filter(
                          (v: number) => v !== cause.id
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
                <CircularProgress size={24} /> Loading causes of loss...
              </MenuItem>
            ) : filteredCausesOfLoss.length > 0 ? (
              filteredCausesOfLoss.map((cause: CauseOfLossData) =>
                cause.id ? (
                  <MenuItem key={cause.id} value={cause.id}>
                    <Checkbox
                      checked={
                        Array.isArray(field.value) &&
                        field.value.includes(cause.id)
                      }
                    />
                    <ListItemText primary={cause.cause_loss_name} />
                  </MenuItem>
                ) : null
              )
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
