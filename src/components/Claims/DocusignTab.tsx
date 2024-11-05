import React, { useState, useEffect } from "react";
import { ClaimsData } from "../../../app/types/claims";
import DocusignDetailsTab from "./DocusignDetailsTab";
import DocusignFormTab from "./DocusignFormTab";
import { useDocuSignConnection } from "../../hooks/useDocuSign";
import { useSession } from "next-auth/react";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";
import { useDocuSignStore } from "../../../app/zustand/useDocuSignStore";

interface DocusignTabProps {
  claim: ClaimsData;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

const DocusignTab: React.FC<DocusignTabProps> = ({ claim }) => {
  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const {
    documents,
    setDocuments,
    setToken,
    refreshDocuments: storeRefreshDocuments,
  } = useDocuSignStore();

  const { loadDocuments, checkDocumentStatus } = useDocuSignConnection(token);

  const [showDetails, setShowDetails] = useState(
    claim.claims_docusign && claim.claims_docusign.length > 0
  );

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    if (token) {
      setToken(token);
    }
  }, [token, setToken]);

  useEffect(() => {
    if (claim.claims_docusign) {
      setDocuments(claim.claims_docusign);
    }
  }, [claim.claims_docusign, setDocuments]);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const refreshAllData = async () => {
    try {
      await Promise.all([loadDocuments(), storeRefreshDocuments()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
      throw error;
    }
  };

  const handleDocumentSigned = async () => {
    try {
      await refreshAllData();

      setShowDetails(true);
      setSnackbar({
        open: true,
        message: "Document sent for signing successfully",
        severity: "success",
      });

      // Get the latest document's envelope ID
      const latestDoc = claim.claims_docusign?.[0];
      const envelopeId = latestDoc?.envelope_id;

      if (!envelopeId) {
        console.warn("No envelope ID found for the latest document");
        return;
      }

      // Set up polling to check document status
      const pollInterval = setInterval(async () => {
        try {
          const status = await checkDocumentStatus({
            envelope_id: envelopeId,
          });

          const currentStatus = status?.details?.status?.toLowerCase();

          if (
            currentStatus &&
            ["completed", "declined", "voided"].includes(currentStatus)
          ) {
            clearInterval(pollInterval);
            await refreshAllData();
          }
        } catch (error) {
          console.error("Error polling for updates:", error);
          clearInterval(pollInterval);
        }
      }, 5000); // Poll every 5 seconds

      // Clean up polling after 2 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
      }, 120000);
    } catch (error) {
      console.error("Error handling document signed:", error);
      setSnackbar({
        open: true,
        message: "Error updating document status",
        severity: "error",
      });
    }
  };

  const claimWithUpdatedDocs = {
    ...claim,
    claims_docusign: documents,
  };

  if (showDetails) {
    return (
      <>
        <DocusignDetailsTab claim={claimWithUpdatedDocs} />
        <FeedbackSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
        />
      </>
    );
  }

  return (
    <>
      <DocusignFormTab
        claim={claimWithUpdatedDocs}
        onDocumentSigned={handleDocumentSigned}
      />
      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </>
  );
};

export default DocusignTab;
