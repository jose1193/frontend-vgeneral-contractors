import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  FileUpload as FileUploadIcon,
  FileDownload as FileDownloadIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { useDocuSignConnection } from "../../hooks/useDocuSign";
import { ClaimsData } from "../../../app/types/claims";
import {
  DocusignSignDTO,
  DocusignImportDTO,
} from "../../../app/types/docusign";
import { useSession } from "next-auth/react";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface DocusignFormTabProps {
  claim: ClaimsData;
  onDocumentSigned: () => void;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`docusign-tabpanel-${index}`}
      aria-labelledby={`docusign-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const DocusignFormTab: React.FC<DocusignFormTabProps> = ({
  claim,
  onDocumentSigned,
}) => {
  const [value, setValue] = useState(0);
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const {
    signDocument,
    toSignature,
    importDocument,
    error: docuSignError,
  } = useDocuSignConnection(token);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogOpenForSignature, setConfirmDialogOpenForSignature] =
    useState(false);
  const [confirmDialogOpenForImport, setConfirmDialogOpenForImport] =
    useState(false);

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOpenConfirmDialog = () => {
    if (!claim.uuid) {
      setSnackbar({
        open: true,
        message: "Claim UUID is required",
        severity: "error",
      });
      return;
    }
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  const handleOpenConfirmDialogForSignature = () => {
    if (!claim.uuid) {
      setSnackbar({
        open: true,
        message: "Claim UUID is required",
        severity: "error",
      });
      return;
    }
    setConfirmDialogOpenForSignature(true);
  };

  const handleCloseConfirmDialogForSignature = () => {
    setConfirmDialogOpenForSignature(false);
  };

  const handleCloseImportDialog = () => {
    setConfirmDialogOpenForImport(false);
    setSelectedFile(null);
  };

  const handleExportWithSignature = async () => {
    setIsSubmitting(true);
    try {
      if (!claim.uuid) {
        throw new Error("Claim UUID is required");
      }

      const signData: DocusignSignDTO = {
        claim_uuid: claim.uuid,
      };

      const response = await signDocument(signData);

      if (response?.data?.envelope_id) {
        setSnackbar({
          open: true,
          message: "Document sent for signing successfully",
          severity: "success",
        });
        handleCloseConfirmDialog();
        onDocumentSigned();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error signing document",
        severity: "error",
      });
      setError("Error signing document");
      console.error("Error signing document:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomerSignature = async () => {
    setIsSubmitting(true);
    try {
      if (!claim.uuid) {
        throw new Error("Claim UUID is required");
      }

      const signData: DocusignSignDTO = {
        claim_uuid: claim.uuid,
      };

      const response = await toSignature(signData);

      if (response?.data?.envelope_id) {
        setSnackbar({
          open: true,
          message: "Document sent for customer signature successfully",
          severity: "success",
        });
        handleCloseConfirmDialogForSignature();
        onDocumentSigned();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error sending document for signature",
        severity: "error",
      });
      setError("Error sending document for signature");
      console.error("Error sending document for signature:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !claim.uuid) return;

    setSelectedFile(file);
    setConfirmDialogOpenForImport(true);
  };

  const handleImportFile = async () => {
    if (!selectedFile || !claim.uuid) return;

    setIsSubmitting(true);
    try {
      const importData: DocusignImportDTO = {
        claim_uuid: claim.uuid,
        document: selectedFile,
      };

      const response = await importDocument(importData);

      if (response?.data?.envelope_id) {
        setSnackbar({
          open: true,
          message: "Document imported successfully",
          severity: "success",
        });
        handleCloseImportDialog();
        onDocumentSigned();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error importing document",
        severity: "error",
      });
      setError("Error importing document");
      console.error("Error importing document:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = error || docuSignError;

  return (
    <Paper elevation={0} sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="docusign tabs"
          variant="fullWidth"
        >
          <Tab
            icon={<FileDownloadIcon />}
            iconPosition="start"
            label="Export With Signature"
          />
          <Tab
            icon={<FileUploadIcon />}
            iconPosition="start"
            label="Import File"
          />
          <Tab
            icon={<AssignmentIcon />}
            iconPosition="start"
            label="Send for Customer Signature"
          />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h6">Export Agreement Certificate</Typography>
          <Typography color="text.secondary" align="center">
            Export your agreement with digital signatures and certification
          </Typography>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={handleOpenConfirmDialog}
            disabled={loading || !claim.uuid}
            sx={{ mt: 2 }}
          >
            Export Signed Agreement
          </Button>
          {displayError && (
            <Typography color="error" align="center">
              {displayError}
            </Typography>
          )}
        </Stack>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h6">Import Agreement File</Typography>
          <Typography color="text.secondary" align="center">
            Upload your agreement file for processing
          </Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<FileUploadIcon />}
            disabled={isSubmitting || loading}
          >
            Select File
            <input
              type="file"
              hidden
              onChange={handleFileSelect}
              accept=".pdf"
            />
          </Button>
          {selectedFile && (
            <Typography color="text.secondary">
              Selected file: {selectedFile.name}
            </Typography>
          )}
          {displayError && (
            <Typography color="error" align="center">
              {displayError}
            </Typography>
          )}
        </Stack>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h6">Send for Customer Signature</Typography>
          <Typography color="text.secondary" align="center">
            Send the agreement for customer digital signature
          </Typography>
          <Button
            variant="contained"
            startIcon={<AssignmentIcon />}
            onClick={handleOpenConfirmDialogForSignature}
            disabled={loading || !claim.uuid}
            sx={{ mt: 2 }}
          >
            Send for Signature
          </Button>
          {displayError && (
            <Typography color="error" align="center">
              {displayError}
            </Typography>
          )}
        </Stack>
      </TabPanel>

      {/* Diálogo para firma normal */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            backgroundColor: "#0288d1",
            mb: 5,
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          {"Confirm Export with Signature"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to export this agreement with signature?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="info"
            onClick={handleExportWithSignature}
            disabled={isSubmitting}
            autoFocus
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Processing...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para firma del cliente */}
      <Dialog
        open={confirmDialogOpenForSignature}
        onClose={handleCloseConfirmDialogForSignature}
        aria-labelledby="signature-dialog-title"
        aria-describedby="signature-dialog-description"
      >
        <DialogTitle
          id="signature-dialog-title"
          sx={{
            backgroundColor: "#0288d1",
            mb: 5,
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          {"Confirm Send for Customer Signature"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to send this agreement for customer signature?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialogForSignature}>Cancel</Button>
          <Button
            variant="contained"
            color="info"
            onClick={handleCustomerSignature}
            disabled={isSubmitting}
            autoFocus
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Processing...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para confirmar importación */}
      <Dialog
        open={confirmDialogOpenForImport}
        onClose={handleCloseImportDialog}
        aria-labelledby="import-dialog-title"
        aria-describedby="import-dialog-description"
      >
        <DialogTitle
          id="import-dialog-title"
          sx={{
            backgroundColor: "#0288d1",
            mb: 5,
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          {"Confirm Document Import"}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontWeight: "500" }}>
            Are you sure you want to import this document?
          </Typography>
          {selectedFile && (
            <Typography
              color="text.secondary"
              sx={{ mt: 2, fontWeight: "bold" }}
            >
              File to import: {selectedFile.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImportDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="info"
            onClick={handleImportFile}
            disabled={isSubmitting}
            autoFocus
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Importing...
              </>
            ) : (
              "Confirm Import"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Paper>
  );
};

export default DocusignFormTab;
