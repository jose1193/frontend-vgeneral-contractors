"use client";

import React, { useState, useEffect } from "react";
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
import { validationSchema } from "../../../src/components/Validations/validationSchemaUserProfile";
import dynamic from "next/dynamic";

// Update validation schema to include new fields
const updatedValidationSchema = Yup.object().shape({
  ...validationSchema.fields,
  state: Yup.string().nullable(),
  latitude: Yup.number().nullable(),
  longitude: Yup.number().nullable(),
});

const AddressAutocomplete = dynamic(
  () => import("../../../src/components/AddressAutocompleteProfile"),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  }
);

const GoogleMapComponent = dynamic(() => import("../GoogleMap"), {
  loading: () => <CircularProgress />,
  ssr: false,
});

const ProfileField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const UserProfile = () => {
  const { data: session, update } = useSession();
  const user = session?.user as UserData | undefined;
  const [usernameModifiedManually, setUsernameModifiedManually] =
    useState(false);
  const [generatedUsername, setGeneratedUsername] = useState<string>("");
  const [mapCoordinates, setMapCoordinates] = useState({ lat: 0, lng: 0 });
  const [coordinates, setCoordinates] = useState({
    latitude: user?.latitude || null,
    longitude: user?.longitude || null,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const capitalizeWords = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const generateUsername = (firstName: string, lastName: string) => {
    if (!firstName) return "";

    const cleanFirstName = firstName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanLastName =
      lastName?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";

    let baseUsername = cleanFirstName;
    if (cleanLastName) {
      baseUsername += cleanLastName.charAt(0);
    }

    const randomNum = Math.floor(1 + Math.random() * 999);
    return `${baseUsername}${randomNum}`;
  };

  const handleNameChange = (
    value: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const capitalizedName = capitalizeWords(value);
    setFieldValue("name", capitalizedName);

    if (!usernameModifiedManually) {
      const lastName = user?.last_name || "";
      const newUsername = generateUsername(capitalizedName, lastName);
      setGeneratedUsername(newUsername);
      setFieldValue("username", newUsername);
    }
  };

  const handleLastNameChange = (
    value: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const capitalizedLastName = capitalizeWords(value);
    setFieldValue("last_name", capitalizedLastName);

    if (!usernameModifiedManually) {
      const firstName = user?.name || "";
      const newUsername = generateUsername(firstName, capitalizedLastName);
      setGeneratedUsername(newUsername);
      setFieldValue("username", newUsername);
    }
  };

  const handleAddressSelect = (
    addressDetails: any,
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (addressDetails.latitude && addressDetails.longitude) {
      setMapCoordinates({
        lat: addressDetails.latitude,
        lng: addressDetails.longitude,
      });
      setFieldValue("latitude", addressDetails.latitude);
      setFieldValue("longitude", addressDetails.longitude);
      setFieldValue("address", addressDetails.address);
      setFieldValue("city", addressDetails.city);
      setFieldValue("state", addressDetails.state);
      setFieldValue("country", addressDetails.country);
      setFieldValue("zip_code", addressDetails.zip_code);
      setCoordinates({
        latitude: addressDetails.latitude,
        longitude: addressDetails.longitude,
      });
    }
  };

  const handleAddressClear = (
    setFieldValue: (field: string, value: any) => void
  ) => {
    setFieldValue("address", "");
    setFieldValue("city", "");
    setFieldValue("state", "");
    setFieldValue("country", "");
    setFieldValue("zip_code", "");
    setFieldValue("latitude", null);
    setFieldValue("longitude", null);
    setMapCoordinates({ lat: 0, lng: 0 });
    setCoordinates({ latitude: null, longitude: null });
  };

  const handleSubmit = async (
    values: UserData,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    if (!session?.accessToken || !user?.uuid) {
      setSnackbar({
        open: true,
        message: "Authentication information missing",
        severity: "error",
      });
      setSubmitting(false);
      return;
    }

    try {
      const response = await updateProfile(
        session.accessToken,
        user.uuid,
        values
      );
      //console.log("Respuesta completa:", response); // Para ver la estructura
      //console.log("response.data:", response.data);
      console.log("response.message:", response.message);
      setSnackbar({
        open: true,
        message: response.message, // Usar el mensaje del backend
        severity: "success",
      });

      // Actualizar la sesión con los datos actualizados si es necesario
      //if (update) {
      //await update({
      //...session,
      //user: {
      //...session.user,
      //...response.data, // Usar los datos actualizados del backend
      //},
      //});
      //}
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error instanceof Error ? error.message : "Failed to update profile",
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
      return "N/A";
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

  if (!user) {
    return <Typography>User not found or not logged in.</Typography>;
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
          initialValues={{
            ...user,
            phone: user.phone || "",
            state: user.state || "",
            latitude: user.latitude || null,
            longitude: user.longitude || null,
          }}
          validationSchema={updatedValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, setFieldValue }) => (
            <Form>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Field
                    name="username"
                    component={UsernameField}
                    autoGenerated={generatedUsername}
                    onManualChange={() => setUsernameModifiedManually(true)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field name="email" component={EmailField} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={ProfileField}
                    fullWidth
                    name="name"
                    label="First Name"
                    variant="outlined"
                    error={touched.name && errors.name}
                    helperText={touched.name && errors.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleNameChange(e.target.value, setFieldValue);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={ProfileField}
                    fullWidth
                    name="last_name"
                    label="Last Name"
                    variant="outlined"
                    error={touched.last_name && errors.last_name}
                    helperText={touched.last_name && errors.last_name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleLastNameChange(e.target.value, setFieldValue);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PhoneField />
                </Grid>
                <Grid item xs={12} md={6}>
                  <AddressAutocomplete
                    onAddressSelect={(addressDetails) =>
                      handleAddressSelect(addressDetails, setFieldValue)
                    }
                    onAddressClear={() => handleAddressClear(setFieldValue)}
                    name="address"
                    label="Address"
                    defaultValue={user.address || ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={ProfileField}
                    fullWidth
                    name="address_2"
                    label="Home Address - (Optional)"
                    variant="outlined"
                    error={touched.address_2 && errors.address_2}
                    helperText={touched.address_2 && errors.address_2}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={ProfileField}
                    fullWidth
                    name="city"
                    label="City"
                    variant="outlined"
                    error={touched.city && errors.city}
                    helperText={touched.city && errors.city}
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
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={ProfileField}
                    fullWidth
                    name="state"
                    label="State"
                    variant="outlined"
                    error={touched.state && errors.state}
                    helperText={touched.state && errors.state}
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
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={ProfileField}
                    fullWidth
                    name="country"
                    label="Country"
                    variant="outlined"
                    error={touched.country && errors.country}
                    helperText={touched.country && errors.country}
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
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={ProfileField}
                    fullWidth
                    name="zip_code"
                    label="Zip Code"
                    variant="outlined"
                    error={touched.zip_code && errors.zip_code}
                    helperText={touched.zip_code && errors.zip_code}
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
                </Grid>

                {/* Hidden fields for coordinates */}
                <input type="hidden" name="latitude" />
                <input type="hidden" name="longitude" />
              </Grid>

              {mapCoordinates.lat !== 0 && mapCoordinates.lng !== 0 && (
                <Box
                  height={400}
                  width="100%"
                  position="relative"
                  sx={{ mt: 2 }}
                >
                  <GoogleMapComponent
                    latitude={mapCoordinates.lat}
                    longitude={mapCoordinates.lng}
                  />
                </Box>
              )}

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
