// app/auth/docusign/callback/page.tsx
"use client";
import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useDocuSignConnection } from "../../../../src/hooks/useDocuSign";
import { ROUTES, getDocuSignRoute } from "../../../constants/routes";
import { PERMISSIONS } from "../../../../src/config/permissions";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";

const DocuSignCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();
  const token = session?.accessToken as string;
  const processedRef = useRef(false);

  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { handleCallback, checkConnectionStatus, loading } =
    useDocuSignConnection(token);

  const processCallback = useCallback(async () => {
    // Evitar procesamiento múltiple
    if (processedRef.current || isProcessing || !token) return;
    setIsProcessing(true);

    try {
      const code = searchParams.get("code");
      console.log(
        "Processing callback with code:",
        code ? "present" : "missing"
      );

      if (!code) {
        setStatus("error");
        setError("No authorization code received from DocuSign");
        return;
      }

      // Marcar como procesado
      processedRef.current = true;

      console.log("Starting callback process");
      const response = await handleCallback({ code });
      console.log("Callback response received:", response.success);

      if (response.success) {
        await checkConnectionStatus();
        setStatus("success");

        // Redirigir después del éxito
        setTimeout(() => {
          router.push(ROUTES.DASHBOARD.DOCUSIGN.CONNECT);
        }, 2000);
      } else {
        throw new Error("Failed to process DocuSign callback");
      }
    } catch (err) {
      console.error("Callback processing error:", err);
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Failed to process DocuSign callback"
      );
    } finally {
      setIsProcessing(false);
    }
  }, [
    token,
    isProcessing,
    searchParams,
    handleCallback,
    checkConnectionStatus,
    router,
  ]);

  useEffect(() => {
    if (sessionStatus === "authenticated" && token && !processedRef.current) {
      processCallback();
    }
  }, [sessionStatus, token, processCallback]);
  // Estilos responsive
  const styles = {
    wrapper: {
      p: { xs: 2, sm: 3, md: 4 },
      maxWidth: { xs: "100%", sm: "95%", md: 600 },
      margin: "0 auto",
      minHeight: "200px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    card: {
      width: "100%",
    },
    content: {
      textAlign: "center",
      py: 4,
    },
  };

  return (
    <Suspense>
      <Box sx={styles.wrapper}>
        <Card sx={styles.card}>
          <CardContent sx={styles.content}>
            {status === "processing" && (
              <>
                <CircularProgress sx={{ mb: 2 }} size={40} thickness={4} />
                <Typography>
                  {loading
                    ? "Processing DocuSign authorization..."
                    : "Initializing connection..."}
                </Typography>
              </>
            )}

            {status === "success" && (
              <Alert severity="success">
                <AlertTitle>Connection Successful!</AlertTitle>
                Your DocuSign connection has been established successfully.
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Redirecting to DocuSign dashboard...
                </Typography>
              </Alert>
            )}

            {status === "error" && (
              <Alert severity="error">
                <AlertTitle>Connection Error</AlertTitle>
                {error ||
                  "An unexpected error occurred during DocuSign connection"}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Please close this window and try connecting again from the
                    DocuSign dashboard.
                  </Typography>
                </Box>
              </Alert>
            )}
          </CardContent>
        </Card>
      </Box>
    </Suspense>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

export default withRoleProtection(DocuSignCallbackPage, protectionConfig);
