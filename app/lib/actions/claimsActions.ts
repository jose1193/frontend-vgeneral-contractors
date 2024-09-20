import { ClaimsData } from "../../types/claims"; // Asegúrate de que esto apunta al archivo correcto
import { fetchWithCSRF } from "../api";

export const getDataFetch = (token: string) =>
  fetchWithCSRF("/api/claim", { method: "GET" }, token);

export const getData = (token: string, uuid: string): Promise<ClaimsData> =>
  fetchWithCSRF(`/api/claim/${uuid}`, { method: "GET" }, token);

export const createData = (
  token: string,
  typeData: ClaimsData
): Promise<ClaimsData> =>
  fetchWithCSRF(
    "/api/claim/store",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(typeData),
    },
    token
  );

export const updateData = (
  token: string,
  uuid: string,
  typeData: ClaimsData
): Promise<ClaimsData> =>
  fetchWithCSRF(
    `/api/claim/update/${uuid}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(typeData),
    },
    token
  );

export const deleteData = (token: string, uuid: string): Promise<void> =>
  fetchWithCSRF(`/api/claim/delete/${uuid}`, { method: "DELETE" }, token);

export const restoreData = (token: string, uuid: string) =>
  fetchWithCSRF(`/api/claim/restore/${uuid}`, { method: "PUT" }, token);

export const checkCustomersAvailable = async (token: string) => {
  const response = await fetchWithCSRF(`/api/customers/`, {}, token);
  return response;
};

export const checkPropertiesAvailable = async (token: string) => {
  const response = await fetchWithCSRF(`/api/properties/`, {}, token);
  return response;
};

export const checkTypeDamagesAvailable = async (token: string) => {
  const response = await fetchWithCSRF(`/api/type-damage/`, {}, token);
  return response;
};

export const checkInsuranceCompaniesAvailable = async (token: string) => {
  const response = await fetchWithCSRF(`/api/insurance-company/`, {}, token);
  return response;
};

export const checkPublicCompaniesAvailable = async (token: string) => {
  const response = await fetchWithCSRF(`/api/public-company/`, {}, token);
  return response;
};

export const checkAllianceCompaniesAvailable = async (token: string) => {
  const response = await fetchWithCSRF(`/api/alliance-company/`, {}, token);
  return response;
};

export const checkServiceRequestsAvailable = async (token: string) => {
  const response = await fetchWithCSRF(`/api/service-request/`, {}, token);
  return response;
};

export const checkUsersAvailable = async (token: string, role: string) => {
  const response = await fetchWithCSRF(
    `/api/users/users-roles/list/${encodeURIComponent(role)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Enviar el token en el header
      },
    }
  );
  return response;
};
