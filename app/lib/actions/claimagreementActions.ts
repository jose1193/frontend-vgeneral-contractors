import {
  ClaimAgreementData,
  ClaimAgreementCreateDTO,
  ClaimAgreementUpdateDTO,
  ClaimAgreementResponse,
  ClaimAgreementListResponse,
  ClaimAgreementDeleteResponse,
} from "../../types/claim-agreement";
import { fetchWithCSRF } from "../api";

export const getDataFetch = (
  token: string
): Promise<ClaimAgreementListResponse> =>
  fetchWithCSRF("/api/claim-agreement", { method: "GET" }, token);

export const getData = (
  token: string,
  uuid: string
): Promise<ClaimAgreementResponse> =>
  fetchWithCSRF(`/api/claim-agreement/${uuid}`, { method: "GET" }, token);

export const createData = (
  token: string,
  data: ClaimAgreementCreateDTO
): Promise<ClaimAgreementResponse> =>
  fetchWithCSRF(
    "/api/claim-agreement/store",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    token
  );

export const updateData = (
  token: string,
  uuid: string,
  data: ClaimAgreementUpdateDTO
): Promise<ClaimAgreementResponse> =>
  fetchWithCSRF(
    `/api/claim-agreement/update/${uuid}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    token
  );

export const deleteData = (
  token: string,
  uuid: string
): Promise<ClaimAgreementDeleteResponse> =>
  fetchWithCSRF(
    `/api/claim-agreement/delete/${uuid}`,
    { method: "DELETE" },
    token
  );

export const restoreData = (
  token: string,
  uuid: string
): Promise<ClaimAgreementResponse> =>
  fetchWithCSRF(
    `/api/claim-agreement/restore/${uuid}`,
    { method: "PUT" },
    token
  );
