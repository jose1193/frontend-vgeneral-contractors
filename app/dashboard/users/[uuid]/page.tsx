"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUser } from "../../../lib/actions/usersActions";
import { UserData } from "../../../types/user";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dynamic from "next/dynamic";
import TypographyHeading from "../../../components/TypographyHeading";
import { PERMISSIONS } from "../../../../src/config/permissions";
import {
  Typography,
  Paper,
  Avatar,
  IconButton,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { useSession } from "next-auth/react";

const GoogleMapComponent = dynamic(
  () => import("../../../../src/components/GoogleMap"),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  }
);

interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
  type?: "phone" | "default";
}

const formatPhoneNumber = (
  phone: string | number | null | undefined
): string => {
  if (!phone) return "N/A";

  // Convert to string and remove all non-digits
  const cleaned = phone.toString().replace(/\D/g, "");

  // Check if it's a US number (10 digits or 11 digits starting with 1)
  const isUSNumber =
    cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith("1"));

  if (isUSNumber) {
    // If it starts with 1, remove it
    const digits = cleaned.startsWith("1") ? cleaned.slice(1) : cleaned;
    // Format as (XXX) - XXX-XXXX
    const areaCode = digits.slice(0, 3);
    const firstPart = digits.slice(3, 6);
    const secondPart = digits.slice(6, 10);
    return `(${areaCode}) - ${firstPart}-${secondPart}`;
  } else {
    // For international numbers, just add + prefix
    return `+${cleaned}`;
  }
};

const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  type = "default",
}) => (
  <Box display="flex" alignItems="center" my={1}>
    <Typography variant="body1" component="span" mr={1}>
      {label}:
    </Typography>
    <Typography variant="body1" component="span" fontWeight="bold">
      {type === "phone" ? formatPhoneNumber(value) : value?.toString() ?? "N/A"}
    </Typography>
  </Box>
);

const UserPage = () => {
  const { uuid } = useParams();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [mapCoordinates, setMapCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!session?.accessToken || !uuid) {
          throw new Error("Missing access token or user ID");
        }
        const token = session.accessToken as string;
        const data = await getUser(token, uuid as string);
        setUser(data);
        if (data.latitude && data.longitude) {
          setMapCoordinates({
            lat: Number(data.latitude),
            lng: Number(data.longitude),
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [uuid, session?.accessToken]);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!user) return <Typography>User not found</Typography>;

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "hidden",
        mb: 10,
        p: { xs: 1, lg: 2 },
      }}
    >
      <TypographyHeading>User Details</TypographyHeading>
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
          aria-label="account of current user"
          aria-haspopup="true"
          color="inherit"
        >
          {user.profile_photo_path ? (
            <Avatar
              alt={user.name || "User"}
              src={user.profile_photo_path}
              sx={{ width: 50, height: 50 }}
            />
          ) : (
            <Avatar
              alt={user.name || "User"}
              sx={{
                width: 50,
                height: 50,
                bgcolor: "#EBF4FF",
                color: "#7F9CF5",
              }}
            >
              {user.name ? user.name[0].toUpperCase() : "U"}
            </Avatar>
          )}
        </IconButton>
        <Typography variant="h6" gutterBottom>{`${user.name || ""} ${
          user.last_name || ""
        }`}</Typography>
        <DetailRow label="Role" value={user.user_role} />
        <DetailRow label="Email" value={user.email} />
        <DetailRow label="Username" value={user.username} />
        <DetailRow label="Cell Phone" value={user.phone} type="phone" />
        <DetailRow label="Zip Code" value={user.zip_code} />
        <DetailRow label="Address" value={user.address} />
        <DetailRow label="City" value={user.city} />
        <DetailRow label="Country" value={user.country} />
        <DetailRow label="Register Date" value={user.created_at} />
        <DetailRow label="Suspend Date" value={user.deleted_at} />
      </Paper>
      {mapCoordinates ? (
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Typography variant="h6" gutterBottom>
            User Location
          </Typography>
          <Box height={400} width="100%" position="relative">
            <GoogleMapComponent
              latitude={mapCoordinates.lat}
              longitude={mapCoordinates.lng}
            />
          </Box>
        </Paper>
      ) : (
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Typography variant="body1">No location data available</Typography>
        </Paper>
      )}
    </Box>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

export default withRoleProtection(UserPage, protectionConfig);
