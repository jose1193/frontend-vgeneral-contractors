import { CompanySignatureData } from "../../types/company-signature";
import { fetchWithCSRF } from "../api";

export const getDataFetch = (token: string) =>
  fetchWithCSRF("/api/company-signature", { method: "GET" }, token);

export const getData = (
  token: string,
  uuid: string
): Promise<CompanySignatureData> =>
  fetchWithCSRF(`/api/company-signature/${uuid}`, { method: "GET" }, token);

export const createData = (
  token: string,
  typeData: CompanySignatureData
): Promise<CompanySignatureData> =>
  fetchWithCSRF(
    "/api/company-signature/store",
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
  typeData: CompanySignatureData
): Promise<CompanySignatureData> =>
  fetchWithCSRF(
    `/api/company-signature/update/${uuid}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(typeData),
    },
    token
  );

export const deleteData = (token: string, uuid: string): Promise<void> =>
  fetchWithCSRF(
    `/api/company-signature/delete/${uuid}`,
    { method: "DELETE" },
    token
  );
