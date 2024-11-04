import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { Controller, Control, useWatch, useFormContext } from "react-hook-form";
import { useClaims } from "../../hooks/useClaims";
import { ClaimsData } from "../../../app/types/claims";
import AddIcon from "@mui/icons-material/Add";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";

const SelectInsuranceCompany = dynamic(
  () => import("../SelectInsuranceCompany"),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  }
);

const SelectPublicCompany = dynamic(() => import("../SelectPublicCompany"), {
  loading: () => <CircularProgress />,
  ssr: false,
});

const SelectPublicAdjuster = dynamic(() => import("../SelectPublicAdjuster"), {
  loading: () => <CircularProgress />,
  ssr: false,
});

const SelectServiceRequest = dynamic(() => import("../SelectServiceRequest"), {
  loading: () => <CircularProgress />,
  ssr: false,
});

const SelectWorkDate = dynamic(() => import("../SelectWorkDate"), {
  loading: () => <CircularProgress />,
  ssr: false,
});

const SelectTechnicalServices = dynamic(
  () => import("../SelectTechnicalServices"),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  }
);

const SelectAllianceCompany = dynamic(
  () => import("../SelectAllianceCompany"),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  }
);

const InsuranceCompanyModal = dynamic(
  () => import("../Insurance-Company/InsuranceCompanyModal"),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  }
);

interface InsuranceAndWorkDetailsProps {
  control: Control<ClaimsData>;
  initialData?: ClaimsData;
  upperCase: (str: string) => string;
}

const InsuranceAndWorkDetailsWizard: React.FC<InsuranceAndWorkDetailsProps> = ({
  control,
  initialData,
  upperCase,
}) => {
  const [openInsuranceModal, setOpenInsuranceModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "error" | "success",
  });
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { validateAlliance } = useClaims(token);
  // Observar los cambios en los campos relevantes
  const allianceCompanyId = useWatch({
    control,
    name: "alliance_company_id",
  });

  const insuranceCompanyId = useWatch({
    control,
    name: "insurance_company_id",
  });

  // Updated validation function with proper dependency array
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const validateRelationship = useCallback(async () => {
    if (!allianceCompanyId || !insuranceCompanyId || !token) {
      setValidationError(null);
      return;
    }

    try {
      const result = await validateAlliance(
        allianceCompanyId,
        insuranceCompanyId
      );

      if (result.success && result.data.exists) {
        const message =
          result.data.message ||
          "This Alliance Company cannot be associated with the selected Insurance Company.";
        setValidationError(message);
        setSnackbar({
          open: true,
          message: message,
          severity: "error",
        });
      } else {
        setValidationError(null);
      }
    } catch (error) {
      console.error("Validation error:", error);
      const errorMessage =
        "Error validating company relationship. Please try again.";
      setValidationError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  }, [allianceCompanyId, insuranceCompanyId, token, validateAlliance]);

  useEffect(() => {
    validateRelationship();
  }, [validateRelationship]);

  return (
    <Grid container spacing={3} sx={{ my: 3 }}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Insurance Details
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name="policy_number"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Policy Number"
              onChange={(e) => field.onChange(upperCase(e.target.value))}
              fullWidth
              autoComplete="off"
            />
          )}
        />
      </Grid>
      <Grid item xs={11} sm={5} sx={{ position: "relative" }}>
        <Grid container alignItems="center">
          <Grid item xs={11}>
            <SelectInsuranceCompany control={control} />
          </Grid>
          {allianceCompanyId && insuranceCompanyId && (
            <Grid item xs={1} sx={{ display: "flex", alignItems: "center" }}>
              {validationError ? (
                <CancelIcon
                  sx={{ color: "error.main", fontSize: "1.2rem", ml: 1 }}
                />
              ) : (
                <CheckCircleIcon
                  sx={{ color: "success.main", fontSize: "1.2rem", ml: 1 }}
                />
              )}
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid
        item
        xs={1}
        sm={1}
        sx={{ display: "flex", alignItems: "center", ml: -2 }}
      >
        <IconButton
          color="primary"
          onClick={() => setOpenInsuranceModal(true)}
          size="small"
        >
          <AddIcon />
        </IconButton>
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectPublicCompany control={control} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectPublicAdjuster
          control={control}
          publicAdjusterAssignment={initialData?.public_adjuster_assignment}
        />
      </Grid>
      <Grid item xs={12} sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          Alliance Company
        </Typography>
      </Grid>
      <Grid container item xs={12} sm={6} alignItems="center" spacing={1}>
        <Grid item xs={11}>
          <SelectAllianceCompany control={control} />
        </Grid>
        {allianceCompanyId && insuranceCompanyId && (
          <Grid item xs={1} sx={{ display: "flex", alignItems: "center" }}>
            {validationError ? (
              <CancelIcon sx={{ color: "error.main", fontSize: "1.2rem" }} />
            ) : (
              <CheckCircleIcon
                sx={{ color: "success.main", fontSize: "1.2rem" }}
              />
            )}
          </Grid>
        )}
      </Grid>
      <Grid item xs={12} sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          Work Details
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectServiceRequest control={control} />
      </Grid>
      {initialData && (
        <Grid item xs={12} sm={6}>
          <SelectWorkDate control={control} />
        </Grid>
      )}
      <Grid item xs={12} sm={6}>
        <Controller
          name="number_of_floors"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="number-of-floors-label">
                Number of Floors
              </InputLabel>
              <Select
                {...field}
                labelId="number-of-floors-label"
                label="Number of Floors"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>
      {initialData && (
        <>
          <Grid item xs={12} sm={6}>
            <SelectTechnicalServices control={control} />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="scope_of_work"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Scope of Work"
                  fullWidth
                  multiline
                  rows={3}
                />
              )}
            />
          </Grid>
        </>
      )}

      <InsuranceCompanyModal
        open={openInsuranceModal}
        onClose={() => setOpenInsuranceModal(false)}
      />
      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Grid>
  );
};

export default InsuranceAndWorkDetailsWizard;
