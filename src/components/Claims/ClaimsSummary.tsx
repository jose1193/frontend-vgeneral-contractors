import React, { useMemo, Suspense } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { UseFormReturn, Control } from "react-hook-form";
import { CustomerPropertySection } from "../Claims/ClaimsSummary/sections/CustomerPropertySection";
import { ClaimInformationSection } from "../Claims/ClaimsSummary/sections/ClaimInformationSection";
import { InsuranceWorkSection } from "../Claims/ClaimsSummary/sections/InsuranceWorkSection";
import { AffidavitSection } from "../Claims/ClaimsSummary/sections/AffidavitSection";
import { AllianceSection } from "../Claims/ClaimsSummary/sections/AllianceSection";
import { useEntityGetters } from "../Claims/ClaimsSummary/hooks/useEntityGetters";
import { ClaimsData } from "../../../app/types/claims";
import { useInsuranceCompanyStore } from "../../../app/zustand/useInsuranceCompanyStore";
import { useMortgageCompanyStore } from "../../../app/zustand/useMortgageCompanyStore";
import { usePublicCompanyStore } from "../../../app/zustand/usePublicCompanyStore";
import { useAllianceCompanyStore } from "../../../app/zustand/useAllianceCompanyStore";
import { useTypeDamageStore } from "../../../app/zustand/useTypeDamageStore";
import { useUserStore } from "../../../app/zustand/useUserStore";
import { useCauseOfLossStore } from "../../../app/zustand/useCauseOfLossStore";
import { useRequiredServiceStore } from "../../../app/zustand/useRequiredServiceStore";

interface StepProps {
  control: Control<ClaimsData>;
  watch: UseFormReturn<ClaimsData>["watch"];
  setValue: UseFormReturn<ClaimsData>["setValue"];
  upperCase: (str: string) => string;
  initialData?: ClaimsData;
  setShowAddressClaimForm: React.Dispatch<React.SetStateAction<boolean>>;
  showAddressClaimForm: boolean;
  setStep: (step: number, isEditing?: boolean) => void;
}

interface SectionProps {
  title: string;
  content: React.ReactNode;
  onEdit: () => void;
  stepNumber: number;
}

const Section: React.FC<SectionProps> = ({
  title,
  content,
  onEdit,
  stepNumber,
}) => (
  <Suspense>
    <Box mb={10} width="100%">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          width: "100%",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#15803D !important",
            fontWeight: "500",
            fontSize: "1.25rem",
          }}
        >
          {title}
        </Typography>
        <Button
          variant="contained"
          color="warning"
          size="small"
          startIcon={<EditIcon />}
          onClick={onEdit}
          sx={{
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#f59e0b",
            },
          }}
        >
          Edit Section {stepNumber + 1}
        </Button>
      </Box>
      <Paper
        elevation={2}
        sx={{
          p: 3,

          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff",
          color: (theme) =>
            theme.palette.mode === "dark" ? "#ffffff" : "#000000",
          borderRadius: "8px",
          width: "100%",
          minHeight: "150px",
          "&:hover": {
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -2px rgba(255, 255, 255, 0.1)"
                : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
          },
          "& .MuiTypography-root": {
            color: "inherit",
          },
        }}
      >
        {content}
      </Paper>
    </Box>
  </Suspense>
);

const ClaimsSummary: React.FC<StepProps> = ({
  watch,
  setStep,
  control,
  setValue,
  upperCase,
  initialData,
  setShowAddressClaimForm,
  showAddressClaimForm,
}) => {
  const data = watch();

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
        step: 0,
      },
      {
        title: "Claim Information",
        content: <ClaimInformationSection data={data} getters={getters} />,
        step: 1,
      },
      {
        title: "Insurance & Work Information",
        content: <InsuranceWorkSection data={data} getters={getters} />,
        step: 2,
      },
      {
        title: "Affidavit Details",
        content: <AffidavitSection data={data} getters={getters} />,
        step: 3,
      },
      {
        title: "Alliance Company",
        content: <AllianceSection data={data} getters={getters} />,
        step: 2,
      },
    ],
    [data, getters]
  );

  const handleEdit = (step: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStep(step, true);
  };

  return (
    <Box
      sx={{
        width: "100%",

        mx: "auto",

        "& .MuiTypography-root": {
          color: (theme) =>
            theme.palette.mode === "dark" ? "#ffffff" : "inherit",
        },
      }}
    >
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
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
          }}
        >
          Review Your Claim
        </Typography>
      </Box>

      {sections.map((section, index) => (
        <Section
          key={section.title}
          title={section.title}
          content={section.content}
          onEdit={() => handleEdit(section.step)}
          stepNumber={section.step}
        />
      ))}
    </Box>
  );
};

ClaimsSummary.displayName = "ClaimsSummary";

export default ClaimsSummary;
