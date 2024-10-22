import { AllianceCompanyData } from "../../types/alliance-company";
import { fetchWithCSRF } from "../api";

export const getDataFetch = (token: string) =>
  fetchWithCSRF("/api/alliance-company", { method: "GET" }, token);

export const getData = (
  token: string,
  uuid: string
): Promise<AllianceCompanyData> =>
  fetchWithCSRF(`/api/alliance-company/${uuid}`, { method: "GET" }, token);

export const createData = (
  token: string,
  companyData: AllianceCompanyData
): Promise<AllianceCompanyData> =>
  fetchWithCSRF(
    "/api/alliance-company/store",
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
  companyData: AllianceCompanyData
): Promise<AllianceCompanyData> =>
  fetchWithCSRF(
    `/api/alliance-company/update/${uuid}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(companyData),
    },
    token
  );

export const deleteData = (token: string, uuid: string): Promise<void> =>
  fetchWithCSRF(
    `/api/alliance-company/delete/${uuid}`,
    { method: "DELETE" },
    token
  );
