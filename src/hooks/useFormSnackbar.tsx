import { useState } from "react";

const useFormSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return { snackbar, setSnackbar, handleSnackbarClose };
};

export default useFormSnackbar;
