// src/app/users/[uuid]/page.tsx

"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { getUser } from "../../../lib/actions/usersActions";
import { UserData } from "../../../types/user";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import {
  Container,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Box,
} from "@mui/material";
import { useSession } from "next-auth/react";
interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
}
const UserPage = () => {
  const { uuid } = useParams();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, update } = useSession();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = session?.accessToken as string;
        const data = await getUser(token, uuid as string);
        setUser(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user");
        setLoading(false);
      }
    };

    fetchUser();
  }, [uuid, session?.accessToken]);

  if (!user) {
    return <Typography></Typography>;
  }

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
  if (error) return <div>Error: {error}</div>;

  return (
    <Suspense>
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
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 5 }}>
          User Details
        </Typography>
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
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
          <DetailRow label="Delete Date" value={user.delete_at} />
        </Paper>
      </Box>
    </Suspense>
  );
};
export default withRoleProtection(UserPage, ["Super Admin", "Admin"]);
