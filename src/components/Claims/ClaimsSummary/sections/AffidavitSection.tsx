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

  const Label = ({ children }: { children: React.ReactNode }) => (
    <Typography
      component="span"
      sx={{
        color: "text.secondary",
        fontSize: "0.900rem",
        fontWeight: "500",
      }}
    >
      {children}
    </Typography>
  );

  const Value = ({ children }: { children: React.ReactNode }) => (
    <Typography
      component="span"
      sx={{
        fontWeight: 600,
        ml: 1,
      }}
    >
      {children}
    </Typography>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Typography>
          <Label>Mortgage Company:</Label>
          <Value>{getters.getMortgageCompanyName()}</Value>
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography>
          <Label>Mortgage Loan Number:</Label>
          <Value>{data.affidavit?.mortgage_loan_number || "N/A"}</Value>
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography>
          <Label>Amount Paid:</Label>
          <Value>{formatCurrency(data.affidavit?.amount_paid)}</Value>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          <Label>Affidavit Description:</Label>
          <Value>{data.affidavit?.description || "N/A"}</Value>
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography>
          <Label>Never Had Prior Loss:</Label>
          <Value>{data.affidavit?.never_had_prior_loss ? "Yes" : "No"}</Value>
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography>
          <Label>Has Never Had Prior Loss:</Label>
          <Value>
            {data.affidavit?.has_never_had_prior_loss ? "Yes" : "No"}
          </Value>
        </Typography>
      </Grid>
    </Grid>
  );
};
