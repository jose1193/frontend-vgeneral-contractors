//app/lib/actions/usersActions.ts
import { UserData } from "../../types/user";
import { fetchWithCSRF } from "../api";

export const getUsers = (token: string) =>
  fetchWithCSRF("/api/users", { method: "GET" }, token);

export const getUser = (token: string, uuid: string): Promise<UserData> =>
  fetchWithCSRF(`/api/users/${uuid}`, { method: "GET" }, token);

export const createUser = (token: string, userData: UserData) =>
  fetchWithCSRF(
    "/api/users/store",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    },
    token
  );

export const updateUser = (token: string, uuid: string, userData: UserData) =>
  fetchWithCSRF(
    `/api/users/update/${uuid}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    },
    token
  );

export const deleteUser = (token: string, uuid: string) =>
  fetchWithCSRF(`/api/users/delete/${uuid}`, { method: "DELETE" }, token);

export const restoreUser = (token: string, uuid: string) =>
  fetchWithCSRF(`/api/users/restore/${uuid}`, { method: "PUT" }, token);
