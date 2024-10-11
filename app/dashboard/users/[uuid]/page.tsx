// src/app/users/[uuid]/page.tsx

"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUser } from "../../../lib/actions/usersActions";
import { UserData } from "../../../types/user";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dynamic from "next/dynamic";
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

// Dynamic import of GoogleMapComponent
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
}

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

  const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
    <Box display="flex" alignItems="center" my={1}>
      <Typography variant="body1" component="span" mr={1}>
        {label}:
      </Typography>
      <Typography variant="body1" component="span" fontWeight="bold">
        {value?.toString() ?? "N/A"}
      </Typography>
    </Box>
  );

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
        mt: 2,
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
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 5 }}>
        User Details
      </Typography>
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
        <DetailRow label="Zip Code" value={user.zip_code} />
        <DetailRow label="Address" value={user.address} />
        <DetailRow label="City" value={user.city} />
        <DetailRow label="Country" value={user.country} />
        <DetailRow label="Register Date" value={user.created_at} />
        <DetailRow label="Delete Date" value={user.deleted_at} />
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

export default withRoleProtection(UserPage, ["Super Admin", "Admin"]);
