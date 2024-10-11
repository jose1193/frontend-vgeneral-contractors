import React from "react";
import { Grid, FormControlLabel, Checkbox } from "@mui/material";
import { Controller, Control, UseFormSetValue } from "react-hook-form";
import { ClaimsData } from "../../app/types/claims";

interface PriorLossSelectionProps {
  control: Control<ClaimsData, any>;
  setValue: UseFormSetValue<ClaimsData>;
}

const PriorLossSelection: React.FC<PriorLossSelectionProps> = ({
  control,
  setValue,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Controller
          name="affidavit.never_had_prior_loss"
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={Boolean(value)}
                  onChange={(e) => {
                    onChange(e.target.checked);
                    if (e.target.checked) {
                      setValue("affidavit.has_never_had_prior_loss", false);
                    }
                  }}
                />
              }
              label="I have never had prior loss"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name="affidavit.has_never_had_prior_loss"
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={Boolean(value)}
                  onChange={(e) => {
                    onChange(e.target.checked);
                    if (e.target.checked) {
                      setValue("affidavit.never_had_prior_loss", false);
                    }
                  }}
                />
              }
              label="I have had a prior loss"
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default PriorLossSelection;
