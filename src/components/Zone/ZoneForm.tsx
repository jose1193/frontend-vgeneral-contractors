import React, { useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Grid,
  MenuItem,
} from "@mui/material";
import { ZoneData } from "../../../app/types/zone";
import { zoneSchema } from "../Validations/zoneValidation";
import useFormSnackbar from "../../hooks/useFormSnackbar";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";
import { capitalizeForm, upperCaseForm } from "../../utils/formatters";

interface ZoneFormProps {
  initialData?: ZoneData;
  uuid?: string;
  onSubmit: (data: ZoneData) => Promise<void>;
}

const ZoneForm: React.FC<ZoneFormProps> = ({ initialData, onSubmit, uuid }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { snackbar, setSnackbar, handleSnackbarClose } = useFormSnackbar();

  const methods = useForm<ZoneData>({
    defaultValues: initialData || {
      zone_name: "",
      zone_type: "interior",
      code: null,
      description: null,
    },
    resolver: yupResolver(zoneSchema),
    mode: "onChange",
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = methods;

  const onSubmitHandler = async (data: ZoneData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      setSnackbar({
        open: true,
        message: "Zone submitted successfully!",
        severity: "success",
      });
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
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="zone_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Zone Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.zone_name}
                    helperText={errors.zone_name?.message}
                    autoComplete="off"
                    onChange={(e) => {
                      const formattedValue = capitalizeForm(e.target.value);
                      setValue("zone_name", formattedValue);
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="zone_type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Zone Type"
                    variant="outlined"
                    fullWidth
                    error={!!errors.zone_type}
                    helperText={errors.zone_type?.message}
                  >
                    <MenuItem value="interior">Interior</MenuItem>
                    <MenuItem value="exterior">Exterior</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Code"
                    variant="outlined"
                    fullWidth
                    error={!!errors.code}
                    helperText={errors.code?.message}
                    autoComplete="off"
                    value={field.value || ""}
                    onChange={(e) => {
                      const formattedValue = upperCaseForm(e.target.value);
                      setValue("code", formattedValue);
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    value={field.value || ""}
                    onChange={(e) => {
                      const formattedValue = capitalizeForm(e.target.value);
                      setValue("description", formattedValue);
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
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
                ? "Update Zone"
                : "Create Zone"}
            </Button>
          </Box>
        </Box>

        <FeedbackSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={handleSnackbarClose}
        />
      </form>
    </FormProvider>
  );
};

export default ZoneForm;
