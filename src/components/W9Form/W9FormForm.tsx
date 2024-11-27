"use client";

import React, { useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Grid,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  FormControl,
} from "@mui/material";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";
import { W9FormData } from "../../../app/types/w9form";
import { W9FormValidation } from "../../components/Validations/w9formValidation";
import dynamic from "next/dynamic";
import useCapitalizeWords from "../../hooks/useCapitalizeWords";

const AddressAutocomplete = dynamic(
  () => import("../../components/AddressAutocomplete"),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  }
);

interface W9FormFormProps {
  initialData?: Partial<W9FormData>;
  onSubmit: (data: W9FormData) => Promise<void>;
}

const W9FormForm: React.FC<W9FormFormProps> = ({ initialData, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const capitalizeWords = useCapitalizeWords();
  const handleNameChange = (newValue: string, field: any) => {
    const capitalizedValue = capitalizeWords(newValue);
    field.onChange(capitalizedValue);
  };
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const defaultValues: Partial<W9FormData> = {
    name: initialData?.name || "",
    business_name: initialData?.business_name || "",
    is_individual_sole_proprietor:
      initialData?.is_individual_sole_proprietor || false,
    is_corporation: initialData?.is_corporation || false,
    is_partnership: initialData?.is_partnership || false,
    is_limited_liability_company:
      initialData?.is_limited_liability_company || false,
    is_exempt_payee: initialData?.is_exempt_payee || false,
    is_other: initialData?.is_other || false,
    llc_tax_classification: initialData?.llc_tax_classification || "",
    address: initialData?.address || "",
    address_2: initialData?.address_2 || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zip_code: initialData?.zip_code || "",
    country: initialData?.country || "",
    latitude: initialData?.latitude,
    longitude: initialData?.longitude,
    requester_name_address: initialData?.requester_name_address || "",
    account_numbers: initialData?.account_numbers || "",
    social_security_number: initialData?.social_security_number || "",
    employer_identification_number:
      initialData?.employer_identification_number || "",
    certification_signed: initialData?.certification_signed || false,
    signature_date: initialData?.signature_date || "",
    status: initialData?.status || "",
    notes: initialData?.notes || "",
    document_path: initialData?.document_path || "",
    generated_by: initialData?.generated_by || "",
  };
  const methods = useForm<W9FormData>({
    defaultValues,
    resolver: yupResolver(W9FormValidation),
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = methods;

  const handleAddressSelect = (addressDetails: any) => {
    if (addressDetails) {
      setValue("address", addressDetails.address);
      setValue("city", addressDetails.city);
      setValue("state", addressDetails.state);
      setValue("country", addressDetails.country);
      setValue("zip_code", addressDetails.zip_code);
      setValue("latitude", addressDetails.latitude);
      setValue("longitude", addressDetails.longitude);
    }
  };

  const handleAddressClear = () => {
    setValue("address", "");
    setValue("address_2", "");
    setValue("city", "");
    setValue("state", "");
    setValue("country", "");
    setValue("zip_code", "");
    setValue("latitude", undefined);
    setValue("longitude", undefined);
  };

  const onSubmitHandler = async (data: W9FormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      setSnackbar({
        open: true,
        message: initialData
          ? "W9 Form updated successfully!"
          : "W9 Form created successfully!",
        severity: "success",
      });
      if (!initialData) {
        reset();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        noValidate
        sx={{ mt: 1 }}
      >
        <Grid container spacing={2}>
          {/* Required Text Fields */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  onChange={(e) => handleNameChange(e.target.value, field)}
                  label="Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  required
                  disabled={isSubmitting}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="business_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  onChange={(e) => handleNameChange(e.target.value, field)}
                  label="Business Name"
                  fullWidth
                  error={!!errors.business_name}
                  helperText={errors.business_name?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Grid>
          {/* Checkbox Fields */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="is_individual_sole_proprietor"
                  control={control}
                  render={({ field }) => (
                    <FormControl error={!!errors.is_individual_sole_proprietor}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={isSubmitting}
                          />
                        }
                        label="Individual/Sole Proprietor"
                      />
                      {errors.is_individual_sole_proprietor && (
                        <FormHelperText>
                          {errors.is_individual_sole_proprietor.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controller
                  name="is_corporation"
                  control={control}
                  render={({ field }) => (
                    <FormControl error={!!errors.is_corporation}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={isSubmitting}
                          />
                        }
                        label="Corporation"
                      />
                      {errors.is_corporation && (
                        <FormHelperText>
                          {errors.is_corporation.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controller
                  name="is_partnership"
                  control={control}
                  render={({ field }) => (
                    <FormControl error={!!errors.is_partnership}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={isSubmitting}
                          />
                        }
                        label="Partnership"
                      />
                      {errors.is_partnership && (
                        <FormHelperText>
                          {errors.is_partnership.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controller
                  name="is_limited_liability_company"
                  control={control}
                  render={({ field }) => (
                    <FormControl error={!!errors.is_limited_liability_company}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={isSubmitting}
                          />
                        }
                        label="Limited Liability Company"
                      />
                      {errors.is_limited_liability_company && (
                        <FormHelperText>
                          {errors.is_limited_liability_company.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controller
                  name="is_exempt_payee"
                  control={control}
                  render={({ field }) => (
                    <FormControl error={!!errors.is_exempt_payee}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={isSubmitting}
                          />
                        }
                        label="Exempt Payee"
                      />
                      {errors.is_exempt_payee && (
                        <FormHelperText>
                          {errors.is_exempt_payee.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controller
                  name="is_other"
                  control={control}
                  render={({ field }) => (
                    <FormControl error={!!errors.is_other}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={isSubmitting}
                          />
                        }
                        label="Other"
                      />
                      {errors.is_other && (
                        <FormHelperText>
                          {errors.is_other.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          {/* LLC Classification */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="llc_tax_classification"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="LLC Tax Classification"
                  fullWidth
                  error={!!errors.llc_tax_classification}
                  helperText={errors.llc_tax_classification?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Grid>
          {/* Address Fields with Autocomplete */}
          <Grid item xs={12} sm={6} sx={{ mt: -2 }}>
            <AddressAutocomplete
              onAddressSelect={handleAddressSelect}
              onAddressClear={handleAddressClear}
              name="address"
              label="Address"
              defaultValue={initialData?.address || ""}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="address_2"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address Line 2"
                  fullWidth
                  error={!!errors.address_2}
                  helperText={errors.address_2?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="City"
                  fullWidth
                  error={!!errors.city}
                  helperText={errors.city?.message}
                  required
                  disabled={isSubmitting}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    "& .MuiInputBase-input.Mui-readOnly": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="State"
                  fullWidth
                  error={!!errors.state}
                  helperText={errors.state?.message}
                  required
                  disabled={isSubmitting}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    "& .MuiInputBase-input.Mui-readOnly": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="zip_code"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ZIP Code"
                  fullWidth
                  error={!!errors.zip_code}
                  helperText={errors.zip_code?.message}
                  required
                  disabled={isSubmitting}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    "& .MuiInputBase-input.Mui-readOnly": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Country"
                  fullWidth
                  error={!!errors.country}
                  helperText={errors.country?.message}
                  required
                  disabled={isSubmitting}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    "& .MuiInputBase-input.Mui-readOnly": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                />
              )}
            />
          </Grid>

          {/* Additional Fields */}
          <Grid item xs={12}>
            <Controller
              name="requester_name_address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Requester Name and Address"
                  fullWidth
                  multiline
                  rows={2}
                  error={!!errors.requester_name_address}
                  helperText={errors.requester_name_address?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="account_numbers"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Account Numbers"
                  fullWidth
                  error={!!errors.account_numbers}
                  helperText={errors.account_numbers?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Grid>
          {/* Required Information */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="social_security_number"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Social Security Number"
                  fullWidth
                  error={!!errors.social_security_number}
                  helperText={errors.social_security_number?.message}
                  required
                  placeholder="000-12-1234"
                  disabled={isSubmitting}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="employer_identification_number"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Employer Identification Number"
                  placeholder="00-1234567"
                  fullWidth
                  error={!!errors.employer_identification_number}
                  helperText={errors.employer_identification_number?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Grid>
          {/* Certification Fields */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="certification_signed"
              control={control}
              render={({ field }) => (
                <FormControl error={!!errors.certification_signed}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value || false}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={isSubmitting}
                      />
                    }
                    label="Certification Signed"
                  />
                  {errors.certification_signed && (
                    <FormHelperText>
                      {errors.certification_signed.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="signature_date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Signature Date"
                  type="date"
                  fullWidth
                  error={!!errors.signature_date}
                  helperText={errors.signature_date?.message}
                  disabled={isSubmitting}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
          </Grid>
          {/* Status and Notes */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Status"
                  fullWidth
                  error={!!errors.status}
                  helperText={errors.status?.message}
                  required
                  disabled={isSubmitting}
                  SelectProps={{
                    native: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  <option value="">Select a status</option>
                  <option value="pending">Pending</option>
                  <option value="draft">Draft</option>
                  <option value="in progress">In Progress</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Notes"
                  fullWidth
                  multiline
                  rows={2}
                  error={!!errors.notes}
                  helperText={errors.notes?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Grid>

          {/* Hidden location fields */}
          <input type="hidden" {...control.register("latitude")} />
          <input type="hidden" {...control.register("longitude")} />
          <Grid item xs={12}>
            <Box sx={{ mt: 3, mb: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isSubmitting
                  ? "Submitting..."
                  : initialData
                  ? "Update W9 Form"
                  : "Create W9 Form"}
              </Button>
            </Box>
          </Grid>
        </Grid>

        <FeedbackSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </Box>
    </FormProvider>
  );
};

export default W9FormForm;
