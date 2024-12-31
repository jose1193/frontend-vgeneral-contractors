import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import { useScopeSheetSync } from "../../../src/hooks/ScopeSheet/useScopeSheetSync";
import { useScopeSheet } from "../../../src/hooks/ScopeSheet/useScopeSheet";
import { useScopeSheetStore } from "../../stores/scope-sheetStore";
import type { ScopeSheetData } from "../../../app/types/scope-sheet";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";

interface EditScopeSheetDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentItem: ScopeSheetData;
  token: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

const EditScopeSheetDialog: React.FC<EditScopeSheetDialogProps> = ({
  open,
  onClose,
  onSuccess,
  currentItem,
  token,
}) => {
  const [description, setDescription] = useState(
    currentItem.scope_sheet_description || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleUpdate } = useScopeSheetSync(token);
  const { getItem } = useScopeSheet(token);
  const updateItem = useScopeSheetStore((state) => state.updateItem);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSubmit = async () => {
    if (!currentItem.uuid) return;
  
    setIsSubmitting(true);
    setError(null);
  
    try {
      // Realizar la actualización en el backend
      const updatedData = await handleUpdate(currentItem.uuid, {
        scope_sheet_description: description.trim() || undefined,
      });
  
      // Obtener los datos actualizados
      const refreshedData = await getItem(currentItem.uuid);
      
      if (refreshedData) {
        // Actualizar el estado local de Zustand con los datos más recientes
        updateItem(currentItem.uuid, {
          ...currentItem,
          ...refreshedData,
          scope_sheet_description: description.trim() || undefined,
        });
      }
  
      setSnackbar({
        open: true,
        message: "Scope sheet updated successfully!",
        severity: "success",
      });
  
      await onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error updating scope sheet:", error);
      const errorMessage = 
        error instanceof Error ? error.message : "Error updating scope sheet";
  
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      setDescription(currentItem.scope_sheet_description || "");
      onClose();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: "80vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#171717",
            color: "#fff",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Edit Scope Sheet Description
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              placeholder="Enter scope sheet description"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={isSubmitting} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            variant="contained"
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </>
  );
};

export default EditScopeSheetDialog;
