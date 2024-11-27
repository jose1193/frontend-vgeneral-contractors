import { ClaimAgreementData } from "../../types/claim-agreement";
import { fetchWithCSRF } from "../api";

export const getClaimAgreements = (token: string) =>
  fetchWithCSRF("/api/claim-agreement", { method: "GET" }, token);

export const getClaimAgreement = (
  token: string,
  uuid: string
): Promise<ClaimAgreementData> =>
  fetchWithCSRF(`/api/claim-agreement/${uuid}`, { method: "GET" }, token);

export const createClaimAgreement = (
  token: string,
  agreementData: ClaimAgreementData
): Promise<ClaimAgreementData> =>
  fetchWithCSRF(
    "/api/claim-agreement/store",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(agreementData),
    },
    token
  );

export const updateClaimAgreement = (
  token: string,
  uuid: string,
  agreementData: ClaimAgreementData
): Promise<ClaimAgreementData> =>
  fetchWithCSRF(
    `/api/claim-agreement/update/${uuid}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(agreementData),
    },
    token
  );

export const deleteClaimAgreement = (
  token: string,
  uuid: string
): Promise<void> =>
  fetchWithCSRF(
    `/api/claim-agreement/delete/${uuid}`,
    { method: "DELETE" },
    token
  );
