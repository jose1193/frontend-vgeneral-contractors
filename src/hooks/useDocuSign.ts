// hooks/useDocuSignConnection.ts
import { useCallback, useEffect } from "react";
import { useDocuSignStore } from "../../app/zustand/useDocuSignStore";
import * as docusignActions from "../../app/lib/actions/docusignActions";
import {
  DocusignData,
  DocusignSignDTO,
  DocusignCallbackDTO,
  DocusignCheckStatusDTO,
  DocusignResponse,
  DocusignListResponse,
  DocusignSignResponse,
  DocusignStatus,
} from "../../app/types/docusign";

export const useDocuSignConnection = (token: string) => {
  const {
    setLoading,
    setError,
    setConnectionStatus,
    setDocuments,
    connectionStatus,
    documents,
    loading,
    error,
    checkConnectionStatus: storeCheckConnectionStatus,
  } = useDocuSignStore();

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const response: DocusignListResponse = await docusignActions.getDocuments(
        token
      );
      if (response.success && Array.isArray(response.data)) {
        setDocuments(response.data);
      }
    } catch (err) {
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, [token, setLoading, setError, setDocuments]);

  const checkConnectionStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await storeCheckConnectionStatus(token);
    } catch (err) {
      setError("Failed to check connection status");
      console.error("Error checking connection status:", err);
    } finally {
      setLoading(false);
    }
  }, [token, setLoading, setError, storeCheckConnectionStatus]);

  const connect = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await docusignActions.connectDocusign(token);
      return result;
    } catch (err) {
      setError("Failed to connect to DocuSign");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, setLoading, setError]);

  const refreshToken = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await docusignActions.refreshToken(token);
      await checkConnectionStatus();
    } catch (err) {
      setError("Failed to refresh token");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, checkConnectionStatus, setLoading, setError]);

  const checkMultipleDocumentStatus = useCallback(
    async (envelopeIds: string[]) => {
      try {
        const statusPromises = envelopeIds.map((envelopeId) =>
          docusignActions.checkDocumentStatus(token, {
            envelope_id: envelopeId,
          })
        );

        const statuses = await Promise.all(statusPromises);
        return statuses.reduce((acc, status, index) => {
          acc[envelopeIds[index]] = status;
          return acc;
        }, {} as Record<string, DocusignStatus>);
      } catch (err) {
        setError("Failed to check documents status");
        throw err;
      }
    },
    [token, setError]
  );

  const signDocument = useCallback(
    async (data: DocusignSignDTO): Promise<DocusignSignResponse> => {
      try {
        setLoading(true);
        const response = await docusignActions.signDocument(token, data);
        await loadDocuments();
        return response;
      } catch (err) {
        setError("Failed to sign document");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, setLoading, setError, loadDocuments]
  );

  const toSignature = useCallback(
    async (data: DocusignSignDTO): Promise<DocusignSignResponse> => {
      try {
        setLoading(true);
        const response = await docusignActions.toSignDocumentSignature(
          token,
          data
        );
        await loadDocuments();
        return response;
      } catch (err) {
        setError("Failed to send document for customer signature");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, setLoading, setError, loadDocuments]
  );
  const handleCallback = useCallback(
    async (data: DocusignCallbackDTO): Promise<DocusignResponse> => {
      try {
        setLoading(true);
        const response = await docusignActions.callbackDocusign(token, data);
        await loadDocuments();
        return response;
      } catch (err) {
        setError("Failed to process callback");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, setLoading, setError, loadDocuments]
  );

  const deleteDocusignDocument = useCallback(
    async (uuid: string) => {
      try {
        await docusignActions.deleteDocument(token, uuid);
        setDocuments((prevDocuments) =>
          prevDocuments.filter((document) => document.uuid !== uuid)
        );
      } catch (err) {
        console.error("Error deleting document docusign:", err);
        setError("Failed to delete document docusign");
        throw err;
      }
    },
    [token, setDocuments, setError]
  );

  const checkDocumentStatus = useCallback(
    async (data: DocusignCheckStatusDTO) => {
      try {
        if (!data.envelope_id) {
          throw new Error("Envelope ID is required");
        }

        setLoading(true);
        const status = await docusignActions.checkDocumentStatus(token, data);

        if (!status || !status.details) {
          throw new Error("Invalid status response");
        }

        return status;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to check document status";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, setLoading, setError]
  );

  return {
    connectionStatus,
    documents,
    loading,
    error,
    connect,
    refreshToken,
    signDocument,
    toSignature,
    checkConnectionStatus,
    loadDocuments,
    handleCallback,
    checkDocumentStatus,
    checkMultipleDocumentStatus,
    deleteDocusignDocument,
  };
};
