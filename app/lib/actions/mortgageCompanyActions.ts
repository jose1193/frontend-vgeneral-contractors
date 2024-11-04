import { MortgageCompanyData } from "../../types/mortgage-company";
import { fetchWithCSRF } from "../api";

export const getDataFetch = (token: string) =>
  fetchWithCSRF("/api/mortgage-company", { method: "GET" }, token);

export const getData = (
  token: string,
  uuid: string
): Promise<MortgageCompanyData> =>
  fetchWithCSRF(`/api/mortgage-company/${uuid}`, { method: "GET" }, token);

export const createData = (
  token: string,
  companyData: MortgageCompanyData
): Promise<MortgageCompanyData> =>
  fetchWithCSRF(
    "/api/mortgage-company/store",
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
  companyData: MortgageCompanyData
): Promise<MortgageCompanyData> =>
  fetchWithCSRF(
    `/api/mortgage-company/update/${uuid}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(companyData),
    },
    token
  );

export const deleteData = (token: string, uuid: string): Promise<void> =>
  fetchWithCSRF(
    `/api/mortgage-company/delete/${uuid}`,
    { method: "DELETE" },
    token
  );
