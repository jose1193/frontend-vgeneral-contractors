import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box, CircularProgress } from "@mui/material";
import { CauseOfLossData } from "../../../app/types/cause-of-loss";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";
import useCapitalizeWords from "../../hooks/useCapitalizeWords";

interface CauseOfLossFormProps {
  initialData?: CauseOfLossData;
  onSubmit: (data: CauseOfLossData) => Promise<void>;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

const CauseOfLossForm: React.FC<CauseOfLossFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const capitalizeWords = useCapitalizeWords();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CauseOfLossData>({
    defaultValues: initialData || {
      cause_loss_name: "",
      description: "",
    },
  });

  const onSubmitHandler = async (data: CauseOfLossData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      setSnackbar({
        open: true,
        message: initialData
          ? "Cause of Loss updated successfully!"
          : "Cause of Loss created successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSnackbar({
        open: true,
        message: "Error processing your request. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Controller
            name="cause_loss_name"
            control={control}
            rules={{ required: "Cause of Loss Name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Cause of Loss Name"
                variant="outlined"
                fullWidth
                error={!!errors.cause_loss_name}
                helperText={errors.cause_loss_name?.message}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(capitalizeWords(value));
                }}
              />
            )}
          />

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
              />
            )}
          />

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
              ? "Update Cause of Loss"
              : "Create Cause of Loss"}
          </Button>
        </Box>
      </form>

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default CauseOfLossForm;
