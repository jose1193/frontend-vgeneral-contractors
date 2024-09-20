import React, { useState, Suspense } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  Box,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";

import dayjs, { Dayjs } from "dayjs";
import { ClaimsData } from "../../../app/types/claims";

import SelectProperty from "../SelectProperty";
import SelectTypeDamage from "../SelectTypeDamage";
import SelectInsuranceCompany from "../SelectInsuranceCompany";
import SelectPublicCompany from "../SelectPublicCompany";
import SelectPublicAdjuster from "../SelectPublicAdjuster";
import SelectAllianceCompany from "../SelectAllianceCompany";
import SelectServiceRequest from "../SelectServiceRequest";
import SelectTechnicalServices from "../SelectTechnicalServices";
import SelectDateOfLoss from "../SelectDateOfLoss";
import SelectWorkDate from "../SelectWorkDate";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import CustomerForm from "./CustomerForm";
import PropertyForm from "./PropertyForm";
import { claimsSchema } from "../../components/Validations/claimsValidation";

interface ClaimsDataFormProps {
  initialData?: ClaimsData;
  onSubmit: (data: ClaimsData) => Promise<string | undefined>;
}

const ClaimsForm: React.FC<ClaimsDataFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const [openPropertyModal, setOpenPropertyModal] = useState(false);
  const { control, handleSubmit } = useForm<ClaimsData>({
    defaultValues: initialData || {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Property and Customer Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Property and Customer
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={11}>
                  <SelectProperty control={control} />
                </Grid>
                <Grid item xs={1}>
                  <IconButton
                    color="primary"
                    onClick={() => setOpenCustomerModal(true)}
                  >
                    <PersonAddIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => setOpenPropertyModal(true)}
                  >
                    <AddHomeWorkIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>

            {/* Claim Details Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Claim Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="policy_number"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Policy Number" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="claim_number"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Claim Number" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SelectDateOfLoss control={control} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SelectTypeDamage control={control} />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="damage_description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Damage Description"
                        fullWidth
                        multiline
                        rows={3}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="description_of_loss"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Description of Loss"
                        fullWidth
                        multiline
                        rows={3}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Insurance and Company Details */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Insurance and Company Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <SelectInsuranceCompany control={control} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <SelectPublicCompany control={control} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SelectPublicAdjuster control={control} />
                </Grid>
              </Grid>
            </Box>

            {/* Work Details */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Work Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <SelectServiceRequest control={control} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SelectWorkDate control={control} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="number_of_floors"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Number of Floors"
                        type="number"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
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
              </Grid>
            </Box>

            {/* Affidavit Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Affidavit
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="affidavit.mortgage_company_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Mortgage Company Name"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="affidavit.mortgage_company_phone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Mortgage Company Phone"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="affidavit.mortgage_loan_number"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Mortgage Loan Number"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="affidavit.amount_paid"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Amount Paid"
                        type="number"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="affidavit.description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Affidavit Description"
                        fullWidth
                        multiline
                        rows={3}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="affidavit.never_had_prior_loss"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            checked={Boolean(value)}
                            onChange={(e) => onChange(e.target.checked)}
                          />
                        }
                        label="I have never had prior loss"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="affidavit.has_never_had_prior_loss"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            checked={Boolean(value)}
                            onChange={(e) => onChange(e.target.checked)}
                          />
                        }
                        label="I have had a prior loss"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Alliance Company Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Alliance Company
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <SelectAllianceCompany control={control} />
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
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
              </Grid>
            </Grid>
          </Box>
        </LocalizationProvider>
      </form>
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
      <CustomerForm
        open={openCustomerModal}
        onClose={() => setOpenCustomerModal(false)}
      />
      <PropertyForm
        open={openPropertyModal}
        onClose={() => setOpenPropertyModal(false)}
      />
    </>
  );
};

export default ClaimsForm;
