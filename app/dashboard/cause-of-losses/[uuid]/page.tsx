"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CauseOfLossData } from "../../../../app/types/cause-of-loss";
import { getCauseOfLoss } from "../../../lib/actions/causeOfLossActions";
import {
  Typography,
  Paper,
  Avatar,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useSession } from "next-auth/react";
import DetailsSkeleton from "../../../../src/components/skeletons/DetailsSkeleton";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import { PERMISSIONS } from "../../../../src/config/permissions";
import TypographyHeading from "../../../../app/components/TypographyHeading";
interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
}

const CauseOfLossPage = () => {
  const { uuid } = useParams();
  const [causeOfLoss, setCauseOfLoss] = useState<CauseOfLossData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchCauseOfLoss = async () => {
      try {
        const token = session?.accessToken as string;
        const data = await getCauseOfLoss(token, uuid as string);
        setCauseOfLoss(data);
        setLoading(false);
      } catch (err) {
        setError("No cause of loss found");
        setLoading(false);
      }
    };

    fetchCauseOfLoss();
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

  if (loading) {
    return <DetailsSkeleton />;
  }

  if (error || !causeOfLoss) {
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
          {error || "No cause of loss found"}
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
      <TypographyHeading> Cause of Loss Details</TypographyHeading>

      <Paper
        elevation={3}
        style={{
          padding: "20px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          marginBottom: "20px",
        }}
      >
        <IconButton
          size="large"
          edge="end"
          aria-label="cause of loss"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar
            sx={{
              width: 50,
              height: 50,
              bgcolor: "#FEF2F2",
              color: "#DC2626",
            }}
          >
            <ErrorOutlineIcon />
          </Avatar>
        </IconButton>
        <Typography variant="h6" gutterBottom>
          {causeOfLoss.cause_loss_name}
        </Typography>
        <DetailRow label="Name" value={causeOfLoss.cause_loss_name} />
        <DetailRow label="Description" value={causeOfLoss.description} />
      </Paper>
    </Box>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

export default withRoleProtection(CauseOfLossPage, protectionConfig);
