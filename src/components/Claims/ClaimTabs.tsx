import React, { useState } from "react";
import {
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ClaimTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const tabLabels = [
    "Notes",
    "Invoices",
    "Estimates",
    "Expenses",
    "Emails",
    "EMS",
    "Files",
    "Agreement",
    "Agreement Full",
  ];

  return (
    <>
      <Paper>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="claim tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            "& .MuiTabs-scrollButtons": {
              display: { xs: "flex", md: "none" },
            },
            "& .MuiTabs-flexContainer": {
              flexWrap: { xs: "nowrap", md: "wrap" },
            },
            "& .MuiTab-root": {
              minWidth: { xs: "auto", md: 120 },
              fontSize: { xs: "0.75rem", md: "0.875rem" },
              padding: { xs: "6px 12px", md: "12px 16px" },
            },
          }}
        >
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
      </Paper>
      <Box sx={{ p: 2 }}>
        {tabLabels.map(
          (label, index) =>
            activeTab === index && (
              <Typography key={index}>{label} content</Typography>
            )
        )}
      </Box>
    </>
  );
};

export default ClaimTabs;
