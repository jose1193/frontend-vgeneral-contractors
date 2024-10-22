import { PublicCompanyData } from "../../types/public-company";
import { fetchWithCSRF } from "../api";

export const getDataFetch = (token: string) =>
  fetchWithCSRF("/api/public-company", { method: "GET" }, token);

export const getData = (
  token: string,
  uuid: string
): Promise<PublicCompanyData> =>
  fetchWithCSRF(`/api/public-company/${uuid}`, { method: "GET" }, token);

export const createData = (
  token: string,
  companyData: PublicCompanyData
): Promise<PublicCompanyData> =>
  fetchWithCSRF(
    "/api/public-company/store",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(companyData),
    },
    token
  );

export const updateData = (
  token: string,
  uuid: string,
  companyData: PublicCompanyData
): Promise<PublicCompanyData> =>
  fetchWithCSRF(
    `/api/public-company/update/${uuid}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(companyData),
    },
    token
  );

export const deleteData = (token: string, uuid: string): Promise<void> =>
  fetchWithCSRF(
    `/api/public-company/delete/${uuid}`,
    { method: "DELETE" },
    token
  );
