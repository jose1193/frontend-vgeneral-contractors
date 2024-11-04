// app/actions/docusignActions.ts
import { fetchWithCSRF } from "../api";
import {
  DocusignData,
  DocusignListResponse,
  DocusignResponse,
  DocusignConnect,
  DocusignSignDTO,
  DocusignSignResponse,
  DocusignCallbackDTO,
  DocusignCheckStatusDTO,
  DocusignStatus,
} from "../../types/docusign";

export const getConnectionStatus = async (
  token: string
): Promise<{
  isConnected: boolean;
  expiresAt: string | null;
  lastRefresh: string | null;
}> => {
  return fetchWithCSRF("/api/docusign/status", { method: "GET" }, token);
};

export const getDocuments = async (
  token: string
): Promise<DocusignListResponse> =>
  fetchWithCSRF("/api/docusign", { method: "GET" }, token);

export const getAllDocuments = async (
  token: string
): Promise<DocusignListResponse> =>
  fetchWithCSRF("/api/docusign/all-documents", { method: "GET" }, token);

export const connectDocusign = async (
  token: string
): Promise<DocusignConnect> => {
  const response = await fetchWithCSRF(
    "/api/docusign/connect",
    {
      method: "POST",
    },
    token
  );

  if (!response.success || !response.data?.url) {
    throw new Error("Invalid response from DocuSign connect endpoint");
  }

  return response;
};

export const callbackDocusign = async (
  token: string,
  data: DocusignCallbackDTO
): Promise<DocusignResponse> =>
  fetchWithCSRF(
    "/api/docusign/callback",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    token
  );

export const signDocument = async (
  token: string,
  data: DocusignSignDTO
): Promise<DocusignSignResponse> =>
  fetchWithCSRF(
    "/api/docusign/sign",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    token
  );

export const checkDocumentStatus = async (
  token: string,
  data: DocusignCheckStatusDTO
): Promise<DocusignStatus> =>
  fetchWithCSRF(
    "/api/docusign/check-document",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    token
  );

export const refreshToken = async (token: string): Promise<DocusignResponse> =>
  fetchWithCSRF("/api/docusign/refresh-token", { method: "POST" }, token);

export const deleteDocument = async (
  token: string,
  uuid: string
): Promise<void> =>
  fetchWithCSRF(`/api/docusign/delete/${uuid}`, { method: "DELETE" }, token);