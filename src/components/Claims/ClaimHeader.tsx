import React from "react";
import { Box, Typography, Button, useMediaQuery, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import { ClaimsData } from "../../../app/types/claims";
import Link from "next/link";

interface ClaimDetailsProps {
  claim: ClaimsData | null;
}

const ClaimHeader: React.FC<ClaimDetailsProps> = ({ claim }) => {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

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
          startIcon={<DescriptionIcon />}
          size={isMdDown ? "small" : "medium"}
        >
          Scope Sheet
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
  );
};

export default ClaimHeader;
