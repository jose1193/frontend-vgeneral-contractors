import React from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { Controller, Control } from "react-hook-form";
import { ClaimsData } from "../../../app/types/claims";
import SelectInsuranceCompany from "../SelectInsuranceCompany";
import SelectPublicCompany from "../SelectPublicCompany";
import SelectPublicAdjuster from "../SelectPublicAdjuster";
import SelectServiceRequest from "../SelectServiceRequest";
import SelectWorkDate from "../SelectWorkDate";
import SelectTechnicalServices from "../SelectTechnicalServices";

interface InsuranceAndWorkDetailsProps {
  control: Control<ClaimsData>;
  initialData?: ClaimsData;
  upperCase: (str: string) => string;
}

const InsuranceAndWorkDetailsWizard: React.FC<InsuranceAndWorkDetailsProps> = ({
  control,
  initialData,
  upperCase,
}) => {
  return (
    <Grid container spacing={3} sx={{ my: 3 }}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Insurance Details
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name="policy_number"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Policy Number"
              onChange={(e) => field.onChange(upperCase(e.target.value))}
              fullWidth
              autoComplete="off"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectInsuranceCompany control={control} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectPublicCompany control={control} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectPublicAdjuster
          control={control}
          publicAdjusterAssignment={initialData?.public_adjuster_assignment}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Work Details
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectServiceRequest control={control} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectWorkDate control={control} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name="number_of_floors"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="number-of-floors-label">
                Number of Floors
              </InputLabel>
              <Select
                {...field}
                labelId="number-of-floors-label"
                label="Number of Floors"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectTechnicalServices control={control} />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="scope_of_work"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Scope of Work"
              fullWidth
              multiline
              rows={3}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default InsuranceAndWorkDetailsWizard;
