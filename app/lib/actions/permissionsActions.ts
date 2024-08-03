import { PermissionData } from "../../types/permissions";
import { fetchWithCSRF } from "../api";

export const getPermissions = (token: string): Promise<PermissionData[]> =>
  fetchWithCSRF("/api/permissions-list", { method: "GET" }, token);

export const getPermission = (
  token: string,
  id: string
): Promise<PermissionData> =>
  fetchWithCSRF(`/api/permissions/${id}`, { method: "GET" }, token);

export const createPermission = (
  token: string,
  permissionData: PermissionData
): Promise<PermissionData> =>
  fetchWithCSRF(
    "/api/permissions",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(permissionData),
    },
    token
  );

export const updatePermission = (
  token: string,
  id: number,
  permissionData: PermissionData
): Promise<PermissionData> =>
  fetchWithCSRF(
    `/api/permissions-update/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(permissionData),
    },
    token
  );

export const deletePermission = (token: string, id: number): Promise<void> =>
  fetchWithCSRF(`/api/permissions-delete/${id}`, { method: "DELETE" }, token);
