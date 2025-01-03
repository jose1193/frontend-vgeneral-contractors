import React from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Controller, Control } from "react-hook-form";

import { ClaimsData } from "../../../app/types/claims";
import dynamic from "next/dynamic";

const SelectTypeDamage = dynamic(() => import("../SelectTypeDamage"), {
  loading: () => <CircularProgress />,
  ssr: false,
});

const SelectDateOfLoss = dynamic(() => import("../SelectDateOfLoss"), {
  loading: () => <CircularProgress />,
  ssr: false,
});

const SelectCauseOfLoss = dynamic(() => import("../SelectCauseOfLoss"), {
  loading: () => <CircularProgress />,
  ssr: false,
});

const SelectClaimStatus = dynamic(() => import("../SelectClaimStatus"), {
  loading: () => <CircularProgress />,
  ssr: false,
});

interface ClaimDetailsProps {
  control: Control<ClaimsData>;
  upperCase: (str: string) => string;
  initialData?: ClaimsData;
}

const ClaimDetailsWizard: React.FC<ClaimDetailsProps> = ({
  control,
  upperCase,
  initialData,
}) => {
  return (
    <Grid container spacing={2} sx={{ my: 5 }}>
      <Grid item xs={12} sm={6}>
        <Controller
          name="claim_number"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Claim Number"
              onChange={(e) => field.onChange(upperCase(e.target.value))}
              fullWidth
              autoComplete="off"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectTypeDamage control={control} />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="damage_description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Damage Description"
              fullWidth
              multiline
              rows={3}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectCauseOfLoss control={control} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectDateOfLoss control={control} />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="description_of_loss"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description of Loss"
              fullWidth
              multiline
              rows={3}
            />
          )}
        />
      </Grid>
      {initialData && (
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            Claim Status
          </Typography>
          <SelectClaimStatus
            control={control}
            initialValue={initialData.claim_status}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default ClaimDetailsWizard;
