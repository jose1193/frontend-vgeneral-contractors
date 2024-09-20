import { PropertyData } from "../../types/property";
import { fetchWithCSRF } from "../api";

export const getDataFetch = (token: string) =>
  fetchWithCSRF("/api/properties", { method: "GET" }, token);

export const getData = (token: string, uuid: string): Promise<PropertyData> =>
  fetchWithCSRF(`/api/properties/${uuid}`, { method: "GET" }, token);

export const createData = (
  token: string,
  typeData: PropertyData
): Promise<PropertyData> =>
  fetchWithCSRF(
    "/api/properties/store",
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
  typeData: PropertyData
): Promise<PropertyData> =>
  fetchWithCSRF(
    `/api/properties/update/${uuid}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(typeData),
    },
    token
  );

export const deleteData = (token: string, uuid: string): Promise<void> =>
  fetchWithCSRF(`/api/properties/delete/${uuid}`, { method: "DELETE" }, token);

export const checkPropertiesAvailable = async (token: string) => {
  const response = await fetchWithCSRF(`/api/properties/`, {}, token);
  return response;
};
