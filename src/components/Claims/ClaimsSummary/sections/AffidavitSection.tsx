// components/sections/AffidavitSection.tsx
import React from "react";
import { Typography, Grid } from "@mui/material";
import { ClaimsData } from "../../../../../app/types/claims";

interface AffidavitSectionProps {
  data: ClaimsData;
  getters: {
    getMortgageCompanyName: () => string;
  };
}

export const AffidavitSection: React.FC<AffidavitSectionProps> = ({
  data,
  getters,
}) => {
  const formatCurrency = (amount: string | number | null | undefined) => {
    if (!amount) return "N/A";
    const number = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(number);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Typography>
          <strong>Mortgage Company:</strong> {getters.getMortgageCompanyName()}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography>
          <strong>Mortgage Loan Number:</strong>{" "}
          {data.affidavit?.mortgage_loan_number || "N/A"}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography>
          <strong>Amount Paid:</strong>{" "}
          {formatCurrency(data.affidavit?.amount_paid)}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          <strong>Affidavit Description:</strong>{" "}
          {data.affidavit?.description || "N/A"}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography>
          <strong>Never Had Prior Loss:</strong>{" "}
          {data.affidavit?.never_had_prior_loss ? "Yes" : "No"}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography>
          <strong>Has Never Had Prior Loss:</strong>{" "}
          {data.affidavit?.has_never_had_prior_loss ? "Yes" : "No"}
        </Typography>
      </Grid>
    </Grid>
  );
};
