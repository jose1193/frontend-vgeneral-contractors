import React, { useState } from "react";
import { useForm, FormProvider, UseFormReturn, Control } from "react-hook-form";
import {
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ButtonNext from "../../../app/components/ButtonNext";
import { ClaimsData } from "../../../app/types/claims";
import useUpperCase from "../../hooks/useUpperCase";
import SelectPropertyAndCustomer from "../Claims/SelectPropertyAndCustomer";
import ClaimDetailsWizard from "./ClaimDetailsWizard";
import InsuranceAndWorkDetailsWizard from "./InsuranceAndWorkDetailsWizard";
import AffidavitAllianceWizard from "./AffidavitAllianceWizard";
import ClaimsSummary from "./ClaimsSummary";
import TypographyTitle from "../../../app/components/TypographyTitle";
import TypographyStepLabel from "../../../app/components/TypographyStepLabel";
import CustomButton from "../../../app/components/CustomButton";
interface ClaimsWizardProps {
  initialData?: ClaimsData;
  onSubmit: (data: ClaimsData) => Promise<string | undefined>;
}

interface StepProps {
  control: Control<ClaimsData>;
  watch: UseFormReturn<ClaimsData>["watch"];
  setValue: UseFormReturn<ClaimsData>["setValue"];
  upperCase: (str: string) => string;
  initialData?: ClaimsData;
  setShowAddressClaimForm: React.Dispatch<React.SetStateAction<boolean>>;
  showAddressClaimForm: boolean;
}

const ClaimsWizard: React.FC<ClaimsWizardProps> = ({
  initialData,
  onSubmit,
}) => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddressClaimForm, setShowAddressClaimForm] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const upperCase = useUpperCase();

  const methods = useForm<ClaimsData>({
    defaultValues: initialData || {},
  });

  const { handleSubmit, control, watch, setValue } = methods;

  const steps: { title: string; component: React.FC<StepProps> }[] = [
    {
      title: "Customer & Property Details",
      component: SelectPropertyAndCustomer,
    },
    { title: "Claim Details", component: ClaimDetailsWizard },
    {
      title: "Insurance & Alliance & Work Details",
      component: InsuranceAndWorkDetailsWizard,
    },
    {
      title: "Affidavit ",
      component: AffidavitAllianceWizard,
    },
    {
      title: "Review & Submit",
      component: ClaimsSummary as React.FC<StepProps>,
    },
  ];

  const nextStep = () =>
    setStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 0));

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const onSubmitHandler = async (data: ClaimsData) => {
    setIsSubmitting(true);
    try {
      const uuid = await onSubmit(data);
      if (uuid) {
        setSnackbar({
          open: true,
          message: "Claim submitted successfully!",
          severity: "success",
        });
      } else {
        throw new Error("Failed to create claim");
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error submitting claim. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLastStep = step === steps.length - 1;

  return (
    <FormProvider {...methods}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <Box
            sx={{
              flexGrow: 5,
              overflow: "hidden",

              mb: 10,
              p: { xs: 3, sm: 3, md: 2, lg: 4 },
            }}
          >
            <Stepper activeStep={step} alternativeLabel>
              {steps.map((stepItem, index) => (
                <Step key={stepItem.title}>
                  <StepLabel>
                    <TypographyStepLabel>{stepItem.title}</TypographyStepLabel>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box sx={{ mt: 4, mb: 2 }}>
              <TypographyTitle variant="h4">
                {steps[step].title}
              </TypographyTitle>
            </Box>
            {React.createElement(steps[step].component, {
              control,
              watch,
              setValue,
              upperCase,
              initialData,
              setShowAddressClaimForm,
              showAddressClaimForm,
            })}
            <Box
              sx={{
                mt: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                {step > 0 && (
                  <CustomButton
                    onClick={prevStep}
                    startIcon={<ArrowBackIcon />}
                    backgroundColor="#dc2626"
                    hoverBackgroundColor="#b91c1c"
                    color="#fff"
                    hoverColor="#fff"
                  >
                    Previous
                  </CustomButton>
                )}
              </Box>
              <Box>
                {!isLastStep && !showAddressClaimForm && (
                  <CustomButton
                    onClick={nextStep}
                    backgroundColor="#1E90FF"
                    hoverBackgroundColor="#1871CD"
                    color="#fff"
                    hoverColor="#fff"
                    endIcon={<ArrowForwardIcon />}
                  >
                    Next
                  </CustomButton>
                )}
                {isLastStep && (
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    disabled={isSubmitting}
                    startIcon={
                      isSubmitting ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : null
                    }
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : initialData
                      ? "Update Claim"
                      : "Create Claim"}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </form>
      </LocalizationProvider>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </FormProvider>
  );
};

export default ClaimsWizard;
