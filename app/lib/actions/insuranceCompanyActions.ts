import { InsuranceCompanyData } from "../../types/insurance-company";
import { fetchWithCSRF } from "../api";

export const getDataFetch = (token: string) =>
  fetchWithCSRF("/api/insurance-company", { method: "GET" }, token);

export const getData = (
  token: string,
  uuid: string
): Promise<InsuranceCompanyData> =>
  fetchWithCSRF(`/api/insurance-company/${uuid}`, { method: "GET" }, token);

export const createData = (
  token: string,
  companyData: InsuranceCompanyData
): Promise<InsuranceCompanyData> =>
  fetchWithCSRF(
    "/api/insurance-company/store",
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
  companyData: InsuranceCompanyData
): Promise<InsuranceCompanyData> =>
  fetchWithCSRF(
    `/api/insurance-company/update/${uuid}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(companyData),
    },
    token
  );

export const deleteData = (token: string, uuid: string): Promise<void> =>
  fetchWithCSRF(
    `/api/insurance-company/delete/${uuid}`,
    { method: "DELETE" },
    token
  );
