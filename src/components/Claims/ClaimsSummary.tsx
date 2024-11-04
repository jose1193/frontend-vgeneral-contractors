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

interface SectionProps {
  title: string;
  content: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, content }) => (
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
);

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

  const sections = useMemo(
    () => [
      {
        title: "Customer & Property Information",
        content: <CustomerPropertySection data={data} getters={getters} />,
      },
      {
        title: "Claim Information",
        content: <ClaimInformationSection data={data} getters={getters} />,
      },
      {
        title: "Insurance & Work Information",
        content: <InsuranceWorkSection data={data} getters={getters} />,
      },
      {
        title: "Affidavit Details",
        content: <AffidavitSection data={data} getters={getters} />,
      },
      {
        title: "Alliance Company",
        content: <AllianceSection data={data} getters={getters} />,
      },
    ],
    [data, getters]
  );

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
          sx={{ color: "#15803d", fontWeight: "500", textAlign: "center" }}
        >
          Review Your Claim
        </Typography>
      </Box>

      {sections.map((section) => (
        <Section
          key={section.title}
          title={section.title}
          content={section.content}
        />
      ))}
    </Box>
  );
};

// Add display name
ClaimsSummary.displayName = "ClaimsSummary";

export default ClaimsSummary;
