import React from "react";
import { Typography, Grid } from "@mui/material";
import {
  ClaimsData,
  TechnicalAssignment,
} from "../../../../../app/types/claims";

interface InsuranceWorkSectionProps {
  data: ClaimsData;
  getters: {
    getInsuranceCompanyName: () => string;
    getPublicCompanyName: () => string;
    getPublicAdjusterName: () => string;
    getServiceNames: () => string;
  };
}

export const InsuranceWorkSection: React.FC<InsuranceWorkSectionProps> = ({
  data,
  getters,
}) => {
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
      <Grid item xs={12} sm={6}>
        <Typography>
          <Label>Insurance Company:</Label>
          <Value>{getters.getInsuranceCompanyName()}</Value>
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography>
          <Label>Policy Number:</Label>
          <Value>{data.policy_number || "N/A"}</Value>
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography>
          <Label>Public Company:</Label>
          <Value>{getters.getPublicCompanyName()}</Value>
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography>
          <Label>Public Adjuster:</Label>
          <Value>{getters.getPublicAdjusterName()}</Value>
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography>
          <Label>Requested Services:</Label>
          <Value>{getters.getServiceNames()}</Value>
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Typography>
          <Label>Number of Floors:</Label>
          <Value>{data.number_of_floors || "N/A"}</Value>
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography>
          <Label>Scope of Work:</Label>
          <Value>{data.scope_of_work || "N/A"}</Value>
        </Typography>
      </Grid>
    </Grid>
  );
};
