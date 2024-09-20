import React from "react";
import { Box, Typography, Grid, Paper, Button, Skeleton } from "@mui/material";
import { ClaimsData } from "../../../app/types/claims";
import { PropertyData } from "../../../app/types/property";

interface ClaimDetailsProps {
  claim: ClaimsData | null;
}

const ClaimDetails: React.FC<ClaimDetailsProps> = ({ claim }) => {
  if (!claim) {
    return (
      <Paper elevation={3} sx={{ p: 5, mb: 7 }}>
        <Typography variant="h6" sx={{ color: "#662401" }}>
          Loading...
        </Typography>
      </Paper>
    );
  }
  // Helper function to render property address
  const renderPropertyAddress = (property: PropertyData | string) => {
    if (typeof property === "string") {
      return property;
    } else if (typeof property === "object") {
      return `${property.property_address}, ${property.property_state}, ${property.property_city} ${property.property_postal_code} ${property.property_country}`;
    }
    return "Address not available";
  };

  // Helper function to format amount
  const formatAmount = (amount: number | string | null | undefined): string => {
    if (amount === null || amount === undefined) return "N/A";
    if (typeof amount === "number") {
      return `$${amount.toFixed(2)}`;
    }
    if (typeof amount === "string") {
      const numAmount = parseFloat(amount);
      return isNaN(numAmount) ? amount : `$${numAmount.toFixed(2)}`;
    }
    return String(amount);
  };

  // Helper function to render affidavit information
  const renderAffidavitInfo = (
    label: string,
    value: string | number | boolean | null | undefined
  ) => {
    if (value === null || value === undefined) return null;
    return (
      <Typography variant="subtitle2" sx={{ color: "black" }}>
        {label}:{" "}
        <span style={{ fontWeight: "bold" }}>
          {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
        </span>
      </Typography>
    );
  };

  const requestedServicesString =
    Array.isArray(claim.requested_services) &&
    claim.requested_services.length > 0
      ? claim.requested_services
          .map((service) => service.requested_service)
          .join(", ")
      : "No requested services available";
  return (
    <Paper elevation={3} sx={{ p: 5, mb: 7 }}>
      {/* Header section */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Typography
            variant="h6"
            sx={{ color: "#662401", fontWeight: "bold", mb: 2 }}
          >
            🏷️ Claim Internal ID -
            <span style={{ color: "black", fontWeight: "bold", marginLeft: 4 }}>
              {claim.claim_internal_id}
            </span>
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            Date:{" "}
            <span style={{ color: "black", fontWeight: "bold" }}>
              {claim.created_at}
            </span>
          </Typography>
        </Grid>
      </Grid>

      {/* Main content section */}
      <Grid container spacing={3}>
        {/* Column 1: Property and Customer */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom sx={{ color: "#662401" }}>
            Property and Customer
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Name:{" "}
            <span style={{ fontWeight: "bold" }}>
              {Array.isArray(claim?.customers)
                ? claim.customers
                    .map((customer) => `${customer.name} ${customer.last_name}`)
                    .join(", ")
                : claim?.customers || ""}
            </span>
          </Typography>

          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Phone:{" "}
            <span style={{ fontWeight: "bold" }}>
              {Array.isArray(claim?.customers)
                ? claim.customers
                    .map((customer) => `${customer.home_phone} `)
                    .join(", ")
                : claim?.customers || ""}
            </span>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Mobile:{" "}
            <span style={{ fontWeight: "bold" }}>
              {Array.isArray(claim?.customers)
                ? claim.customers
                    .map((customer) => `${customer.cell_phone} `)
                    .join(", ")
                : claim?.customers || ""}
            </span>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            <Typography variant="subtitle2" sx={{ color: "black" }}>
              Email:
              <span style={{ fontWeight: "bold", marginLeft: 5 }}>
                {Array.isArray(claim?.customers)
                  ? claim.customers
                      .map((customer) => `${customer.email} `)
                      .join(", ")
                  : claim?.customers || ""}
              </span>
            </Typography>
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 2, color: "black" }}>
            Property Address:{" "}
            <span style={{ fontWeight: "bold" }}>
              {renderPropertyAddress(claim.property)}
            </span>
          </Typography>
        </Grid>

        {/* Column 2: Claim Details and Work Details */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom sx={{ color: "#662401" }}>
            Claim Details
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Claim Number:{" "}
            <span style={{ fontWeight: "bold" }}>{claim.claim_number}</span>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Date of Loss:{" "}
            <span style={{ fontWeight: "bold" }}>{claim.date_of_loss}</span>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Description of Loss:
            <span style={{ fontWeight: "bold" }}>
              {" "}
              {claim.description_of_loss}
            </span>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Policy Number:{" "}
            <span style={{ fontWeight: "bold" }}>{claim.policy_number}</span>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Type Damage:
            <span style={{ fontWeight: "bold" }}> {claim.type_damage}</span>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Damage Description:
            <span style={{ fontWeight: "bold" }}>
              {" "}
              {claim.damage_description}
            </span>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Number of Floors:{" "}
            <span style={{ fontWeight: "bold" }}>{claim.number_of_floors}</span>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Ref By:{" "}
            <span style={{ fontWeight: "bold" }}>
              {" "}
              <span style={{ fontWeight: "bold" }}> {claim.user_ref_by}</span>
            </span>
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 3, color: "#662401" }}
          >
            Work Details
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Work Date:
            <span style={{ fontWeight: "bold", marginLeft: 5 }}>
              {claim.work_date || "N/A"}
            </span>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Technicians Assignment:
            <span style={{ fontWeight: "bold", marginLeft: 5 }}>
              {Array.isArray(claim?.technical_assignments)
                ? claim.technical_assignments
                    .map(
                      (assignment) => assignment.technical_user_name // Ensure this is a string
                    )
                    .join(", ")
                : "No technicians assigned"}
            </span>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Scope of Work:
            <span style={{ fontWeight: "bold", marginLeft: 5 }}>
              {claim.scope_of_work || "N/A"}
            </span>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Requested Services:
            <span style={{ fontWeight: "bold", marginLeft: 5 }}>
              {requestedServicesString}
            </span>
          </Typography>
        </Grid>

        {/* Column 3: Insurance and Company Details */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom sx={{ color: "#662401" }}>
            Insurance and Company Details
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Insurance Company:
            <span style={{ fontWeight: "bold", marginLeft: 5 }}>
              {claim.insurance_company_assignment || "N/A"}
            </span>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Insurance Adjuster: <span style={{ fontWeight: "bold" }}></span>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Public Company:{" "}
            <span style={{ fontWeight: "bold" }}>
              {claim.public_company_assignment || "N/A"}
            </span>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Public Adjuster:{" "}
            <span style={{ fontWeight: "bold" }}>
              <span style={{ fontWeight: "bold" }}>
                {claim.public_adjuster_assignment || "N/A"}
              </span>
            </span>
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 3, color: "#662401" }}
          >
            Affidavit
          </Typography>
          {renderAffidavitInfo(
            "Mortgage Company Name",
            claim.affidavit?.mortgage_company_name
          )}
          {renderAffidavitInfo(
            "Mortgage Company Phone",
            claim.affidavit?.mortgage_company_phone
          )}
          {renderAffidavitInfo(
            "Mortgage Loan Number",
            claim.affidavit?.mortgage_loan_number
          )}
          {renderAffidavitInfo(
            "Amount Paid",
            formatAmount(claim.affidavit?.amount_paid)
          )}
          {renderAffidavitInfo("Description", claim.affidavit?.description)}
          {renderAffidavitInfo(
            "Prior Loss",
            claim.affidavit?.never_had_prior_loss === true ||
              claim.affidavit?.has_never_had_prior_loss === true
              ? "None"
              : "Yes"
          )}

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 3, color: "#662401" }}
          >
            Alliance Company
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Alliance Company:{" "}
            <span style={{ fontWeight: "bold" }}>
              {Array.isArray(claim.alliance_companies) &&
              claim.alliance_companies.length > 0 ? (
                <ul>
                  {claim.alliance_companies.map((company) => (
                    <li key={company.id}>{company.alliance_company_name}</li>
                  ))}
                </ul>
              ) : (
                "No alliance companies available"
              )}
            </span>
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ClaimDetails;
