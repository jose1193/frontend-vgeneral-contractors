import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import BusinessIcon from "@mui/icons-material/Business";
import useCapitalizeWords from "../../hooks/useCapitalizeWords";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSession } from "next-auth/react";
import { useMortgageCompanies } from "../../hooks/useMortgageCompanies";
import { useMortgageCompanyStore } from "../../../app/zustand/useMortgageCompanyStore";

interface MortgageCompanyModalProps {
  open: boolean;
  onClose: () => void;
}

interface MortgageCompanyFormData {
  mortgage_company_name: string;
}

const schema = yup.object().shape({
  mortgage_company_name: yup
    .string()
    .required("Mortgage company name is required"),
});

const MortgageCompanyModal: React.FC<MortgageCompanyModalProps> = ({
  open,
  onClose,
}) => {
  const capitalizeWords = useCapitalizeWords();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { createMortgageCompany } = useMortgageCompanies(token);
  const addMortgageCompany = useMortgageCompanyStore(
    (state) => state.addMortgageCompany
  );

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MortgageCompanyFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (
    data: MortgageCompanyFormData,
    e: React.FormEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setIsSubmitting(true);
    try {
      const newCompany = await createMortgageCompany(data);
      addMortgageCompany(newCompany);
      setSnackbar({
        open: true,
        message: "Mortgage company created successfully",
        severity: "success",
      });
      reset();
      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to create mortgage company",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit((data) => onSubmit(data, e))(e);
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            width: "80%",
            maxWidth: "800px",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#212121",
            mb: 5,
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
            py: 2,
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <BusinessIcon sx={{ mr: 1, fontSize: 28 }} /> New Mortgage Company
          </Box>
        </DialogTitle>
        <form onSubmit={handleFormSubmit}>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="mortgage_company_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Mortgage Company Name"
                      error={!!errors.mortgage_company_name}
                      helperText={errors.mortgage_company_name?.message}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(capitalizeWords(value));
                      }}
                      autoComplete="off"
                      sx={{ mt: 1 }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCancel} variant="outlined" sx={{ mr: 1 }}>
              Cancel
            </Button>
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
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MortgageCompanyModal;
