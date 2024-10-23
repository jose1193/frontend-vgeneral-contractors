"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DocumentTemplateData } from "../../../../app/types/document-template";
import { getData } from "../../../lib/actions/documentTemplateActions";
import {
  Typography,
  Paper,
  IconButton,
  Box,
  Button,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Download as DownloadIcon,
  Share as ShareIcon,
  ContentCopy as ContentCopyIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";
import DescriptionIcon from "@mui/icons-material/Description";
import { useSession } from "next-auth/react";
import DetailsSkeleton from "../../../../src/components/skeletons/DetailsSkeleton";
import useFormSnackbar from "../../../../src/hooks/useFormSnackbar";

interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
}

const DocumentTemplatePage = () => {
  const { uuid } = useParams();
  const [documentTemplate, setDocumentTemplate] =
    useState<DocumentTemplateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const { snackbar, setSnackbar, handleSnackbarClose } = useFormSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  // Share menu state
  const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const fetchDocumentTemplate = async () => {
      try {
        const token = session?.accessToken as string;
        const data = await getData(token, uuid as string);
        setDocumentTemplate(data);
        setLoading(false);
      } catch (err) {
        setError("No document template found");
        setLoading(false);
      }
    };

    fetchDocumentTemplate();
  }, [uuid, session?.accessToken]);

  const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
    <Box display="flex" alignItems="center" my={1}>
      <Typography variant="body1" component="span" mr={1}>
        {label}:
      </Typography>
      <Typography variant="body1" component="span" fontWeight="bold">
        {value ?? "N/A"}
      </Typography>
    </Box>
  );

  const handleDownload = async () => {
    if (documentTemplate?.uuid && session?.accessToken) {
      try {
        setIsLoading(true);
        const template = await getData(
          session.accessToken,
          documentTemplate.uuid
        );

        if (template.template_path) {
          window.open(template.template_path.toString(), "_blank");
        } else {
          throw new Error("No template URL available");
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to download template",
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Y en el botón:
  <Tooltip title="Download template">
    <IconButton
      onClick={handleDownload}
      color="primary"
      disabled={isLoading}
      sx={{
        "&:hover": {
          backgroundColor: "rgba(25, 118, 210, 0.04)",
        },
      }}
    >
      {isLoading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        <DownloadIcon />
      )}
    </IconButton>
  </Tooltip>;
  const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  const handleCopyLink = async () => {
    if (documentTemplate?.uuid && session?.accessToken) {
      try {
        // Asumiendo que template_path contiene la URL del documento
        const template = await getData(
          session.accessToken,
          documentTemplate.uuid
        );

        if (template.template_path) {
          await navigator.clipboard.writeText(
            template.template_path.toString()
          );
          setSnackbar({
            open: true,
            message: "Link copied to clipboard",
            severity: "success",
          });
        } else {
          throw new Error("No template URL available");
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to copy link",
          severity: "error",
        });
      }
      handleShareClose();
    }
  };

  const handleEmailShare = async () => {
    if (documentTemplate?.uuid && session?.accessToken) {
      try {
        const template = await getData(
          session.accessToken,
          documentTemplate.uuid
        );

        if (template.template_path) {
          window.location.href = `mailto:?subject=Document Template Share&body=${encodeURIComponent(
            template.template_path.toString()
          )}`;
        } else {
          throw new Error("No template URL available");
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to share via email",
          severity: "error",
        });
      }
      handleShareClose();
    }
  };

  const handleWhatsAppShare = async () => {
    if (documentTemplate?.uuid && session?.accessToken) {
      try {
        const template = await getData(
          session.accessToken,
          documentTemplate.uuid
        );

        if (template.template_path) {
          window.open(
            `https://wa.me/?text=${encodeURIComponent(
              template.template_path.toString()
            )}`,
            "_blank"
          );
        } else {
          throw new Error("No template URL available");
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to share via WhatsApp",
          severity: "error",
        });
      }
      handleShareClose();
    }
  };

  if (loading) {
    return <DetailsSkeleton />;
  }

  if (error || !documentTemplate) {
    return (
      <Box sx={{ mt: 2, ml: -6, mb: 10, p: { xs: 3, sm: 3, md: 2, lg: 4 } }}>
        <Button
          variant="outlined"
          onClick={() => window.history.back()}
          startIcon={<ArrowBackIcon />}
          style={{ marginBottom: "20px" }}
        >
          Back
        </Button>
        <Typography variant="h6" color="error">
          {error || "No document template found"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "hidden",
        ml: -6,
        mb: 10,
        p: { xs: 3, sm: 3, md: 2, lg: 4 },
      }}
    >
      <Button
        variant="outlined"
        onClick={() => window.history.back()}
        startIcon={<ArrowBackIcon />}
        style={{ marginBottom: "20px" }}
      >
        Back
      </Button>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mb: 5, fontWeight: "bold" }}
      >
        Document Template Details
      </Typography>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          marginBottom: "20px",
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <IconButton
            size="large"
            edge="start"
            aria-label="document template"
            color="inherit"
          >
            <Avatar
              sx={{
                width: 50,
                height: 50,
                bgcolor: "#EBF4FF",
                color: "#7F9CF5",
              }}
            >
              <DescriptionIcon />
            </Avatar>
          </IconButton>
          <Box flex={1} ml={2}>
            <Typography variant="h6" gutterBottom>
              {documentTemplate.template_name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Type: {documentTemplate.template_type}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Download template">
              <IconButton
                onClick={handleDownload}
                color="primary"
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share template">
              <IconButton
                onClick={handleShareClick}
                color="info"
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              >
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <DetailRow
          label="Description"
          value={documentTemplate.template_description}
        />
        <DetailRow
          label="Created At"
          value={new Date(documentTemplate.created_at).toLocaleDateString()}
        />
        <DetailRow
          label="Updated At"
          value={new Date(documentTemplate.updated_at).toLocaleDateString()}
        />
        <DetailRow label="UUID" value={documentTemplate.uuid} />
      </Paper>

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

export default DocumentTemplatePage;
