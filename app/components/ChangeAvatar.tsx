// components/ChangeAvatar.tsx
import React, { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  Avatar,
  IconButton,
  Input,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { updateProfilePhoto } from "../lib/api";

const ChangeAvatar: React.FC = () => {
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const { data: session, update } = useSession();
  const user = session?.user;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setNewProfileImage(file);
      setIsUploading(true);
      try {
        const response = await updateProfilePhoto(
          session?.accessToken as string,
          file
        );
        if (response.success) {
          setSnackbar({
            open: true,
            message: "Profile photo updated successfully",
            severity: "success",
          });
        } else {
          throw new Error("Failed to update profile photo");
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to update profile photo",
          severity: "error",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Avatar
        src={user?.profile_photo_path || "/default-avatar.png"}
        alt={user?.name || "Profile Avatar"}
        sx={{
          width: { xs: 50, md: 100 },
          height: { xs: 50, md: 100 },
          mb: { xs: 2, md: 0 },
          mr: { md: 3 },
        }}
      />
      <IconButton
        sx={{
          position: "absolute",
          right: 0,
          bottom: 0,
          backgroundColor: "background.paper",
          "&:hover": { backgroundColor: "action.hover" },
          width: { xs: 24, sm: 32, md: 40 }, // Ajustamos el tamaño del botón
          height: { xs: 24, sm: 32, md: 40 },
          padding: { xs: 0.5, sm: 1, md: 1.5 }, // Ajustamos el padding
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <EditIcon sx={{ fontSize: { xs: 14, sm: 18, md: 24 } }} />
      </IconButton>
      <Input
        type="file"
        inputRef={fileInputRef}
        sx={{ display: "none" }}
        onChange={handleFileChange}
        inputProps={{ accept: "image/*" }}
      />
      {isUploading && (
        <CircularProgress
          size={24}
          sx={{
            position: "absolute",
            top: "50%",
            right: -30, // Ajusta este valor según necesites
            transform: "translateY(-50%)",
          }}
        />
      )}

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

export default ChangeAvatar;
