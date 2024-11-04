import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Share as ShareIcon,
  ContentCopy as ContentCopyIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";
import RestoreIcon from "@mui/icons-material/Restore";
import { ClaimsData } from "../../../../app/types/claims";
import { ClaimAgreementData } from "../../../../app/types/claim-agreement";
import useFormSnackbar from "../../../hooks/useFormSnackbar";

interface AgreementTabProps {
  claim: ClaimsData;
  claimAgreements: ClaimAgreementData[];
  onCreateAgreement: (agreementData: ClaimAgreementData) => Promise<void>;
  onUpdateAgreement: (
    uuid: string,
    agreementData: ClaimAgreementData
  ) => Promise<void>;
  onDeleteAgreement: (uuid: string) => Promise<void>;
}

const AgreementTab: React.FC<AgreementTabProps> = ({
  claim,
  claimAgreements,
  onCreateAgreement,
  onUpdateAgreement,
  onDeleteAgreement,
}) => {
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [agreementToRestore, setAgreementToRestore] =
    useState<ClaimAgreementData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { snackbar, setSnackbar, handleSnackbarClose } = useFormSnackbar();
  const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAgreement, setSelectedAgreement] =
    useState<ClaimAgreementData | null>(null);

  const filteredAgreements = useMemo(() => {
    if (!claim?.uuid || !claimAgreements) return [];
    return claimAgreements.filter(
      (agreement) => agreement.claim_id === claim.id
    );
  }, [claim, claimAgreements]);

  // Función para verificar si el documento está exportado
  const isDocumentExported = (agreement: ClaimAgreementData): boolean => {
    return !!agreement.full_pdf_path;
  };

  const handleDownload = (url: string | undefined) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handleShareClick = (
    event: React.MouseEvent<HTMLElement>,
    agreement: ClaimAgreementData
  ) => {
    setShareAnchorEl(event.currentTarget);
    setSelectedAgreement(agreement);
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
    setSelectedAgreement(null);
  };

  const handleCopyLink = () => {
    if (selectedAgreement?.full_pdf_path) {
      navigator.clipboard
        .writeText(selectedAgreement.full_pdf_path)
        .then(() => {
          setSnackbar({
            open: true,
            message: "Link copied to clipboard",
            severity: "success",
          });
        })
        .catch(() => {
          setSnackbar({
            open: true,
            message: "Failed to copy link",
            severity: "error",
          });
        });
    }
    handleShareClose();
  };

  const handleEmailShare = () => {
    if (selectedAgreement?.full_pdf_path) {
      window.location.href = `mailto:?subject=Agreement Share&body=${encodeURIComponent(
        selectedAgreement.full_pdf_path
      )}`;
    }
    handleShareClose();
  };

  const handleWhatsAppShare = () => {
    if (selectedAgreement?.full_pdf_path) {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(
          selectedAgreement.full_pdf_path
        )}`,
        "_blank"
      );
    }
    handleShareClose();
  };

  const handleRestoreClick = (agreement: ClaimAgreementData) => {
    setAgreementToRestore(agreement);
    setRestoreDialogOpen(true);
  };

  const handleRestoreConfirm = async () => {
    if (claim.uuid && agreementToRestore?.uuid) {
      setIsSubmitting(true);
      try {
        const agreementData = {
          claim_uuid: claim.uuid,
        } as ClaimAgreementData;

        await onUpdateAgreement(agreementToRestore.uuid, agreementData);

        setSnackbar({
          open: true,
          message: "Agreement regenerated successfully",
          severity: "success",
        });
        setRestoreDialogOpen(false);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to regenerate agreement",
          severity: "error",
        });
      } finally {
        setIsSubmitting(false);
        setAgreementToRestore(null);
      }
    }
  };

  const getCustomersString = (customers: any[]) => {
    return customers
      .map((customer) => `${customer.name} ${customer.last_name}`)
      .join(" - ");
  };

  // Renderizar los botones según el estado del documento
  const renderActionButtons = (agreement: ClaimAgreementData) => {
    const exported = isDocumentExported(agreement);

    if (!exported) {
      return (
        <Tooltip title="Document needs to be regenerated">
          <Button
            variant="contained"
            color="warning"
            onClick={() => handleRestoreClick(agreement)}
            size="small"
            startIcon={<RestoreIcon />}
          >
            Regenerate
          </Button>
        </Tooltip>
      );
    }

    return (
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Tooltip title="Download">
          <IconButton
            color="primary"
            onClick={() => handleDownload(agreement.full_pdf_path)}
            size="small"
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Regenerate">
          <IconButton
            color="warning"
            onClick={() => handleRestoreClick(agreement)}
            size="small"
          >
            <RestoreIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Share">
          <IconButton
            color="info"
            onClick={(e) => handleShareClick(e, agreement)}
            size="small"
          >
            <ShareIcon />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  if (!claim?.uuid) {
    return (
      <Box>
        <Typography variant="body1" color="error">
          No claim information available
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: "#662401" }}>
        Customer Agreements
      </Typography>

      {claim?.customers && claim.customers.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="subtitle1"
            color="primary"
            sx={{ fontWeight: "bold" }}
          >
            {getCustomersString(claim.customers)}
          </Typography>

          <Grid container spacing={2}>
            {filteredAgreements.length > 0 ? (
              filteredAgreements.map((agreement) => (
                <Grid item xs={12} key={agreement.uuid || "temp-key"}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                      },
                    }}
                  >
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">
                          {agreement.agreement_type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Generated by: {agreement.generated_by || "N/A"}
                        </Typography>
                        {!isDocumentExported(agreement) && (
                          <Typography
                            variant="body2"
                            color="error"
                            sx={{ mt: 1 }}
                          >
                            Document not available - Needs to be regenerated
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          {renderActionButtons(agreement)}
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary">
                  No agreements found for this claim
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* Share Menu */}
      <Menu
        anchorEl={shareAnchorEl}
        open={Boolean(shareAnchorEl)}
        onClose={handleShareClose}
      >
        <MenuItem onClick={handleCopyLink}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy Link</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEmailShare}>
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share via Email</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleWhatsAppShare}>
          <ListItemIcon>
            <WhatsAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share via WhatsApp</ListItemText>
        </MenuItem>
      </Menu>

      {/* Restore Dialog */}
      <Dialog
        open={restoreDialogOpen}
        onClose={() => setRestoreDialogOpen(false)}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#16a34a",
            mb: 5,
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Confirm Regenerate Agreement
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
            Are you sure you want to regenerate this agreement?
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              textAlign: "left",
              mb: 2,
            }}
          >
            Agreement Type:
            <span style={{ fontWeight: "bold", marginLeft: 10 }}>
              {agreementToRestore?.agreement_type}
            </span>
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              textAlign: "left",
            }}
          >
            Generated By:
            <span style={{ fontWeight: "bold", marginLeft: 10 }}>
              {agreementToRestore?.generated_by || "N/A"}
            </span>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestoreDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleRestoreConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Regenerating...
              </>
            ) : (
              "Regenerate"
            )}
          </Button>
        </DialogActions>
      </Dialog>

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

export default AgreementTab;
