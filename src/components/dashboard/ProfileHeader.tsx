import React from "react";
import { Box, Typography } from "@mui/material";
import { UserData } from "../../../app/types/user";
import ChangeAvatar from "../../../app/components/ChangeAvatar";
import { formatDate } from "../../utils/formatters";

interface ProfileHeaderProps {
  user: UserData;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "flex-start" },
          justifyContent: "space-between",
          textAlign: { xs: "center", md: "left" },
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "center", md: "flex-start" },
            mb: { xs: 2, md: 0 },
          }}
        >
          <ChangeAvatar />
          <Box
            sx={{
              ml: { xs: 0, md: 2 },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontSize: {
                  xs: "1.2rem",
                  sm: "1.5rem",
                  md: "1.75rem",
                  lg: "2rem",
                },
                fontWeight: "bold",
              }}
            >{`${user.name} ${user.last_name}`}</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {user.user_role}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            alignSelf: { xs: "center", md: "flex-end" },
            mt: { xs: 2, md: 0 },
            textAlign: { xs: "center", md: "right" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="caption" color="textSecondary">
            UUID:{" "}
            <Typography variant="caption" sx={{ fontWeight: "bold" }}>
              {user.uuid}
            </Typography>
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Register Date:{" "}
            <Typography variant="caption" sx={{ fontWeight: "bold" }}>
              {formatDate(user.created_at)}
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileHeader;
