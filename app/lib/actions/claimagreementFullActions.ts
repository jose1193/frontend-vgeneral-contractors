import {
  ClaimAgreementFullData,
  ClaimAgreementFullCreateDTO,
  ClaimAgreementFullUpdateDTO,
  ClaimAgreementFullResponse,
  ClaimAgreementFullListResponse,
  ClaimAgreementFullDeleteResponse,
} from "../../../app/types/claim-agreement-full";
import { fetchWithCSRF } from "../api";

export const getDataFetch = (
  token: string
): Promise<ClaimAgreementFullListResponse> =>
  fetchWithCSRF("/api/claim-agreement-full", { method: "GET" }, token);

export const getData = (
  token: string,
  uuid: string
): Promise<ClaimAgreementFullResponse> =>
  fetchWithCSRF(`/api/claim-agreement-full/${uuid}`, { method: "GET" }, token);

export const createData = (
  token: string,
  data: ClaimAgreementFullCreateDTO
): Promise<ClaimAgreementFullResponse> =>
  fetchWithCSRF(
    "/api/claim-agreement-full/store",
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
  data: ClaimAgreementFullUpdateDTO
): Promise<ClaimAgreementFullResponse> =>
  fetchWithCSRF(
    `/api/claim-agreement-full/update/${uuid}`,
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
): Promise<ClaimAgreementFullDeleteResponse> =>
  fetchWithCSRF(
    `/api/claim-agreement-full/delete/${uuid}`,
    { method: "DELETE" },
    token
  );

export const restoreData = (
  token: string,
  uuid: string
): Promise<ClaimAgreementFullResponse> =>
  fetchWithCSRF(
    `/api/claim-agreement-full/restore/${uuid}`,
    { method: "PUT" },
    token
  );
