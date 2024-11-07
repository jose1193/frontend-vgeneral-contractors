import React from "react";
import { Typography, Grid } from "@mui/material";
import { ClaimsData } from "../../../../../app/types/claims";

interface AllianceSectionProps {
  data: ClaimsData;
  getters: {
    getAllianceCompanyName: () => string;
  };
}

export const AllianceSection: React.FC<AllianceSectionProps> = ({
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
      <Grid item xs={12}>
        <Typography>
          <Label>Alliance Company:</Label>
          <Value>{getters.getAllianceCompanyName()}</Value>
        </Typography>
      </Grid>
    </Grid>
  );
};
