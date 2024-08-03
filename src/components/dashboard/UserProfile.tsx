// components/UserProfile.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { updateProfile } from "../../../app/lib/api";

import EmailField from "../../../app/components/EmailField";
import UsernameField from "../../../app/components/UsernameField";
import ChangeAvatar from "../../../app/components/ChangeAvatar";
import PhoneField from "../../../app/components/PhoneField";
import { UserData } from "../../../app/types/user";

const ProfileField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .max(40, "Name must be at most 40 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces")
    .required("First name is required"),

  last_name: Yup.string()
    .max(40, "Last name must be at most 40 characters")
    .matches(/^[a-zA-Z\s]+$/, "Last name must contain only letters and spaces")
    .required("Last name is required"),

  username: Yup.string()
    .max(30, "Username must be at most 30 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username must contain only letters, numbers, and underscores"
    )
    .required("Username is required"),

  email: Yup.string().email("Invalid email").required("Email is required"),

  phone: Yup.string().required("Phone is required"),

  address: Yup.string().max(255, "Address must be at most 255 characters"),

  zip_code: Yup.string().max(20, "Zip code must be at most 20 characters"),

  city: Yup.string().max(255, "City must be at most 255 characters"),

  country: Yup.string().max(255, "Country must be at most 255 characters"),
});

const UserProfile = () => {
  const { data: session, update } = useSession();
  const user = session?.user as UserData | undefined;

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  if (!user) {
    return <Typography>User not found or not logged in.</Typography>;
  }

  const handleSubmit = async (
    values: UserData,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const response = await updateProfile(
        session?.accessToken as string,
        values
      );
      setSnackbar({
        open: true,
        message: "Profile updated successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update profile",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  function formatDate(dateString: string | null | undefined): string {
    if (!dateString) {
      return "N/A"; // or any default value you prefer
    }

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  }
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Paper
        elevation={3}
        sx={{ p: 3, border: "1px solid rgba(255, 255, 255, 0.2)" }}
      >
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "flex-start" },
              justifyContent: "space-between",
              textAlign: { xs: "center", md: "left" },
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "center", md: "flex-start" },
                mb: { xs: 2, md: 0 },
              }}
            >
              <ChangeAvatar />
              <Box
                sx={{
                  ml: { xs: 0, md: 2 },
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: {
                      xs: "1.2rem",
                      sm: "1.5rem",
                      md: "1.75rem",
                      lg: "2rem",
                    },
                    fontWeight: "bold",
                  }}
                >{`${user.name} ${user.last_name}`}</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {user.user_role}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                alignSelf: { xs: "center", md: "flex-end" },
                mt: { xs: 2, md: 0 },
                textAlign: { xs: "center", md: "right" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="caption" color="textSecondary">
                UUID:{" "}
                <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                  {user.uuid}
                </Typography>
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Register Date:{" "}
                <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                  {formatDate(user.created_at)}
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Box>

        <Formik
          initialValues={{ ...user, phone: user.phone || "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Field name="username" component={UsernameField} />
                  <Field name="email" component={EmailField} />
                  <Field
                    as={ProfileField}
                    fullWidth
                    name="name"
                    label="First Name"
                    variant="outlined"
                    error={touched.name && errors.name}
                    helperText={touched.name && errors.name}
                  />
                  <Field
                    as={ProfileField}
                    fullWidth
                    name="last_name"
                    label="Last Name"
                    variant="outlined"
                    error={touched.last_name && errors.last_name}
                    helperText={touched.last_name && errors.last_name}
                  />
                  <PhoneField />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={ProfileField}
                    fullWidth
                    name="address"
                    label="Address"
                    variant="outlined"
                    error={touched.address && errors.address}
                    helperText={touched.address && errors.address}
                  />
                  <Field
                    as={ProfileField}
                    fullWidth
                    name="city"
                    label="City"
                    variant="outlined"
                    error={touched.city && errors.city}
                    helperText={touched.city && errors.city}
                  />
                  <Field
                    as={ProfileField}
                    fullWidth
                    name="country"
                    label="Country"
                    variant="outlined"
                    error={touched.country && errors.country}
                    helperText={touched.country && errors.country}
                  />
                  <Field
                    as={ProfileField}
                    fullWidth
                    name="zip_code"
                    label="Zip Code"
                    variant="outlined"
                    error={touched.zip_code && errors.zip_code}
                    helperText={touched.zip_code && errors.zip_code}
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
};

export default UserProfile;
