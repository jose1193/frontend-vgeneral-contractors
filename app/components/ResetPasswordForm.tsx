"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";
import { updateResetPassword } from "../lib/api";
import { useTheme } from "@mui/material/styles";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(5, "Password must be at least 5 characters")
    .max(30, "Password must not exceed 30 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])[A-Za-z\d!@#$%^&*()\-_=+{};:,<.>]{5,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function ResetPasswordForm() {
  const theme = useTheme();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [showPasswords, setShowPasswords] = useState({
    password: false,
    password_confirmation: false,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("resetToken");
    if (!storedToken) {
      router.push("/auth/forgot-password");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  const handleTogglePasswordVisibility = (
    field: "password" | "password_confirmation"
  ) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (
    values: { password: string; password_confirmation: string },
    { setSubmitting, resetForm }: any
  ) => {
    try {
      const response = await updateResetPassword(
        token,
        values.password,
        values.password_confirmation
      );

      if (response.success) {
        setSnackbar({
          open: true,
          message: "Password reset successfully",
          severity: "success",
        });
        resetForm();
        setTimeout(() => router.push("/"), 3000);
      } else {
        throw new Error(response.message || "Failed to reset password");
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : "An error occurred",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Paper
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
      <Typography variant="h6" gutterBottom>
        Reset Password
      </Typography>
      <Formik
        initialValues={{
          password: "",
          password_confirmation: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  name="password"
                  label="New Password"
                  type={showPasswords.password ? "text" : "password"}
                  margin="normal"
                  error={touched.password && errors.password}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            handleTogglePasswordVisibility("password")
                          }
                          edge="end"
                        >
                          {showPasswords.password ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  name="password_confirmation"
                  label="Confirm New Password"
                  type={
                    showPasswords.password_confirmation ? "text" : "password"
                  }
                  margin="normal"
                  error={
                    touched.password_confirmation &&
                    errors.password_confirmation
                  }
                  helperText={
                    touched.password_confirmation &&
                    errors.password_confirmation
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            handleTogglePasswordVisibility(
                              "password_confirmation"
                            )
                          }
                          edge="end"
                        >
                          {showPasswords.password_confirmation ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ mt: 3, mb: 2, height: 48 }}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress
                      size={24}
                      color="inherit"
                      sx={{ mr: 1 }}
                    />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
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
    </Paper>
  );
}
