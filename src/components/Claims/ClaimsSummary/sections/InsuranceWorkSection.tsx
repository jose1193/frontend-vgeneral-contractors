// components/sections/InsuranceWorkSection.tsx
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
}) => (
  <Grid container spacing={2}>
    <Grid item xs={6}>
      <Typography>
        <strong>Insurance Company:</strong> {getters.getInsuranceCompanyName()}
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>
        <strong>Policy Number:</strong> {data.policy_number || "N/A"}
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>
        <strong>Public Company:</strong> {getters.getPublicCompanyName()}
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>
        <strong>Public Adjuster:</strong> {getters.getPublicAdjusterName()}
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>
        <strong>Requested Services:</strong> {getters.getServiceNames()}
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>
        <strong>Work Date:</strong> {data.work_date || "N/A"}
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>
        <strong>Number of Floors:</strong> {data.number_of_floors || "N/A"}
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography>
        <strong>Technical Assignments:</strong>
      </Typography>
      {data.technical_assignments && data.technical_assignments.length > 0
        ? data.technical_assignments.map(
            (assignment: TechnicalAssignment, index: number) => (
              <Typography key={assignment.id}>
                {index + 1}. {assignment.technical_user_name}
              </Typography>
            )
          )
        : "N/A"}
    </Grid>
    <Grid item xs={12}>
      <Typography>
        <strong>Scope of Work:</strong> {data.scope_of_work || "N/A"}
      </Typography>
    </Grid>
  </Grid>
);
