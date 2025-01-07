import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Restore as RestoreIcon,
  Delete as DeleteIcon,
  AccountCircle as AccountCircleIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  ScopeSheetExportData,
  ScopeSheetExportCreateDTO,
} from "../../../app/types/scope-sheet-export";
import { useSession } from "next-auth/react";
import { useScopeSheetExportSync } from "@/hooks/ScopeSheetExport/useScopeSheetExportSync";
import { ScopeSheetData } from "../../../app/types/scope-sheet";
import { useRouter } from "next/navigation";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";
import Image from "next/image";

interface ScopeSheetExportProps {
  scope_sheet_export: ScopeSheetExportData | undefined;
  scope_sheet_uuid: string;
  onUpdate: () => Promise<ScopeSheetData | null>;
}

const ScopeSheetExport: React.FC<ScopeSheetExportProps> = ({
  scope_sheet_export,
  scope_sheet_uuid,
  onUpdate,
}) => {
  const { data: session } = useSession();
  const token = session?.user?.token ?? "";
  const { handleCreate, handleDelete, handleUpdate } =
    useScopeSheetExportSync(token);
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [generating, setGenerating] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleGeneratePDF = async () => {
    setGenerating(true);
    try {
      const exportDTO: ScopeSheetExportCreateDTO = {
        scope_sheet_uuid: scope_sheet_uuid,
      };

      const newExport = await handleCreate(exportDTO);
      if (newExport) {
        await onUpdate();
        setSnackbar({
          open: true,
          message: "PDF generated successfully",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      setSnackbar({
        open: true,
        message: "Failed to generate PDF",
        severity: "error",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleView = () => {
    if (scope_sheet_export?.full_pdf_path) {
      window.open(scope_sheet_export.full_pdf_path, "_blank");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!scope_sheet_export?.uuid) return;

    setDeleting(true);
    try {
      await handleDelete(scope_sheet_export.uuid);
      await onUpdate();
      setSnackbar({
        open: true,
        message: "PDF export deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to delete export:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete PDF export",
        severity: "error",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleUpdateExport = async () => {
    setRegenerateDialogOpen(true);
  };

  const handleRegenerateConfirm = async () => {
    if (!scope_sheet_export?.uuid) return;

    setRegenerating(true);
    try {
      await handleUpdate(scope_sheet_export.uuid, {
        scope_sheet_uuid: scope_sheet_uuid,
      });
      await onUpdate();
      setSnackbar({
        open: true,
        message: "PDF regenerated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to regenerate PDF:", error);
      setSnackbar({
        open: true,
        message: "Failed to regenerate PDF",
        severity: "error",
      });
    } finally {
      setRegenerating(false);
      setRegenerateDialogOpen(false);
    }
  };

  const handleImagePreview = (imagePath: string) => {
    setPreviewImage(imagePath);
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
    setPreviewImage(null);
  };

  return (
    <>
      <Box>
        {scope_sheet_export ? (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "black",
                  }}
                >
                  <AccountCircleIcon />
                  <Typography sx={{ fontWeight: "bold" }}>
                    {scope_sheet_export.generated_by}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="View PDF">
                    <IconButton
                      aria-label="view"
                      onClick={handleView}
                      sx={{
                        color: "#3b82f6",
                        "&:hover": {
                          color: "#2563eb",
                          backgroundColor: "rgba(59, 130, 246, 0.04)",
                        },
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Regenerate PDF">
                    <IconButton
                      aria-label="restore"
                      onClick={handleUpdateExport}
                      disabled={regenerating}
                      sx={{
                        color: "#f97316",
                        "&:hover": {
                          color: "#ea580c",
                          backgroundColor: "rgba(249, 115, 22, 0.04)",
                        },
                      }}
                    >
                      {regenerating ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <RestoreIcon />
                      )}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete PDF">
                    <IconButton
                      aria-label="delete"
                      onClick={() => setDeleteDialogOpen(true)}
                      sx={{
                        color: "#ef4444",
                        "&:hover": {
                          color: "#dc2626",
                          backgroundColor: "rgba(239, 68, 68, 0.04)",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Typography>
                File:{" "}
                {scope_sheet_export?.full_pdf_path?.split("/").pop() ||
                  "Scope Sheet PDF"}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  mt: "auto",
                  color: "text.secondary",
                  fontSize: "0.875rem",
                }}
              >
                <Typography>
                  Created:{" "}
                  <Box component="span" sx={{ fontWeight: "bold" }}>
                    {scope_sheet_export.created_at}
                  </Box>
                </Typography>
                <Typography>
                  Updated:{" "}
                  <Box component="span" sx={{ fontWeight: "bold" }}>
                    {scope_sheet_export.updated_at}
                  </Box>
                </Typography>
              </Box>
            </Box>
          </>
        ) : (
          <Button
            variant="contained"
            onClick={handleGeneratePDF}
            disabled={generating}
            sx={{ position: "relative" }}
          >
            {generating ? (
              <>
                <CircularProgress
                  size={24}
                  sx={{
                    color: "white",
                    position: "absolute",
                    left: "50%",
                    marginLeft: "-12px",
                  }}
                />
                Generating...
              </>
            ) : (
              "Generate PDF"
            )}
          </Button>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: "#ef4444",
            mb: 2,
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              textAlign: "left",
              mb: 2,
              fontWeight: "bold",
            }}
          >
            Are you sure you want to delete this PDF export?
          </Typography>
          <Typography>This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleting}
            sx={{
              minWidth: "100px",
              position: "relative",
            }}
          >
            {deleting ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={20} color="inherit" />
              </Box>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Regenerate PDF Dialog */}
      <Dialog
        open={regenerateDialogOpen}
        onClose={() => !regenerating && setRegenerateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: "#f97316",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {regenerating ? "Regenerating PDF..." : "Confirm Regenerate PDF"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {regenerating ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
              <CircularProgress size={24} />
              <Typography>Exporting PDF, please wait...</Typography>
            </Box>
          ) : (
            <Typography>
              Are you sure you want to regenerate this PDF? This will create a
              new version of the document.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          {!regenerating && (
            <>
              <Button
                onClick={() => setRegenerateDialogOpen(false)}
                disabled={regenerating}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleRegenerateConfirm}
                disabled={regenerating}
                color="warning"
              >
                Regenerate
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handlePreviewClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, bgcolor: "background.paper" }}>
          <IconButton
            aria-label="close"
            onClick={handlePreviewClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.error.main,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {previewImage && (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "black",
              }}
            >
              <Image
                src={previewImage}
                alt="Preview"
                fill
                style={{
                  objectFit: "contain",
                }}
                sizes="100vw"
                priority
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Feedback Snackbar */}
      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
};

export default ScopeSheetExport;
