"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { verifyResetPassword } from "../lib/api";

const PinSchema = Yup.object().shape({
  pin: Yup.string()
    .matches(/^[0-9]{4}$/, "PIN must be exactly 4 digits")
    .required("Required"),
});

export default function EnterPinForm() {
  const theme = useTheme();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("resetToken");
    const storedEmail = localStorage.getItem("resetEmail");
    if (!storedToken || !storedEmail) {
      router.push("/auth/forgot-password");
    } else {
      setToken(storedToken);
      setEmail(storedEmail);
    }
  }, [router]);

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleVerifyPin = async (
    values: { pin: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const result = await verifyResetPassword(token, values.pin);
      setSnackbar({
        open: true,
        message: "PIN verified successfully",
        severity: "success",
      });
      router.push("/auth/reset-password");
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Invalid PIN. Please try again.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: theme.palette.background.paper,
        padding: { xs: 3, sm: 4, md: 5 },
        borderRadius: "16px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      <Typography
        component="h1"
        variant="h5"
        sx={{ mb: 3, fontWeight: "medium" }}
      >
        Enter PIN
      </Typography>
      <Typography variant="body2" sx={{ textAlign: "center" }}>
        Please enter the 4-digit PIN sent to:
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, fontWeight: "bold" }}>
        {email}
      </Typography>

      <Formik
        initialValues={{ pin: "" }}
        validationSchema={PinSchema}
        onSubmit={handleVerifyPin}
      >
        {({
          isSubmitting,
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
        }) => (
          <Form>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              {[0, 1, 2, 3].map((index) => (
                <TextField
                  key={index}
                  name="pin"
                  type="text"
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: "center" },
                  }}
                  sx={{
                    width: "50px",
                    mx: 0.5,
                    "& input": { fontSize: "1.5rem" },
                  }}
                  value={values.pin[index] || ""}
                  onChange={(e) => {
                    const newPin = values.pin.split("");
                    newPin[index] = e.target.value;
                    handleChange({
                      target: { name: "pin", value: newPin.join("") },
                    });
                  }}
                  onBlur={handleBlur}
                  error={touched.pin && Boolean(errors.pin)}
                />
              ))}
            </Box>
            {touched.pin && errors.pin && (
              <Typography
                color="error"
                variant="body2"
                sx={{ mb: 2, textAlign: "center" }}
              >
                {errors.pin}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Verifying...
                </>
              ) : (
                "Verify PIN"
              )}
            </Button>
          </Form>
        )}
      </Formik>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
