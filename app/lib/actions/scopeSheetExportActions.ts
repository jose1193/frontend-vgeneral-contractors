import {
  ScopeSheetExportData,
  ScopeSheetExportCreateDTO,
  ScopeSheetExportUpdateDTO,
  ScopeSheetExportGetResponse,
  ScopeSheetExportListResponse,
  ScopeSheetExportDeleteResponse,
  ScopeSheetExportCreateResponse,
  ScopeSheetExportUpdateResponse,
  ScopeSheetExportRestoreResponse,
} from "../../types/scope-sheet-export";
import { fetchWithCSRF } from "../api";

export const getDataFetch = (
  token: string
): Promise<ScopeSheetExportListResponse> =>
  fetchWithCSRF("/api/scope-sheet-export", { method: "GET" }, token);

export const getData = (
  token: string,
  uuid: string
): Promise<ScopeSheetExportGetResponse> =>
  fetchWithCSRF(`/api/scope-sheet-export/${uuid}`, { method: "GET" }, token);

export const createData = (
  token: string,
  data: ScopeSheetExportCreateDTO
): Promise<ScopeSheetExportCreateResponse> =>
  fetchWithCSRF(
    "/api/scope-sheet-export/store",
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
  data: ScopeSheetExportUpdateDTO
): Promise<ScopeSheetExportUpdateResponse> =>
  fetchWithCSRF(
    `/api/scope-sheet-export/update/${uuid}`,
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
): Promise<ScopeSheetExportDeleteResponse> =>
  fetchWithCSRF(
    `/api/scope-sheet-export/delete/${uuid}`,
    { method: "DELETE" },
    token
  );

export const restoreData = (
  token: string,
  uuid: string
): Promise<ScopeSheetExportRestoreResponse> =>
  fetchWithCSRF(
    `/api/scope-sheet-export/restore/${uuid}`,
    { method: "PUT" },
    token
  );
