import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface FeedbackSnackbarProps {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

const FeedbackSnackbar: React.FC<FeedbackSnackbarProps> = ({
  open,
  message,
  severity,
  onClose,
}) => (
  <Snackbar
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
  >
    <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
      {message}
    </Alert>
  </Snackbar>
);

export default FeedbackSnackbar;
