import React from "react";
import { Typography, Grid } from "@mui/material";
import { ClaimsData } from "../../../../../app/types/claims";

interface ClaimInformationSectionProps {
  data: ClaimsData;
  getters: {
    getTypeDamage: () => string;
    getCauseOfLossNames: () => string;
  };
}

export const ClaimInformationSection: React.FC<
  ClaimInformationSectionProps
> = ({ data, getters }) => {
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
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography>
          <Label>Claim Number:</Label>
          <Value>{data.claim_number || "N/A"}</Value>
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>
          <Label>Type of Damage:</Label>
          <Value>{getters.getTypeDamage()}</Value>
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>
          <Label>Date of Loss:</Label>
          <Value>{data.date_of_loss || "N/A"}</Value>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          <Label>Damage Description:</Label>
          <Value>{data.damage_description || "N/A"}</Value>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          <Label>Cause of Loss:</Label>
          <Value>{getters.getCauseOfLossNames()}</Value>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          <Label>Description of Loss:</Label>
          <Value>{data.description_of_loss || "N/A"}</Value>
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>
          <Label>Claim Status:</Label>
          <Value>New</Value>
        </Typography>
      </Grid>
    </Grid>
  );
};
