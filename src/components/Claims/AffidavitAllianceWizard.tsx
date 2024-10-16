import React from "react";
import {
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Controller,
  Control,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { ClaimsData } from "../../../app/types/claims";
import PhoneInputField from "../../../app/components/PhoneInputField";
import SelectAllianceCompany from "../SelectAllianceCompany";
import PriorLossSelection from "../PriorLossSelection";

interface AffidavitAllianceWizardProps {
  control: Control<ClaimsData>;
  setValue: UseFormSetValue<ClaimsData>;
  watch: UseFormWatch<ClaimsData>;
  upperCase: (str: string) => string;
}

const AffidavitAllianceWizard: React.FC<AffidavitAllianceWizardProps> = ({
  control,
  setValue,
  watch,
  upperCase,
}) => {
  return (
    <Grid container spacing={3} sx={{ my: 5 }}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Affidavit Details
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name="affidavit.mortgage_company_name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Mortgage Company Name"
              fullWidth
              onChange={(e) => field.onChange(upperCase(e.target.value))}
              autoComplete="off"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <PhoneInputField
          name="affidavit.mortgage_company_phone"
          label="Mortgage Company Phone"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name="affidavit.mortgage_loan_number"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Mortgage Loan Number"
              fullWidth
              onChange={(e) => field.onChange(upperCase(e.target.value))}
              autoComplete="off"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name="affidavit.amount_paid"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Amount Paid" type="number" fullWidth />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="affidavit.description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Affidavit Description"
              fullWidth
              multiline
              rows={3}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <PriorLossSelection control={control} setValue={setValue} />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Alliance Company
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectAllianceCompany control={control} />
      </Grid>
    </Grid>
  );
};

export default AffidavitAllianceWizard;
