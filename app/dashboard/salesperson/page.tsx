"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  LinearProgress,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  EmojiEvents as EmojiEventsIcon,
} from "@mui/icons-material";
import Footer from "../../components/Footer";
import { keyframes } from "@emotion/react";

// Define the gradient animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Create a styled Paper component with the animated gradient
const AnimatedPaper = styled(Paper)(({ theme }) => ({
  background: "linear-gradient(45deg, #af40ff, #5b42f3, #ef4444)",
  backgroundSize: "200% 200%",
  animation: `${gradientAnimation} 15s ease infinite`,
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "white",
  borderRadius: theme.shape.borderRadius,
}));

// Updated StyledCard with dynamic border color
const StyledCard = styled(Card)<{ borderColor: string }>(
  ({ theme, borderColor }) => ({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: theme.shape.borderRadius,
      padding: 2,
      background: "linear-gradient(45deg, transparent 0%, transparent 100%)",
      mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      maskComposite: "exclude",
      transition: "all 0.3s ease",
    },
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: theme.shadows[4],
      "&::before": {
        background: borderColor,
      },
    },
  })
);

interface AnimatedNumberProps {
  value: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.replace(/[^0-9]/g, "").substring(0, 3));
    if (start === end) return;

    let timer = setInterval(() => {
      start += 1;
      setDisplayValue(start);
      if (start === end) clearInterval(timer);
    }, 20);

    return () => {
      clearInterval(timer);
    };
  }, [value]);

  return <span>{displayValue}</span>;
};

interface DashboardItemProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}

const DashboardItem: React.FC<DashboardItemProps> = ({
  icon,
  title,
  value,
  color,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <StyledCard borderColor={color}>
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor: color,
              width: isSmallScreen ? 40 : 56,
              height: isSmallScreen ? 40 : 56,
            }}
          >
            {icon}
          </Avatar>
        }
        title={title}
      />
      <CardContent>
        <Typography variant={isSmallScreen ? "h5" : "h4"} component="div">
          <AnimatedNumber value={value} />
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default function VendorDashboard() {
  const { data: session, status } = useSession();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (status === "loading") {
    return <LinearProgress />;
  }

  if (status === "unauthenticated") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">
          Please log in to access the dashboard
        </Typography>
      </Box>
    );
  }
  const getInitials = (name: string): string => {
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getFullName = (): string => {
    const firstName = session?.user?.name || "User";
    const lastName = session?.user?.last_name || "";
    return `${firstName} ${lastName}`.trim();
  };
  const user = {
    name: getFullName(),
    role: session?.user?.user_role || "Roofing Specialist",
    avatar:
      session?.user?.profile_photo_path ||
      "/placeholder.svg?height=128&width=128",
  };

  return (
    <Suspense>
      <Box sx={{ flexGrow: 1, p: 5, ml: -8 }}>
        <Grid container spacing={3}>
          {/* Welcome Section with Animated Gradient */}
          <Grid item xs={12}>
            <AnimatedPaper>
              {user.avatar ? (
                <Avatar
                  src={user.avatar}
                  sx={{
                    width: isSmallScreen ? 80 : 100,
                    height: isSmallScreen ? 80 : 100,
                    mb: 2,
                    border: "4px solid white",
                  }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: isSmallScreen ? 80 : 100,
                    height: isSmallScreen ? 80 : 100,
                    mb: 2,
                    border: "4px solid white",
                    bgcolor: "primary.main",
                    fontSize: isSmallScreen ? "2rem" : "2.5rem",
                  }}
                >
                  {getInitials(user.name)}
                </Avatar>
              )}
              <Typography
                component="h1"
                variant={isSmallScreen ? "h5" : "h4"}
                gutterBottom
                sx={{
                  fontSize: {
                    xs: "1.5rem",
                    sm: "1.75rem",
                    md: "2rem",
                    lg: "2.25rem",
                  },
                }}
              >
                Welcome back, {user.name}!
              </Typography>
              <Typography variant="subtitle1">{user.role} Dashboard</Typography>
            </AnimatedPaper>
          </Grid>

          {/* Dashboard Items */}
          <Grid item xs={12} sm={6} md={3}>
            <DashboardItem
              icon={<AssignmentIcon />}
              title="Total Claims"
              value="254"
              color="#FF6B6B"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardItem
              icon={<PeopleIcon />}
              title="Total Customers"
              value="1,846"
              color="#4ECDC4"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardItem
              icon={<AttachMoneyIcon />}
              title="Revenue"
              value="$542,950"
              color="#45B7D1"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardItem
              icon={<EmojiEventsIcon />}
              title="Completed Projects"
              value="187"
              color="#FF9F1C"
            />
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              {/* Add a list or timeline of recent roofing activities here */}
            </Paper>
          </Grid>
        </Grid>

        {/* Footer */}
        <Footer />
      </Box>
    </Suspense>
  );
}
