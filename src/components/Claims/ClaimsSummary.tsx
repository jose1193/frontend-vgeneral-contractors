// components/ClaimsSummary.tsx
import React, { useMemo } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { CustomerPropertySection } from "../Claims/ClaimsSummary/sections/CustomerPropertySection";
import { ClaimInformationSection } from "../Claims/ClaimsSummary/sections/ClaimInformationSection";
import { InsuranceWorkSection } from "../Claims/ClaimsSummary/sections/InsuranceWorkSection";
import { AffidavitSection } from "../Claims/ClaimsSummary/sections/AffidavitSection";
import { AllianceSection } from "../Claims/ClaimsSummary/sections/AllianceSection";
import { useEntityGetters } from "../Claims/ClaimsSummary/hooks/useEntityGetters";
import { ClaimsSummaryProps } from "../../../app/types/claimsTypes";
import { useInsuranceCompanyStore } from "../../../app/zustand/useInsuranceCompanyStore";
import { useMortgageCompanyStore } from "../../../app/zustand/useMortgageCompanyStore";
import { usePublicCompanyStore } from "../../../app/zustand/usePublicCompanyStore";
import { useAllianceCompanyStore } from "../../../app/zustand/useAllianceCompanyStore";
import { useTypeDamageStore } from "../../../app/zustand/useTypeDamageStore";
import { useUserStore } from "../../../app/zustand/useUserStore";
import { useCauseOfLossStore } from "../../../app/zustand/useCauseOfLossStore";
import { useRequiredServiceStore } from "../../../app/zustand/useRequiredServiceStore";

const ClaimsSummary: React.FC<ClaimsSummaryProps> = ({ watch }) => {
  const data = watch();

  // Consolidate all stores
  const stores = {
    insuranceCompanies: useInsuranceCompanyStore().insuranceCompanies,
    mortgageCompanies: useMortgageCompanyStore().mortgageCompanies,
    publicCompanies: usePublicCompanyStore().publicCompanies,
    allianceCompanies: useAllianceCompanyStore().allianceCompanies,
    typeDamages: useTypeDamageStore().typeDamages,
    users: useUserStore().users,
    causesOfLoss: useCauseOfLossStore().causesOfLoss,
    services: useRequiredServiceStore().services,
  };

  const getters = useEntityGetters(data, stores);

  // Memoize the renderSection function
  const renderSection = useMemo(
    () => (title: string, content: React.ReactNode) =>
      (
        <Box mb={5}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: "#15803D", fontWeight: "500" }}
          >
            {title}
          </Typography>
          <Paper elevation={1} sx={{ p: 2 }}>
            {content}
          </Paper>
        </Box>
      ),
    []
  );

  return (
    <Box>
      {/* Header */}
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
          sx={{ color: "#15803d", fontWeight: "500", textAlign: "center" }}
        >
          Review Your Claim
        </Typography>
      </Box>

      {/* Customer & Property Information */}
      {renderSection(
        "Customer & Property Information",
        <CustomerPropertySection data={data} getters={getters} />
      )}

      {/* Claim Information */}
      {renderSection(
        "Claim Information",
        <ClaimInformationSection data={data} getters={getters} />
      )}

      {/* Insurance & Work Information */}
      {renderSection(
        "Insurance & Work Information",
        <InsuranceWorkSection data={data} getters={getters} />
      )}

      {/* Affidavit Details */}
      {renderSection(
        "Affidavit Details",
        <AffidavitSection data={data} getters={getters} />
      )}

      {/* Alliance Company */}
      {renderSection(
        "Alliance Company",
        <AllianceSection data={data} getters={getters} />
      )}
    </Box>
  );
};

export default ClaimsSummary;
