import { CustomerData } from "../../types/customer"; // Asegúrate de que esto apunta al archivo correcto
import { fetchWithCSRF } from "../api";

export const getDataFetch = (token: string) =>
  fetchWithCSRF("/api/customer", { method: "GET" }, token);

export const getData = (token: string, uuid: string): Promise<CustomerData> =>
  fetchWithCSRF(`/api/customer/${uuid}`, { method: "GET" }, token);

export const createData = (
  token: string,
  typeData: CustomerData
): Promise<CustomerData> =>
  fetchWithCSRF(
    "/api/customer/store",
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
  typeData: CustomerData
): Promise<CustomerData> =>
  fetchWithCSRF(
    `/api/customer/update/${uuid}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(typeData),
    },
    token
  );

export const deleteData = (token: string, uuid: string): Promise<void> =>
  fetchWithCSRF(`/api/customer/delete/${uuid}`, { method: "DELETE" }, token);

export const checkCustomersAvailable = async (token: string) => {
  const response = await fetchWithCSRF(`/api/customer/`, {}, token);
  return response;
};
