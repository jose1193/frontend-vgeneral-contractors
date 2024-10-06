import { CustomerSignatureData } from "../../types/customer-signature";
import { fetchWithCSRF } from "../api";

export const getDataFetch = (token: string) =>
  fetchWithCSRF("/api/customer-signature", { method: "GET" }, token);

export const getData = (
  token: string,
  uuid: string
): Promise<CustomerSignatureData> =>
  fetchWithCSRF(`/api/customer-signature/${uuid}`, { method: "GET" }, token);

export const createData = (
  token: string,
  typeData: CustomerSignatureData
): Promise<CustomerSignatureData> =>
  fetchWithCSRF(
    "/api/customer-signature/store",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_id: typeData.customer_id,
        signature_data: typeData.signature_data,
      }),
    },
    token
  );

export const updateData = (
  token: string,
  uuid: string,
  typeData: CustomerSignatureData
): Promise<CustomerSignatureData> =>
  fetchWithCSRF(
    `/api/customer-signature/update/${uuid}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_id: typeData.customer_id,
        signature_data: typeData.signature_data,
      }),
    },
    token
  );

export const deleteData = (token: string, uuid: string): Promise<void> =>
  fetchWithCSRF(
    `/api/customer-signature/delete/${uuid}`,
    { method: "DELETE" },
    token
  );
