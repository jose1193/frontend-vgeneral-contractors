import React, { useState } from "react";
import { Paper, Tabs, Tab, Box, Typography, styled } from "@mui/material";
import {
  Description as DescriptionIcon,
  Receipt as ReceiptIcon,
  Calculate as CalculateIcon,
  Money as MoneyIcon,
  Email as EmailIcon,
  LocalHospital as LocalHospitalIcon,
  Folder as FolderIcon,
  Assignment as AssignmentIcon,
  AssignmentInd as AssignmentIndIcon,
} from "@mui/icons-material";
import { ClaimsData } from "../../../app/types/claims";
import { ClaimAgreementData } from "../../../app/types/claim-agreement";
import AgreementTab from "./AgreementTab/AgreementTab";
import DocusignTab from "./DocusignTab";

interface ClaimTabsProps {
  claim: ClaimsData | null;
  claimAgreements: ClaimAgreementData[];
  onCreateAgreement: (agreementData: ClaimAgreementData) => Promise<void>;
  onUpdateAgreement: (
    uuid: string,
    agreementData: ClaimAgreementData
  ) => Promise<void>;
  onDeleteAgreement: (uuid: string) => Promise<void>;
  userRole?: string;
}

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  "& .MuiTabs-indicator": {
    height: 3,
    borderRadius: "3px 3px 0 0",
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.875rem",
  marginRight: theme.spacing(1),
  color: theme.palette.text.secondary,
  "&.Mui-selected": {
    color: theme.palette.primary.main,
  },
  "& .MuiTab-iconWrapper": {
    marginBottom: "4px",
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`claim-tabpanel-${index}`}
      aria-labelledby={`claim-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const ClaimTabs: React.FC<ClaimTabsProps> = ({
  claim,
  claimAgreements,
  onCreateAgreement,
  onUpdateAgreement,
  onDeleteAgreement,
  userRole,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!claim) {
    return (
      <Paper elevation={3} sx={{ p: 5, mb: 7 }}>
        <Typography variant="h6" sx={{ color: "#662401" }}>
          Loading...
        </Typography>
      </Paper>
    );
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const isDocusignAllowed =
    userRole && ["Super Admin", "Admin", "Manager"].includes(userRole);

  const tabs = [
    {
      label: "Agreement",
      icon: <AssignmentIcon />,
      content: (
        <AgreementTab
          claim={claim}
          claimAgreements={claimAgreements}
          onCreateAgreement={onCreateAgreement}
          onUpdateAgreement={onUpdateAgreement}
          onDeleteAgreement={onDeleteAgreement}
        />
      ),
    },
    ...(isDocusignAllowed
      ? [
          {
            label: "Agreement Full Docusign",
            icon: <AssignmentIndIcon />,
            content: <DocusignTab claim={claim} userRole={userRole} />,
          },
        ]
      : []),
    { label: "Notes", icon: <DescriptionIcon /> },
    { label: "Invoices", icon: <ReceiptIcon /> },
    { label: "Estimates", icon: <CalculateIcon /> },
    { label: "Expenses", icon: <MoneyIcon /> },
    { label: "Emails", icon: <EmailIcon /> },
    { label: "EMS", icon: <LocalHospitalIcon /> },
    { label: "Files", icon: <FolderIcon /> },
  ];

  return (
    <Paper elevation={2} sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <StyledTabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="claim tabs"
          sx={{
            "& .MuiTabs-scrollButtons": {
              display: "flex",
            },
            "& .MuiTabs-flexContainer": {
              gap: 1,
            },
          }}
        >
          {tabs.map((tab, index) => (
            <StyledTab
              key={index}
              icon={tab.icon}
              label={tab.label}
              id={`claim-tab-${index}`}
              aria-controls={`claim-tabpanel-${index}`}
              sx={{
                minHeight: { xs: 48, md: 64 },
                minWidth: { xs: "auto", md: 120 },
                px: { xs: 1, md: 2 },
              }}
            />
          ))}
        </StyledTabs>
      </Box>

      {tabs.map((tab, index) => (
        <TabPanel key={index} value={activeTab} index={index}>
          {tab.content || (
            <Box
              sx={{
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 1,
                minHeight: "200px",
              }}
            >
              <Typography variant="h6" component="h2" gutterBottom>
                {tab.label}
              </Typography>
              <Typography color="text.secondary">
                Content for {tab.label} section
              </Typography>
            </Box>
          )}
        </TabPanel>
      ))}
    </Paper>
  );
};

export default ClaimTabs;
