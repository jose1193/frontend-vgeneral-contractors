import React from "react";
import { Typography, Box, Grid, Paper } from "@mui/material";
import { Control, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { ClaimsData, TechnicalAssignment } from "../../../app/types/claims";
import { ServiceRequestData } from "../../../app/types/service-request";
interface ClaimsSummaryProps {
  control: Control<ClaimsData>;
  watch: UseFormWatch<ClaimsData>;
  setValue: UseFormSetValue<ClaimsData>;
  upperCase: (str: string) => string;
  initialData?: ClaimsData;
  setShowAddressClaimForm: React.Dispatch<React.SetStateAction<boolean>>;
  showAddressClaimForm: boolean;
}

const ClaimsSummary: React.FC<ClaimsSummaryProps> = ({ watch }) => {
  const data = watch();
  const allianceCompany = watch("alliance_companies");
  const publicAdjuster = watch("public_adjuster_assignment");
  const customers = watch("customers");
  const property = watch("property");

  const renderSection = (title: string, content: React.ReactNode) => (
    <Box mb={5}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: "#15803D",
          fontWeight: "500",
        }}
      >
        {title}
      </Typography>
      <Paper elevation={1} sx={{ p: 2 }}>
        {content}
      </Paper>
    </Box>
  );
  const renderTechnicalAssignments = (assignments: TechnicalAssignment[]) => {
    if (assignments && assignments.length > 0) {
      return assignments.map((assignment, index) => (
        <Typography key={assignment.id}>
          {index + 1}. {assignment.technical_user_name}
        </Typography>
      ));
    }
    return "N/A";
  };

  const renderRequestedServices = (
    services: ServiceRequestData[] | undefined
  ): string => {
    if (Array.isArray(services) && services.length > 0) {
      return services.map((service) => service.requested_service).join(", ");
    }
    return "No requested services available";
  };
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          my: 5,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: "#15803d",
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          Review Your Claim
        </Typography>
      </Box>
      {renderSection(
        "Customer & Property Information",
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>
              <strong>Customer:</strong> {data.customers?.[0]?.name || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <strong>Property:</strong>{" "}
              {data.property?.property_address || "N/A"}
            </Typography>
          </Grid>
        </Grid>
      )}
      {renderSection(
        "Claim Information",
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>
              <strong>Claim Number:</strong> {data.claim_number || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <strong>Type of Damage:</strong> {data.type_damage || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <strong>Date of Loss:</strong> {data.date_of_loss || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <strong>Damage Description:</strong>{" "}
              {data.damage_description || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <strong>Cause of Loss:</strong>{" "}
              {data.cause_of_loss_id
                ?.map((cause) => cause.cause_loss_name)
                .join(", ") || "N/A"}
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
      )}
      {renderSection(
        "Insurance & Work Information",
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>
              <strong>Insurance Company:</strong>{" "}
              {data.insurance_company_assignment || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <strong>Policy Number:</strong> {data.policy_number || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <strong>Public Company:</strong>{" "}
              {data.public_company_assignment || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <strong>Public Adjuster:</strong>{" "}
              {`${data.public_adjuster_assignment?.name || ""} ${
                data.public_adjuster_assignment?.last_name || ""
              }`.trim() || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <strong>Service Requests:</strong>{" "}
              {renderRequestedServices(data.requested_services)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <strong>Work Date:</strong> {data.work_date || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <strong>Number of Floors:</strong>{" "}
              {data.number_of_floors || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <strong>Technical Assignments:</strong>
            </Typography>
            {renderTechnicalAssignments(data.technical_assignments || [])}
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <strong>Scope of Work:</strong> {data.scope_of_work || "N/A"}
            </Typography>
          </Grid>
        </Grid>
      )}

      {renderSection(
        "Affidavit Details",
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Mortgage Company:</strong>{" "}
              {data.affidavit?.mortgage_company_name || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Mortgage Company Phone:</strong>{" "}
              {data.affidavit?.mortgage_company_phone || "N/A"}
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
              {data.affidavit?.amount_paid || "N/A"}
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
      )}
      {renderSection(
        "Alliance Company",
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography>
              <strong>Alliance Company:</strong>{" "}
              {data.alliance_companies?.alliance_company_name || "N/A"}
            </Typography>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ClaimsSummary;
