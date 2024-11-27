// src/stores/useDocuSignStore.ts
import { create } from "zustand";
import {
  DocusignData,
  DocusignStatus,
  DocusignConnect,
} from "../types/docusign";
import * as docusignActions from "../lib/actions/docusignActions";

interface DocuSignStore {
  // State
  documents: DocusignData[];
  loading: boolean;
  error: string | null;
  connectUrl: string | null;
  documentStatuses: Record<string, DocusignStatus>;
  connectionStatus: {
    isConnected: boolean;
    expiresAt: string | null;
    lastRefresh: string | null;
  };
  token: string | null;

  // Actions
  connectToDocusign: (token: string) => Promise<DocusignConnect>;
  disconnectFromDocusign: (token: string) => Promise<void>;
  refreshToken: (token: string) => Promise<void>;
  checkConnectionStatus: (token: string) => Promise<void>;
  refreshDocuments: () => Promise<void>;

  // Setters
  setDocuments: (
    documentsOrUpdater:
      | DocusignData[]
      | ((prev: DocusignData[]) => DocusignData[])
  ) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setConnectUrl: (url: string | null) => void;
  setToken: (token: string | null) => void;
  setConnectionStatus: (status: {
    isConnected: boolean;
    expiresAt: string | null;
    lastRefresh: string | null;
  }) => void;

  // CRUD Operations
  addDocument: (document: DocusignData) => void;
  updateDocument: (uuid: string, document: DocusignData) => void;
  deleteDocument: (uuid: string) => void;

  // Document Status Management
  setDocumentStatus: (envelopeId: string, status: DocusignStatus) => void;
  getDocumentStatus: (envelopeId: string) => DocusignStatus | null;

  // Utilities
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  documents: [],
  loading: false,
  error: null,
  connectUrl: null,
  documentStatuses: {},
  connectionStatus: {
    isConnected: false,
    expiresAt: null,
    lastRefresh: null,
  },
  token: null,
};

export const useDocuSignStore = create<DocuSignStore>((set, get) => ({
  ...initialState,

  // Actions
  connectToDocusign: async (token: string) => {
    try {
      set({ loading: true, error: null });
      const response = await docusignActions.connectDocusign(token);
      if (response.success && response.data?.url) {
        set({ connectUrl: response.data.url });
        return response;
      }
      throw new Error("No URL received from DocuSign");
    } catch (error) {
      set({ error: "Failed to connect to DocuSign" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  disconnectFromDocusign: async (token: string) => {
    try {
      set({ loading: true, error: null });
      await docusignActions.disconnectDocusign(token);
      await get().checkConnectionStatus(token);
    } catch (error) {
      set({ error: "Failed to disconnect from DocuSign" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  refreshToken: async (token: string) => {
    try {
      set({ loading: true, error: null });
      await docusignActions.refreshToken(token);
      const status = await docusignActions.getConnectionStatus(token);
      set({ connectionStatus: status });
    } catch (error) {
      set({ error: "Failed to refresh token" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  checkConnectionStatus: async (token: string) => {
    try {
      set({ loading: true, error: null });
      const response = await docusignActions.getConnectionStatus(token);
      set({
        connectionStatus: {
          isConnected: response.isConnected,
          expiresAt: response.expiresAt,
          lastRefresh: response.lastRefresh,
        },
      });
    } catch (error) {
      set({ error: "Failed to check connection status" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  refreshDocuments: async () => {
    const state = get();
    if (!state.token) {
      throw new Error("No token available");
    }

    try {
      set({ loading: true, error: null });
      const response = await docusignActions.getDocuments(state.token);
      if (response.success && response.data) {
        set({ documents: response.data });
      }
    } catch (error) {
      set({ error: "Failed to refresh documents" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Setters
  setDocuments: (documentsOrUpdater) =>
    set((state) => ({
      documents:
        typeof documentsOrUpdater === "function"
          ? documentsOrUpdater(state.documents)
          : documentsOrUpdater,
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setConnectUrl: (url) => set({ connectUrl: url }),
  setToken: (token) => set({ token }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),

  // CRUD Operations
  addDocument: (document) =>
    set((state) => ({
      documents: [document, ...state.documents].sort((a, b) =>
        (b.created_at || "").localeCompare(a.created_at || "")
      ),
    })),

  updateDocument: (uuid, updatedDocument) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.uuid === uuid ? { ...doc, ...updatedDocument } : doc
      ),
    })),

  deleteDocument: (uuid) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.uuid !== uuid),
      documentStatuses: Object.fromEntries(
        Object.entries(state.documentStatuses).filter(
          ([_, status]) => status.details.envelopeId !== uuid
        )
      ),
    })),

  // Document Status Management
  setDocumentStatus: (envelopeId, status) =>
    set((state) => ({
      documentStatuses: {
        ...state.documentStatuses,
        [envelopeId]: status,
      },
    })),

  getDocumentStatus: (envelopeId) => {
    const state = get();
    return state.documentStatuses[envelopeId] || null;
  },

  // Utilities
  clearError: () => set({ error: null }),
  reset: () => set(initialState),
}));
