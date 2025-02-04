import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import ShareIcon from "@mui/icons-material/Share";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import type { ScopeSheetData } from "../../../app/types/scope-sheet";
import {
  formatPropertyAddress,
  renderCustomers,
} from "../../utils/formattersCustomerProperty";
import { useScopeSheetStore } from "../../stores/scope-sheetStore";

interface HeaderProps {
  scopeSheet: ScopeSheetData;
  onEdit: () => void;
}

const Header = ({ scopeSheet, onEdit }: HeaderProps) => {
  const currentScopeSheet = useScopeSheetStore((state) =>
    state.items.find((item) => item.uuid === scopeSheet.uuid)
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const formattedAddress = useMemo(
    () =>
      formatPropertyAddress(
        currentScopeSheet?.claim?.property ?? scopeSheet.claim?.property
      ),
    [currentScopeSheet?.claim?.property, scopeSheet.claim?.property]
  );
  const formattedCustomers = useMemo(
    () =>
      renderCustomers(
        currentScopeSheet?.claim?.customers ??
          scopeSheet.claim?.customers ??
          undefined
      ),
    [currentScopeSheet?.claim?.customers, scopeSheet.claim?.customers]
  );
  const formattedDate = useMemo(
    () =>
      currentScopeSheet?.created_at
        ? new Date(currentScopeSheet.created_at).toLocaleDateString()
        : scopeSheet.created_at
        ? new Date(scopeSheet.created_at).toLocaleDateString()
        : "N/A",
    [currentScopeSheet?.created_at, scopeSheet.created_at]
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    handleClose();
  };

  const handleWhatsAppShare = () => {
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `Check out this scope sheet: ${url}`
    )}`;
    window.open(whatsappUrl, "_blank");
    handleClose();
  };

  const handleEmailShare = () => {
    const url = window.location.href;
    const subject = "Scope Sheet Details";
    const body = `Check out this scope sheet: ${url}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    handleClose();
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          mb: 3,
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            component="h5"
            sx={{ color: "#662401", fontWeight: "bold", mb: 3 }}
          >
            🏷️ SCOPE SHEET
            <Typography variant="h6" component="span" sx={{ color: "#662401" }}>
              / Claim #{scopeSheet.claim?.claim_internal_id ?? "N/A"}
            </Typography>
          </Typography>

          <Typography variant="body2" sx={{ mb: 2 }}>
            Property:{" "}
            <span style={{ fontWeight: "bold" }}>{formattedAddress}</span>
          </Typography>

          <Typography variant="body2" sx={{ mb: 2 }}>
            Customers:{" "}
            <span style={{ fontWeight: "bold" }}>{formattedCustomers}</span>
          </Typography>

          {(currentScopeSheet?.scope_sheet_description ||
            scopeSheet.scope_sheet_description) && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Description:{" "}
              <span style={{ fontWeight: "bold" }}>
                {currentScopeSheet?.scope_sheet_description ||
                  scopeSheet.scope_sheet_description}
              </span>
            </Typography>
          )}

          <Typography variant="body2" sx={{ mb: 2 }}>
            Created: <span style={{ fontWeight: "bold" }}>{formattedDate}</span>
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1,
            minWidth: { sm: "380px" },
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#5b21b6",
              "&:hover": { backgroundColor: "#4c1d95" },
              flex: { xs: "1", sm: "auto" },
            }}
            startIcon={<ArticleIcon />}
            onClick={() =>
              window.open(
                `/dashboard/claim/${scopeSheet.claim?.uuid}`,
                "_blank"
              )
            }
            fullWidth={isMobile}
          >
            View Claim
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1d4ed8",
              "&:hover": { backgroundColor: "#1e40af" },
              flex: { xs: "1", sm: "auto" },
            }}
            startIcon={<ShareIcon />}
            onClick={handleShareClick}
            fullWidth={isMobile}
            aria-controls={open ? "share-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            Share This Scope
          </Button>
          <Menu
            id="share-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "share-button",
            }}
          >
            <MenuItem onClick={handleCopyLink}>
              <ContentCopyIcon sx={{ mr: 1 }} /> Copy Link
            </MenuItem>
            <MenuItem onClick={handleWhatsAppShare}>
              <WhatsAppIcon sx={{ mr: 1 }} /> Share via WhatsApp
            </MenuItem>
            <MenuItem onClick={handleEmailShare}>
              <EmailIcon sx={{ mr: 1 }} /> Send via Email
            </MenuItem>
          </Menu>
          <Button
            variant="contained"
            color="warning"
            startIcon={<EditIcon />}
            onClick={onEdit}
            fullWidth={isMobile}
          >
            Edit
          </Button>
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />
    </>
  );
};

export default Header;
