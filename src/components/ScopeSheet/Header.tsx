import React, { useMemo } from 'react';
import { Box, Typography, Button, Divider, useTheme, useMediaQuery } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import type { ScopeSheetData } from '../../../app/types/scope-sheet';
import { formatPropertyAddress, renderCustomers } from '../../utils/formattersCustomerProperty';

interface HeaderProps {
  scopeSheet: ScopeSheetData;
  onGeneratePDF: () => void;
  onShare: () => void;
  onEdit: () => void;
}

const Header = ({ scopeSheet, onGeneratePDF, onShare, onEdit }: HeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formattedAddress = useMemo(() => formatPropertyAddress(scopeSheet.claim?.property), [scopeSheet.claim?.property]);
  const formattedCustomers = useMemo(() => renderCustomers(scopeSheet.claim?.customers ?? undefined), [scopeSheet.claim?.customers]);
  const formattedDate = useMemo(() => 
    scopeSheet.created_at ? new Date(scopeSheet.created_at).toLocaleDateString() : "N/A"
  , [scopeSheet.created_at]);

  return (
    <>
      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: "space-between", 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        mb: 3,
        gap: 2
      }}>
        <Box>
          <Typography variant="h5" component="h5" sx={{ color: "#662401", fontWeight: "bold", mb: 3 }}>
            🏷️ SCOPE SHEET
            <Typography variant="h6" component="span" sx={{ color: "#662401" }}>
              / Claim #{scopeSheet.claim_id ?? "N/A"}
            </Typography>
          </Typography>

          <Typography variant="body2" sx={{ mb: 2 }}>
            Property: <span style={{ fontWeight: "bold" }}>{formattedAddress}</span>
          </Typography>

          <Typography variant="body2" sx={{ mb: 2 }}>
            Customers: <span style={{ fontWeight: "bold" }}>{formattedCustomers}</span>
          </Typography>

          {scopeSheet.scope_sheet_description && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Description: <span style={{ fontWeight: "bold" }}>{scopeSheet.scope_sheet_description}</span>
            </Typography>
          )}

          <Typography variant="body2" sx={{ mb: 2 }}>
            Created: <span style={{ fontWeight: "bold" }}>
              {formattedDate}
            </span>
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: "flex", 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1,
          minWidth: { sm: '380px' }
        }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<ArticleIcon />} 
            onClick={onGeneratePDF}
            fullWidth={isMobile}
          >
            Generate PDF
          </Button>
          <Button
            variant="contained"
            sx={{ 
              backgroundColor: "#1d4ed8", 
              "&:hover": { backgroundColor: "#1e40af" },
              flex: { xs: '1', sm: 'auto' }
            }}
            startIcon={<ShareIcon />}
            onClick={onShare}
            fullWidth={isMobile}
          >
            Share This Scope
          </Button>
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
