import { CustomerData } from "../../types/customer";
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

export const restoreData = (token: string, uuid: string) =>
  fetchWithCSRF(`/api/customer/restore/${uuid}`, { method: "PUT" }, token);

export const checkCustomersAvailable = async (token: string) => {
  const response = await fetchWithCSRF(`/api/customer/`, {}, token);
  return response;
};

export const checkEmailCustomerAvailable = (
  token: string,
  email: string,
  uuid?: string
): Promise<{
  success: boolean;
  data: { available: boolean; message: string };
  message: number;
}> =>
  fetchWithCSRF(
    `/api/customer/customer-email-check/${encodeURIComponent(email)}${
      uuid ? `?uuid=${uuid}` : ""
    }`,
    { method: "GET" },
    token
  );
