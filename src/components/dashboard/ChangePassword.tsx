// components/ChanguePassword.tsx
"use client";
import React, { useState } from "react";
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
import { useSession } from "next-auth/react";
import { updatePassword } from "../../../app/lib/api";

const validationSchema = Yup.object().shape({
  current_password: Yup.string().required("Current password is required"),
  new_password: Yup.string()
    .min(5, "Password must be at least 5 characters")
    .max(30, "Password must not exceed 30 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])[A-Za-z\d!@#$%^&*()\-_=+{};:,<.>]{5,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("New password is required"),
  confirmed_password: Yup.string()
    .oneOf([Yup.ref("new_password")], "Passwords must match")
    .required("Confirm password is required"),
});

type PasswordField = "current_password" | "new_password" | "confirmed_password";

const ChangePassword = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [showPasswords, setShowPasswords] = useState({
    current_password: false,
    new_password: false,
    confirmed_password: false,
  });

  const handleTogglePasswordVisibility = (field: PasswordField) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  if (!user) {
    return <Typography></Typography>;
  }
  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      const response = await updatePassword(
        session?.accessToken as string,
        values
      );

      if (response.success) {
        setSnackbar({
          open: true,
          message: "Password updated successfully",
          severity: "success",
        });
        resetForm();
      } else {
        throw new Error(response.message || "Failed to update password");
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
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Paper
        elevation={3}
        sx={{ p: 3, border: "1px solid rgba(255, 255, 255, 0.2)" }}
      >
        <Typography variant="h6" gutterBottom>
          Change Password
        </Typography>
        <Formik
          initialValues={{
            current_password: "",
            new_password: "",
            confirmed_password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="current_password"
                    label="Current Password"
                    type={showPasswords.current_password ? "text" : "password"}
                    margin="normal"
                    error={touched.current_password && errors.current_password}
                    helperText={
                      touched.current_password && errors.current_password
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() =>
                              handleTogglePasswordVisibility("current_password")
                            }
                            edge="end"
                          >
                            {showPasswords.current_password ? (
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
                <Grid item xs={12} lg={6}>
                  <Box>
                    <Field
                      as={TextField}
                      fullWidth
                      name="new_password"
                      label="New Password"
                      type={showPasswords.new_password ? "text" : "password"}
                      margin="normal"
                      error={touched.new_password && errors.new_password}
                      helperText={touched.new_password && errors.new_password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() =>
                                handleTogglePasswordVisibility("new_password")
                              }
                              edge="end"
                            >
                              {showPasswords.new_password ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Field
                      as={TextField}
                      fullWidth
                      name="confirmed_password"
                      label="Confirm New Password"
                      type={
                        showPasswords.confirmed_password ? "text" : "password"
                      }
                      margin="normal"
                      error={
                        touched.confirmed_password && errors.confirmed_password
                      }
                      helperText={
                        touched.confirmed_password && errors.confirmed_password
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() =>
                                handleTogglePasswordVisibility(
                                  "confirmed_password"
                                )
                              }
                              edge="end"
                            >
                              {showPasswords.confirmed_password ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
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
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
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
    </Box>
  );
};

export default ChangePassword;
