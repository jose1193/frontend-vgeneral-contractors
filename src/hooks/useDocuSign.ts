// src/hooks/useDocuSignConnection.ts
import { useCallback, useEffect } from "react";
import { useDocuSignStore } from "../../app/zustand/useDocuSignStore";
import * as docusignActions from "../../app/lib/actions/docusignActions";
import {
  DocusignSignDTO,
  DocusignCallbackDTO,
  DocusignCheckStatusDTO,
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
  } = useDocuSignStore();

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await docusignActions.getDocuments(token);
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
      const status = await docusignActions.getConnectionStatus(token);
      setConnectionStatus(status);
    } catch (err) {
      setError("Failed to check connection status");
      console.error("Error checking connection status:", err);
    } finally {
      setLoading(false);
    }
  }, [token, setLoading, setError, setConnectionStatus]);

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

  const signDocument = useCallback(
    async (data: DocusignSignDTO) => {
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

  const handleCallback = useCallback(
    async (data: DocusignCallbackDTO) => {
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

  const checkDocumentStatus = useCallback(
    async (data: DocusignCheckStatusDTO) => {
      try {
        setLoading(true);
        const status = await docusignActions.checkDocumentStatus(token, data);
        return status;
      } catch (err) {
        setError("Failed to check document status");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, setLoading, setError]
  );

  useEffect(() => {
    checkConnectionStatus();
    loadDocuments();
  }, [checkConnectionStatus, loadDocuments]);

  return {
    connectionStatus,
    documents,
    loading,
    error,
    connect,
    refreshToken,
    signDocument,
    checkConnectionStatus,
    loadDocuments,
    handleCallback,
    checkDocumentStatus,
  };
};
