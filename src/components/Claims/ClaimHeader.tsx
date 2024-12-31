import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import { ClaimsData } from "../../../app/types/claims";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useScopeSheetSync } from "../../hooks/ScopeSheet/useScopeSheetSync";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";

interface ClaimDetailsProps {
  claim: ClaimsData | null;
  token: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

const ClaimHeader: React.FC<ClaimDetailsProps> = ({ claim, token }) => {
  const theme = useTheme();
  const router = useRouter();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
  const [scopeSheetOpen, setScopeSheetOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleCreate } = useScopeSheetSync(token);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleScopeSheetSubmit = async () => {
    if (!claim?.uuid) return;

    setIsSubmitting(true);
    try {
      const scopeSheetData = {
        claim_uuid: claim.uuid,
        scope_sheet_description: description.trim() || undefined,
      };

      const newScopeSheet = await handleCreate(scopeSheetData);
      if (newScopeSheet?.uuid) {
        setScopeSheetOpen(false);
        setSnackbar({
          open: true,
          message: "Scope sheet created successfully!",
          severity: "success",
        });
        router.push(`/scope-sheet/${newScopeSheet.uuid}`);
      }
    } catch (error) {
      console.error("Error creating scope sheet:", error);
      setSnackbar({
        open: true,
        message: "Error creating scope sheet. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScopeSheetClick = () => {
    if (claim?.scope_sheet?.uuid) {
      router.push(`/dashboard/scope-sheets/${claim.scope_sheet.uuid}`);
    } else {
      setScopeSheetOpen(true);
    }
  };

  if (!claim) {
    return (
      <Paper elevation={3} sx={{ p: 5, mb: 7 }}>
        <Typography variant="h6" sx={{ color: "#662401" }}>
          Loading...
        </Typography>
      </Paper>
    );
  }

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          mb: 5,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{
            flexGrow: 1,
            fontSize: {
              xs: "1.5rem",
              sm: "1.75rem",
              md: "2rem",
              lg: "2.25rem",
            },
            fontWeight: "bold",
            mb: { xs: 2, md: 0 },
          }}
        >
          Claim
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            fullWidth={isMdDown}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <DescriptionIcon />
              )
            }
            size={isMdDown ? "small" : "medium"}
            onClick={handleScopeSheetClick}
            disabled={isSubmitting}
          >
            {claim?.scope_sheet ? "Scope Sheet" : "Create Scope Sheet"}
          </Button>
          <Link href={`/dashboard/claims/${claim.uuid}/edit`} passHref>
            <Button
              variant="contained"
              color="warning"
              fullWidth={isMdDown}
              startIcon={<EditIcon />}
              size={isMdDown ? "small" : "medium"}
            >
              Edit
            </Button>
          </Link>
          <Button
            variant="contained"
            fullWidth={isMdDown}
            sx={{
              backgroundColor: "#1d4ed8",
              "&:hover": {
                backgroundColor: "#1e40af",
              },
            }}
            startIcon={<ShareIcon />}
            size={isMdDown ? "small" : "medium"}
          >
            Share this claim
          </Button>
        </Box>
      </Box>

      <Dialog
        open={scopeSheetOpen}
        onClose={() => setScopeSheetOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: "#171717",
            mb: 5,
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Create New Scope Sheet
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Claim Internal ID:{" "}
              <span style={{ fontWeight: "bold" }}>
                {claim.claim_internal_id}
              </span>
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Description (Optional)"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setScopeSheetOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleScopeSheetSubmit}
            disabled={isSubmitting}
            variant="contained"
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </React.Fragment>
  );
};

export default ClaimHeader;
