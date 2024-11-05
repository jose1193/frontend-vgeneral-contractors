import React from "react";
import { Box, Typography, Grid, Paper, Chip, Divider } from "@mui/material";
import { ClaimsData } from "../../../app/types/claims";
import { CustomerData } from "../../../app/types/customer";
import { PropertyData } from "../../../app/types/property";
import usePhoneFormatter from "../../hooks/usePhoneFormatter ";

interface ClaimDetailsProps {
  claim: ClaimsData | null;
}

const ClaimDetails: React.FC<ClaimDetailsProps> = ({ claim }) => {
  const formatPhoneNumber = usePhoneFormatter();

  if (!claim) {
    return (
      <Paper elevation={3} sx={{ p: 5, mb: 7 }}>
        <Typography variant="h6" sx={{ color: "#662401" }}>
          Loading...
        </Typography>
      </Paper>
    );
  }

  // Helper functions
  const causeOfLossString =
    Array.isArray(claim.cause_of_loss_id) && claim.cause_of_loss_id.length > 0
      ? claim.cause_of_loss_id.map((cause) => cause.cause_loss_name).join(", ")
      : "No cause of loss available";

  const renderPropertyAddress = (property: PropertyData | string) => {
    if (typeof property === "string") {
      return property;
    } else if (typeof property === "object") {
      return `${property.property_address}, ${property.property_state}, ${property.property_city} ${property.property_postal_code} ${property.property_country}`;
    }
    return "Address not available";
  };

  const formatAmount = (amount: number | string | null | undefined): string => {
    if (amount === null || amount === undefined) return "N/A";

    let numAmount: number;

    if (typeof amount === "string") {
      numAmount = parseFloat(amount);
      if (isNaN(numAmount)) return "N/A";
    } else if (typeof amount === "number") {
      numAmount = amount;
    } else {
      return "N/A";
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount);
  };

  const getMortgageCompanyInfo = () => {
    // First try to get from affidavit.mortgage_company
    if (claim.affidavit?.mortgage_company) {
      return {
        name: claim.affidavit.mortgage_company.mortgage_company_name,
        phone: claim.affidavit.mortgage_company.phone,
        email: claim.affidavit.mortgage_company.email,
        address: claim.affidavit.mortgage_company.address,
        website: claim.affidavit.mortgage_company.website,
      };
    }
    // Fallback to mortgage_companies
    if (claim.mortgage_companies) {
      return {
        name: claim.mortgage_companies.mortgage_company_name,
        phone: claim.mortgage_companies.phone,
        email: claim.mortgage_companies.email,
        address: claim.mortgage_companies.address,
        website: claim.mortgage_companies.website,
      };
    }
    // Final fallback to affidavit direct properties
    return {
      name: claim.affidavit?.mortgage_company_name,
      phone: claim.affidavit?.mortgage_company_phone,
      email: null,
      address: null,
      website: null,
    };
  };

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

  const renderCustomerInfo = (customer: CustomerData, index: number) => (
    <Box key={index} mb={2}>
      <Typography
        variant="subtitle1"
        sx={{ color: "#662401", fontWeight: "bold" }}
      >
        Signatory {index + 1}
      </Typography>
      <Typography variant="body2" sx={{ color: "black" }}>
        Name:{" "}
        <span
          style={{ fontWeight: "bold" }}
        >{`${customer.name} ${customer.last_name}`}</span>
      </Typography>
      <Typography variant="body2" sx={{ color: "black" }}>
        Phone:{" "}
        <span style={{ fontWeight: "bold" }}>
          {formatPhoneNumber(customer.home_phone)}
        </span>
      </Typography>
      <Typography variant="body2" sx={{ color: "black" }}>
        Mobile:{" "}
        <span style={{ fontWeight: "bold" }}>
          {formatPhoneNumber(customer.cell_phone)}
        </span>
      </Typography>
      <Typography variant="body2" sx={{ color: "black" }}>
        Email: <span style={{ fontWeight: "bold" }}>{customer.email}</span>
      </Typography>
      {index < (claim.customers?.length || 0) - 1 && <Divider sx={{ my: 1 }} />}
    </Box>
  );

  const mortgageInfo = getMortgageCompanyInfo();

  return (
    <Paper elevation={3} sx={{ p: 5, mb: 7 }}>
      {/* Header section */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <Typography
              variant="h6"
              sx={{ color: "#662401", fontWeight: "bold", mb: 2, flexGrow: 1 }}
            >
              🏷️ Claim Internal ID -
              <span
                style={{ color: "black", fontWeight: "bold", marginLeft: 4 }}
              >
                {claim.claim_internal_id}
              </span>
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "#662401", fontWeight: "bold", mr: 2 }}
            >
              Status:
            </Typography>
            {claim.claim_status && (
              <Chip
                label={claim.claim_status.claim_status_name}
                sx={{
                  backgroundColor:
                    claim.claim_status.background_color || "#e0e0e0",
                  color: "#ffffff",
                  fontWeight: "bold",
                }}
              />
            )}
          </Box>
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
        {/* Column 1: Property and Customers */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom sx={{ color: "#662401" }}>
            Property and Signatories
          </Typography>
          {Array.isArray(claim.customers) && claim.customers.length > 0 ? (
            claim.customers.map((customer, index) =>
              renderCustomerInfo(customer, index)
            )
          ) : (
            <Typography variant="body2" sx={{ color: "black" }}>
              No signatory information available.
            </Typography>
          )}
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
            Cause of Loss:
            <span style={{ fontWeight: "bold" }}> {causeOfLossString}</span>
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
            Type of Damage:
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
            Referred By:{" "}
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
                    .map((assignment) => assignment.technical_user_name)
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
            Policy Number:{" "}
            <span style={{ fontWeight: "bold" }}>{claim.policy_number}</span>
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
              {claim.public_adjuster_assignment
                ? `${claim.public_adjuster_assignment.name} ${claim.public_adjuster_assignment.last_name}`
                : "N/A"}
            </span>
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 3, color: "#662401" }}
          >
            Affidavit
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Mortgage Company Name:{" "}
            <span style={{ fontWeight: "bold" }}>
              {mortgageInfo.name || "N/A"}
            </span>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "black" }}>
            Mortgage Company Phone:{" "}
            <span style={{ fontWeight: "bold" }}>
              {mortgageInfo.phone
                ? formatPhoneNumber(mortgageInfo.phone)
                : "N/A"}
            </span>
          </Typography>
          {mortgageInfo.email && (
            <Typography variant="subtitle2" sx={{ color: "black" }}>
              Mortgage Company Email:{" "}
              <span style={{ fontWeight: "bold" }}>{mortgageInfo.email}</span>
            </Typography>
          )}
          {mortgageInfo.address && (
            <Typography variant="subtitle2" sx={{ color: "black" }}>
              Mortgage Company Address:{" "}
              <span style={{ fontWeight: "bold" }}>{mortgageInfo.address}</span>
            </Typography>
          )}
          {mortgageInfo.website && (
            <Typography variant="subtitle2" sx={{ color: "black" }}>
              Mortgage Company Website:{" "}
              <span style={{ fontWeight: "bold" }}>{mortgageInfo.website}</span>
            </Typography>
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
              {claim.alliance_companies
                ? claim.alliance_companies.alliance_company_name
                : "N/A"}
            </span>
          </Typography>
          {claim.alliance_companies && (
            <>
              <Typography variant="subtitle2" sx={{ color: "black" }}>
                Phone:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {formatPhoneNumber(claim.alliance_companies.phone)}
                </span>
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "black" }}>
                Email:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {claim.alliance_companies.email}
                </span>
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "black" }}>
                Address:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {claim.alliance_companies.address}
                </span>
              </Typography>
              {claim.alliance_companies.website && (
                <Typography variant="subtitle2" sx={{ color: "black" }}>
                  Website:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {claim.alliance_companies.website}
                  </span>
                </Typography>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ClaimDetails;
