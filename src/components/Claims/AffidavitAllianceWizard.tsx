import React, { useState } from "react";
import {
  Grid,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Controller,
  Control,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import { ClaimsData } from "../../../app/types/claims";

import SelectAllianceCompany from "../SelectAllianceCompany";
import CurrencyInput from "../../../app/components/CurrencyInput";
import PriorLossSelection from "../PriorLossSelection";
import MortgageCompanyModal from "../../../src/components/Mortgage-Company/MortgageCompanyModal";

import dynamic from "next/dynamic";
const SelectMortgageCompany = dynamic(
  () => import("../SelectMortgageCompany"),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  }
);

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
  const [openMortgageModal, setOpenMortgageModal] = useState(false);

  const handleCloseMortgageModal = () => {
    setOpenMortgageModal(false);
  };

  return (
    <>
      <Grid container spacing={3} sx={{ my: 5 }}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Affidavit Details
          </Typography>
        </Grid>
        <Grid item xs={11} sm={5}>
          <SelectMortgageCompany
            control={control}
            name="affidavit.mortgage_company_id"
          />
        </Grid>
        <Grid
          item
          xs={1}
          sm={1}
          sx={{ display: "flex", alignItems: "center", ml: -2 }}
        >
          <IconButton
            color="primary"
            onClick={() => setOpenMortgageModal(true)}
            size="small"
          >
            <AddIcon />
          </IconButton>
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
          <CurrencyInput
            control={control}
            name="affidavit.amount_paid"
            label="Amount Paid"
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
      </Grid>

      <MortgageCompanyModal
        open={openMortgageModal}
        onClose={handleCloseMortgageModal}
      />
    </>
  );
};

export default AffidavitAllianceWizard;
