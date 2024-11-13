"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { DocumentTemplateAdjusterData } from "../../../../app/types/document-template-adjuster";
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
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import TypographyHeading from "../../../components/TypographyHeading";
import { PERMISSIONS } from "../../../../src/config/permissions";
import FeedbackSnackbar from "../../../components/FeedbackSnackbar";
import { useDocumentTemplateAdjusters } from "../../../../src/hooks/useDocumentTemplateAdjuster";

interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
}

const DocumentTemplateAdjusterPage = () => {
  const { uuid } = useParams();
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { documentTemplateAdjusters, loading, error } =
    useDocumentTemplateAdjusters(token);
  const { snackbar, setSnackbar, handleSnackbarClose } = useFormSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);

  // Encontrar el template actual en el estado global
  const documentTemplate = documentTemplateAdjusters.find(
    (template) => template.uuid === uuid
  );

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
    if (!documentTemplate?.template_path_adjuster) return;

    try {
      setIsLoading(true);
      window.open(documentTemplate.template_path_adjuster.toString(), "_blank");
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to download template",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  const handleCopyLink = async () => {
    if (!documentTemplate?.template_path_adjuster) return;

    try {
      await navigator.clipboard.writeText(
        documentTemplate.template_path_adjuster.toString()
      );
      setSnackbar({
        open: true,
        message: "Link copied to clipboard",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to copy link",
        severity: "error",
      });
    }
    handleShareClose();
  };

  const handleEmailShare = () => {
    if (!documentTemplate?.template_path_adjuster) return;

    try {
      window.location.href = `mailto:?subject=Document Template Share&body=${encodeURIComponent(
        documentTemplate.template_path_adjuster.toString()
      )}`;
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to share via email",
        severity: "error",
      });
    }
    handleShareClose();
  };

  const handleWhatsAppShare = () => {
    if (!documentTemplate?.template_path_adjuster) return;

    try {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(
          documentTemplate.template_path_adjuster.toString()
        )}`,
        "_blank"
      );
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to share via WhatsApp",
        severity: "error",
      });
    }
    handleShareClose();
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
          {error || "No document template adjuster found"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "hidden",
        mb: 10,
        p: { xs: 1, lg: 2 },
      }}
    >
      <TypographyHeading>Document Template Adjuster Details</TypographyHeading>

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
            aria-label="document template adjuster"
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
              {documentTemplate.template_description_adjuster}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Type: {documentTemplate.template_type_adjuster}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
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
          value={documentTemplate.template_description_adjuster}
        />
        <DetailRow label="Public Adjuster" value={documentTemplate.adjuster} />
        <DetailRow label="Uploaded By" value={documentTemplate.uploaded_by} />
        <DetailRow
          label="Created At"
          value={
            documentTemplate.created_at
              ? new Date(documentTemplate.created_at).toLocaleDateString()
              : "N/A"
          }
        />
        <DetailRow
          label="Updated At"
          value={
            documentTemplate.updated_at
              ? new Date(documentTemplate.updated_at).toLocaleDateString()
              : "N/A"
          }
        />
        <DetailRow label="UUID" value={documentTemplate.uuid} />
      </Paper>

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

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_DOCUMENTS],
};

export default withRoleProtection(
  DocumentTemplateAdjusterPage,
  protectionConfig
);
