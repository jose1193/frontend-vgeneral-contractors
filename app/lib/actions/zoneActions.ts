// app/actions/zone.ts
import {
  ZoneData,
  ZoneCreateDTO,
  ZoneUpdateDTO,
  ZoneResponse,
  ZoneListResponse,
  ZoneDeleteResponse,
  ZoneRestoreResponse,
} from "../../types/zone";
import { fetchWithCSRF } from "../api";

const BASE_URL = "/api/zone";

/**
 * Obtiene la lista de todas las zonas
 */
export const getDataFetch = (token: string): Promise<ZoneListResponse> =>
  fetchWithCSRF(BASE_URL, { method: "GET" }, token);

/**
 * Obtiene una zona específica por UUID
 */
export const getData = (token: string, uuid: string): Promise<ZoneData> =>
  fetchWithCSRF(`${BASE_URL}/${uuid}`, { method: "GET" }, token);

/**
 * Crea una nueva zona
 */
export const createData = (
  token: string,
  zoneData: ZoneData
): Promise<ZoneResponse> =>
  fetchWithCSRF(
    `${BASE_URL}/store`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(zoneData),
    },
    token
  );

/**
 * Actualiza una zona existente
 */
export const updateData = (
  token: string,
  uuid: string,
  zoneData: ZoneUpdateDTO
): Promise<ZoneData> =>
  fetchWithCSRF(
    `${BASE_URL}/update/${uuid}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(zoneData),
    },
    token
  );

/**
 * Elimina una zona por UUID
 */
export const deleteData = (
  token: string,
  uuid: string
): Promise<ZoneDeleteResponse> =>
  fetchWithCSRF(`${BASE_URL}/delete/${uuid}`, { method: "DELETE" }, token);

/**
 * Restaura una zona eliminada
 */
export const restoreData = (token: string, uuid: string): Promise<ZoneData> =>
  fetchWithCSRF(`${BASE_URL}/restore/${uuid}`, { method: "PUT" }, token);

/**
 * Verifica si un código de zona está disponible
 */
export const checkZoneCodeAvailable = (
  token: string,
  code: string,
  uuid?: string
): Promise<{
  success: boolean;
  data: { available: boolean; message: string };
  message: string;
}> =>
  fetchWithCSRF(
    `${BASE_URL}/zone-code-check/${encodeURIComponent(code)}${
      uuid ? `?uuid=${uuid}` : ""
    }`,
    { method: "GET" },
    token
  );
