import { RolesData } from "../../types/roles"; // Cambia a los tipos de roles
import { fetchWithCSRF } from "../api";

export const getRoles = (token: string): Promise<RolesData[]> =>
  fetchWithCSRF("/api/roles-list", { method: "GET" }, token);

export const getRole = (token: string, id: string): Promise<RolesData> =>
  fetchWithCSRF(`/api/roles/${id}`, { method: "GET" }, token);

export const createRole = (
  token: string,
  roleData: RolesData
): Promise<RolesData> =>
  fetchWithCSRF(
    "/api/roles",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roleData),
    },
    token
  );

export const updateRole = (
  token: string,
  id: number,
  roleData: RolesData
): Promise<RolesData> =>
  fetchWithCSRF(
    `/api/roles-update/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roleData),
    },
    token
  );

export const deleteRole = (token: string, id: number): Promise<void> =>
  fetchWithCSRF(`/api/roles-delete/${id}`, { method: "DELETE" }, token);

export const checkPermissionsAvailable = async (token: string) => {
  const response = await fetchWithCSRF(`/api/permissions-list/`, {}, token);
  return response;
};
