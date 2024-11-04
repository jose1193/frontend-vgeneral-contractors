// components/sections/AllianceSection.tsx
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
}) => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <Typography>
        <strong>Alliance Company:</strong> {getters.getAllianceCompanyName()}
      </Typography>
    </Grid>
  </Grid>
);
