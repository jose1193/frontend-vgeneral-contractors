import { ClaimStatusData } from "../../types/claim-status"; // Asegúrate de que esto apunta al archivo correcto
import { fetchWithCSRF } from "../api";

export const getClaimStatuses = (token: string) =>
  fetchWithCSRF("/api/claim-status", { method: "GET" }, token);

export const getClaimStatus = (
  token: string,
  uuid: string
): Promise<ClaimStatusData> =>
  fetchWithCSRF(`/api/claim-status/${uuid}`, { method: "GET" }, token);

export const createClaimStatus = (
  token: string,
  statusData: ClaimStatusData
): Promise<ClaimStatusData> =>
  fetchWithCSRF(
    "/api/claim-status/store",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(statusData),
    },
    token
  );

export const updateClaimStatus = (
  token: string,
  uuid: string,
  statusData: ClaimStatusData
): Promise<ClaimStatusData> =>
  fetchWithCSRF(
    `/api/claim-status/update/${uuid}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(statusData),
    },
    token
  );

export const deleteClaimStatus = (token: string, uuid: string): Promise<void> =>
  fetchWithCSRF(
    `/api/claim-status/delete/${uuid}`,
    { method: "DELETE" },
    token
  );

export const restoreClaimStatus = (
  token: string,
  uuid: string
): Promise<void> =>
  fetchWithCSRF(
    `/api/claim-status/restore/${uuid}`,
    { method: "PATCH" },
    token
  );
