"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  TextField,
  Typography,
  Box,
  Snackbar,
  Alert,
  Link,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import CircularProgress from "@mui/material/CircularProgress";
import { forgotPassword } from "../lib/api";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").max(35).required("Required"),
});

export default function ForgotPasswordForm() {
  const theme = useTheme();
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleForgotPassword = async (
    values: { email: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const result = await forgotPassword(values.email);
      localStorage.setItem("resetToken", result.token);
      localStorage.setItem("resetEmail", values.email);
      setSnackbar({
        open: true,
        message: "Password reset instructions sent to your email",
        severity: "success",
      });
      setTimeout(() => router.push("/auth/enter-pin"), 3000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "An error occurred. Please try again.",
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
        backgroundColor:
          theme.palette.mode === "light"
            ? "#ffffff"
            : theme.palette.background.paper,
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
        Forgot Password
      </Typography>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={handleForgotPassword}
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
            <TextField
              margin="normal"
              required
              fullWidth
              sx={{ mb: 3 }}
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, height: 48 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Sending...
                </>
              ) : (
                "Send Reset Instructions"
              )}
            </Button>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Link
                href="/"
                variant="h6"
                sx={{
                  textDecoration: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor: "rgba(250, 204, 21, 0.5)",
                  },
                  color:
                    theme.palette.mode === "light"
                      ? theme.palette.text.primary
                      : "inherit",
                }}
              >
                Volver
              </Link>
            </Box>
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
