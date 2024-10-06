import { SalesPersonSignatureData } from "../../types/salesperson-signature";
import { fetchWithCSRF } from "../api";

export const getDataFetch = (token: string) =>
  fetchWithCSRF("/api/salesperson-signature", { method: "GET" }, token);

export const getData = (
  token: string,
  uuid: string
): Promise<SalesPersonSignatureData> =>
  fetchWithCSRF(`/api/salesperson-signature/${uuid}`, { method: "GET" }, token);

export const createData = (
  token: string,
  signatureData: SalesPersonSignatureData
): Promise<SalesPersonSignatureData> =>
  fetchWithCSRF(
    "/api/salesperson-signature/store",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signatureData),
    },
    token
  );

export const updateData = (
  token: string,
  uuid: string,
  signatureData: SalesPersonSignatureData
): Promise<SalesPersonSignatureData> =>
  fetchWithCSRF(
    `/api/salesperson-signature/update/${uuid}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signatureData),
    },
    token
  );

export const deleteData = (token: string, uuid: string): Promise<void> =>
  fetchWithCSRF(
    `/api/salesperson-signature/delete/${uuid}`,
    { method: "DELETE" },
    token
  );
