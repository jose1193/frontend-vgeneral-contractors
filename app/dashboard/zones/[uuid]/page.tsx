"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Typography,
  Paper,
  Avatar,
  IconButton,
  Box,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GridViewIcon from "@mui/icons-material/GridView";
import DetailsSkeleton from "../../../../src/components/skeletons/DetailsSkeleton";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import TypographyHeading from "../../../components/TypographyHeading";
import { PERMISSIONS } from "../../../../src/config/permissions";
import { useZones } from "../../../../src/hooks/useZones";

interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
}

const ZoneDetailPage = () => {
  const { uuid } = useParams();
  const { data: session } = useSession();
  const {
    getZone,
    currentZone: zone,
    loading,
    error,
  } = useZones(session?.accessToken as string);

  React.useEffect(() => {
    if (uuid && session?.accessToken) {
      getZone(uuid as string);
    }
  }, [uuid, session?.accessToken, getZone]);

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

  if (error || !zone) {
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
          {error || "No zone found"}
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
      <TypographyHeading>Zone Details</TypographyHeading>

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
            edge="end"
            aria-label="zone"
            aria-haspopup="true"
            color="inherit"
          >
            <Avatar
              alt="Zone"
              sx={{
                width: 50,
                height: 50,
                bgcolor: "#EBF4FF",
                color: "#7F9CF5",
              }}
            >
              <GridViewIcon />
            </Avatar>
          </IconButton>
          <Box ml={2}>
            <Typography variant="h6" gutterBottom>
              {zone.zone_name}
            </Typography>
            <Chip
              label={
                zone.zone_type.charAt(0).toUpperCase() + zone.zone_type.slice(1)
              }
              color={zone.zone_type === "exterior" ? "primary" : "default"}
              size="small"
              sx={{ mr: 1 }}
            />
            <Chip
              label={zone.deleted_at ? "Deleted" : "Active"}
              color={zone.deleted_at ? "error" : "success"}
              size="small"
            />
          </Box>
        </Box>

        <DetailRow label="Code" value={zone.code} />
        <DetailRow label="Description" value={zone.description} />
        <DetailRow
          label="Status"
          value={zone.deleted_at ? "Deleted" : "Active"}
        />

        <Divider sx={{ my: 2 }} />

        {/* Creator Information */}
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Created By
          </Typography>
          <DetailRow
            label="Name"
            value={`${zone.created_by_user.name} ${zone.created_by_user.last_name}`}
          />
          <DetailRow label="Email" value={zone.created_by_user.email} />
          <DetailRow
            label="Created At"
            value={
              zone.created_at
                ? new Date(zone.created_at).toLocaleDateString()
                : null
            }
          />
          <DetailRow
            label="Last Updated"
            value={
              zone.updated_at
                ? new Date(zone.updated_at).toLocaleDateString()
                : null
            }
          />
          {zone.deleted_at && (
            <DetailRow
              label="Deleted At"
              value={new Date(zone.deleted_at).toLocaleDateString()}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

export default withRoleProtection(ZoneDetailPage, protectionConfig);
