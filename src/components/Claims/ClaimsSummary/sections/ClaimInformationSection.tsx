// components/sections/ClaimInformationSection.tsx
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
> = ({ data, getters }) => (
  <Grid container spacing={2}>
    <Grid item xs={6}>
      <Typography>
        <strong>Claim Number:</strong> {data.claim_number || "N/A"}
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>
        <strong>Type of Damage:</strong> {getters.getTypeDamage()}
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>
        <strong>Date of Loss:</strong> {data.date_of_loss || "N/A"}
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography>
        <strong>Damage Description:</strong> {data.damage_description || "N/A"}
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography>
        <strong>Cause of Loss:</strong> {getters.getCauseOfLossNames()}
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography>
        <strong>Description of Loss:</strong>{" "}
        {data.description_of_loss || "N/A"}
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>
        <strong>Claim Status:</strong> New
      </Typography>
    </Grid>
  </Grid>
);
