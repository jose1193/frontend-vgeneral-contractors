"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Formik, Form } from "formik";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { updateProfile } from "../../../app/lib/api";
import { UserData } from "../../../app/types/user";
import { validationSchema } from "../../../src/components/Validations/validationSchemaUserProfile";
import dynamic from "next/dynamic";
import ProfileHeader from "./ProfileHeader";
import ProfileForm from "./ProfileForm";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";
import MapSection from "../../components/MapSection";

const AddressAutocomplete = dynamic(
  () => import("../../../src/components/AddressAutocompleteProfile"),
  { loading: () => <CircularProgress />, ssr: false }
);

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  border: "1px solid rgba(255, 255, 255, 0.2)",
}));

const UserProfile = () => {
  const { data: session } = useSession();
  const user = session?.user as UserData | undefined;
  const [mapCoordinates, setMapCoordinates] = useState({ lat: 0, lng: 0 });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

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
      setSnackbar({
        open: true,
        message: response.message,
        severity: "success",
      });
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

  if (!user) {
    return <Typography>User not found or not logged in.</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <StyledPaper elevation={3}>
        <ProfileHeader user={user} />
        <Formik
          initialValues={{
            ...user,
            phone: user.phone || "",
            state: user.state || "",
            address_2: user.address_2 || "",
            latitude: user.latitude || null,
            longitude: user.longitude || null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <ProfileForm
                user={user}
                setMapCoordinates={setMapCoordinates}
                AddressAutocomplete={AddressAutocomplete}
                setFieldValue={setFieldValue}
              />
              <MapSection mapCoordinates={mapCoordinates} />
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
      </StyledPaper>
      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default UserProfile;
