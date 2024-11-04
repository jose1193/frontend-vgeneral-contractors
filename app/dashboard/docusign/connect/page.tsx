"use client";

import { useEffect, useState, Suspense } from "react";
import { useDocuSignStore } from "../../../zustand/useDocuSignStore";
import { AssignmentTurnedInOutlined } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useSession } from "next-auth/react";
import {
  CheckCircleOutline,
  ErrorOutline,
  WarningAmber,
  LinkOff,
} from "@mui/icons-material";
import { PERMISSIONS } from "../../../../src/config/permissions";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import TypographyHeading from "../../../components/TypographyHeading";

const DocuSignConnectPage = () => {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const [hasCheckedInitialStatus, setHasCheckedInitialStatus] = useState(false);
  const [iconPulse, setIconPulse] = useState(false);

  const {
    connectToDocusign,
    refreshToken,
    checkConnectionStatus,
    connectionStatus,
    loading,
    error,
    setError,
  } = useDocuSignStore();

  // Helper functions
  const isTokenExpired = () => {
    if (!connectionStatus.expiresAt) return true;
    const now = new Date();
    const expiryDate = new Date(connectionStatus.expiresAt);
    return expiryDate <= now;
  };

  const isTokenExpiringSoon = () => {
    if (!connectionStatus.expiresAt) return false;
    const now = new Date();
    const expiryDate = new Date(connectionStatus.expiresAt);
    const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    return expiryDate <= threeHoursFromNow;
  };

  const getConnectionStatus = () => {
    if (isTokenExpired()) {
      return "expired";
    }
    if (isTokenExpiringSoon()) {
      return "expiring-soon";
    }
    return "active";
  };

  // Styles and UI helpers
  const getIconColor = () => {
    if (!connectionStatus.isConnected) return "primary.main";
    switch (getConnectionStatus()) {
      case "active":
        return "success.main";
      case "expiring-soon":
        return "warning.main";
      case "expired":
        return "error.main";
      default:
        return "primary.main";
    }
  };

  const getStatusText = () => {
    if (!connectionStatus.isConnected) return "Not Connected";
    switch (getConnectionStatus()) {
      case "active":
        return "Connected";
      case "expiring-soon":
        return "Connection Expiring Soon";
      case "expired":
        return "Connection Expired";
      default:
        return "Status Unknown";
    }
  };

  const getResponsiveStyles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      px: { xs: 2, sm: 3, md: 4 },
      py: 4,
    },
    wrapper: {
      width: {
        xs: "100%",
        sm: "80%",
        md: "70%",
        lg: "60%",
      },
      maxWidth: "1200px",
    },
    button: {
      minWidth: { xs: "100%", sm: 200 },
      mt: { xs: 1, sm: 2 },
    },
    iconContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      mb: 3,
      position: "relative",
    },
    icon: {
      fontSize: { xs: 48, sm: 56, md: 64 },
      color: getIconColor(),
      mb: 1,
      transform: iconPulse ? "scale(1.1)" : "scale(1)",
      transition: "all 0.3s ease-in-out",
    },
    statusText: {
      color: getIconColor(),
      typography: "body2",
      fontWeight: "medium",
      textAlign: "center",
      mt: 1,
    },
    pulseRing: {
      position: "absolute",
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: iconPulse ? "pulse 1s ease-out" : "none",
      "@keyframes pulse": {
        "0%": {
          transform: "scale(0.95)",
          boxShadow: "0 0 0 0 rgba(0, 0, 0, 0.3)",
        },
        "70%": {
          transform: "scale(1)",
          boxShadow: "0 0 0 10px rgba(0, 0, 0, 0)",
        },
        "100%": {
          transform: "scale(0.95)",
          boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
        },
      },
    },
  };

  // Event handlers
  const handleConnect = async () => {
    try {
      const result = await connectToDocusign(token);
      if (result?.data?.url) {
        console.log("Redirecting to DocuSign authentication:", result.data.url);
        window.location.href = result.data.url;
      } else {
        console.error("Invalid response structure:", result);
        throw new Error("No URL received from DocuSign");
      }
    } catch (error) {
      console.error("Error connecting to DocuSign:", error);
      setError(
        error instanceof Error ? error.message : "Failed to connect to DocuSign"
      );
    }
  };

  const handleRefreshToken = async () => {
    try {
      console.log("Initiating token refresh...");
      await refreshToken(token);
      console.log("Token refreshed successfully");
    } catch (error) {
      console.error("Error refreshing token:", error);
      setError(
        error instanceof Error ? error.message : "Failed to refresh token"
      );
    }
  };

  // Effects
  useEffect(() => {
    const initializeConnection = async () => {
      if (token) {
        try {
          await checkConnectionStatus(token);
        } catch (err) {
          console.error("Error checking connection status:", err);
          setError("Failed to check DocuSign connection status");
        } finally {
          setHasCheckedInitialStatus(true);
        }
      } else {
        setHasCheckedInitialStatus(true);
      }
    };

    initializeConnection();
  }, [token, checkConnectionStatus, setError]);

  // Extraemos el estado de conexión a una variable para usarla en el efecto
  const currentConnectionStatus = getConnectionStatus();

  useEffect(() => {
    setIconPulse(true);
    const timer = setTimeout(() => setIconPulse(false), 1000);
    return () => clearTimeout(timer);
  }, [connectionStatus.isConnected, currentConnectionStatus]); // Ahora usamos la variable

  if (!hasCheckedInitialStatus) {
    return (
      <Box sx={getResponsiveStyles.container}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Suspense>
      <Box sx={getResponsiveStyles.container}>
        <Box sx={getResponsiveStyles.wrapper}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={getResponsiveStyles.iconContainer}>
              <Box sx={getResponsiveStyles.pulseRing} />
              <AssignmentTurnedInOutlined sx={getResponsiveStyles.icon} />
              <Typography sx={getResponsiveStyles.statusText}>
                {getStatusText()}
              </Typography>
            </Box>
            <Typography
              variant="h4"
              component="h1"
              align="center"
              fontWeight="bold"
              sx={{
                mb: 3,
                fontSize: {
                  xs: "1.5rem",
                  sm: "2rem",
                  md: "2rem",
                  lg: "2rem",
                },
              }}
            >
              DocuSign Connection Status
            </Typography>
            <Box sx={{ "& > *": { mb: 2 } }}>
              {error && (
                <Alert
                  severity="error"
                  icon={<ErrorOutline />}
                  onClose={() => setError(null)}
                >
                  <AlertTitle>Error</AlertTitle>
                  {error}
                </Alert>
              )}

              {connectionStatus.isConnected && (
                <>
                  {getConnectionStatus() === "active" && (
                    <Alert severity="success" icon={<CheckCircleOutline />}>
                      <AlertTitle>Connected to DocuSign</AlertTitle>
                      <Box sx={{ mt: 1 }}>
                        {connectionStatus.expiresAt && (
                          <Typography variant="body2">
                            Expires:{" "}
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ fontWeight: "bold" }}
                            >
                              {new Date(
                                connectionStatus.expiresAt
                              ).toLocaleString()}
                            </Typography>
                          </Typography>
                        )}
                        {connectionStatus.lastRefresh && (
                          <Typography variant="body2">
                            Last Refresh:{" "}
                            {new Date(
                              connectionStatus.lastRefresh
                            ).toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                    </Alert>
                  )}

                  {getConnectionStatus() === "expiring-soon" && (
                    <>
                      <Alert severity="warning" icon={<WarningAmber />}>
                        <AlertTitle>Connection Expiring Soon</AlertTitle>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2">
                            Your DocuSign connection will expire in less than 3
                            hours.
                          </Typography>
                          {connectionStatus.expiresAt && (
                            <Typography variant="body2">
                              Expires:{" "}
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{ fontWeight: "bold" }}
                              >
                                {new Date(
                                  connectionStatus.expiresAt
                                ).toLocaleString()}
                              </Typography>
                            </Typography>
                          )}
                          {connectionStatus.lastRefresh && (
                            <Typography variant="body2">
                              Last Refresh:{" "}
                              {new Date(
                                connectionStatus.lastRefresh
                              ).toLocaleString()}
                            </Typography>
                          )}
                        </Box>
                      </Alert>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 3,
                        }}
                      >
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={handleRefreshToken}
                          disabled={loading}
                          startIcon={loading && <CircularProgress size={20} />}
                          sx={getResponsiveStyles.button}
                        >
                          {loading ? "Refreshing..." : "Refresh Token"}
                        </Button>
                      </Box>
                    </>
                  )}

                  {getConnectionStatus() === "expired" && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Alert severity="error" icon={<ErrorOutline />}>
                        <AlertTitle>Connection Expired</AlertTitle>
                        Your connection to DocuSign has expired. Please
                        establish a new connection.
                      </Alert>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleConnect}
                        disabled={loading}
                        startIcon={
                          loading ? <CircularProgress size={20} /> : <LinkOff />
                        }
                        sx={getResponsiveStyles.button}
                      >
                        {loading ? "Connecting..." : "Establish New Connection"}
                      </Button>
                    </Box>
                  )}
                </>
              )}

              {!connectionStatus.isConnected && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Alert severity="info" icon={<ErrorOutline />}>
                    <AlertTitle>Setup Required</AlertTitle>
                    To begin using DocuSign integration, you need to establish a
                    secure connection. Click the button below to set up your
                    DocuSign connection.
                  </Alert>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleConnect}
                    disabled={loading}
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <CheckCircleOutline />
                      )
                    }
                    sx={getResponsiveStyles.button}
                  >
                    {loading
                      ? "Setting up connection..."
                      : "Set Up DocuSign Connection"}
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Suspense>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

export default withRoleProtection(DocuSignConnectPage, protectionConfig);
