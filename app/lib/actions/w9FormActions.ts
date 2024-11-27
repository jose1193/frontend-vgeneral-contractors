import {
  W9FormData,
  W9FormCreateDTO,
  W9FormUpdateDTO,
  W9FormGetResponse,
  W9FormListResponse,
  W9FormDeleteResponse,
  W9FormCreateResponse,
  W9FormUpdateResponse,
  W9FormRestoreResponse,
} from "../../../app/types/w9form";
import { fetchWithCSRF } from "../api";

export const getDataFetch = (token: string): Promise<W9FormListResponse> =>
  fetchWithCSRF("/api/w9form", { method: "GET" }, token);

export const getData = (
  token: string,
  uuid: string
): Promise<W9FormGetResponse> =>
  fetchWithCSRF(`/api/w9form/${uuid}`, { method: "GET" }, token);

export const createData = (
  token: string,
  data: W9FormCreateDTO
): Promise<W9FormCreateResponse> =>
  fetchWithCSRF(
    "/api/w9form/store",
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
  data: W9FormUpdateDTO
): Promise<W9FormUpdateResponse> =>
  fetchWithCSRF(
    `/api/w9form/update/${uuid}`,
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
): Promise<W9FormDeleteResponse> =>
  fetchWithCSRF(`/api/w9form/delete/${uuid}`, { method: "DELETE" }, token);

export const restoreData = (
  token: string,
  uuid: string
): Promise<W9FormRestoreResponse> =>
  fetchWithCSRF(`/api/w9form/restore/${uuid}`, { method: "PUT" }, token);
