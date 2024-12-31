import {
  ScopeSheetData,
  ScopeSheetCreateDTO,
  ScopeSheetUpdateDTO,
  ScopeSheetGetResponse,
  ScopeSheetListResponse,
  ScopeSheetDeleteResponse,
  ScopeSheetCreateResponse,
  ScopeSheetUpdateResponse,
  ScopeSheetRestoreResponse,
} from "../../../app/types/scope-sheet";
import { fetchWithCSRF } from "../api";

export const getDataFetch = (token: string): Promise<ScopeSheetListResponse> =>
  fetchWithCSRF("/api/scope-sheet", { method: "GET" }, token);

export const getData = (
  token: string,
  uuid: string
): Promise<ScopeSheetGetResponse> =>
  fetchWithCSRF(`/api/scope-sheet/${uuid}`, { method: "GET" }, token);

export const createData = (
  token: string,
  data: ScopeSheetCreateDTO
): Promise<ScopeSheetCreateResponse> =>
  fetchWithCSRF(
    "/api/scope-sheet/store",
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
  data: ScopeSheetUpdateDTO
): Promise<ScopeSheetUpdateResponse> =>
  fetchWithCSRF(
    `/api/scope-sheet/update/${uuid}`,
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
): Promise<ScopeSheetDeleteResponse> =>
  fetchWithCSRF(`/api/scope-sheet/delete/${uuid}`, { method: "DELETE" }, token);

export const restoreData = (
  token: string,
  uuid: string
): Promise<ScopeSheetRestoreResponse> =>
  fetchWithCSRF(`/api/scope-sheet/restore/${uuid}`, { method: "PUT" }, token);
