import { TypeDamageData } from "../../types/type-damage"; // Asegúrate de que esto apunta al archivo correcto
import { fetchWithCSRF } from "../api";

export const getTypeDamages = (token: string) =>
  fetchWithCSRF("/api/type-damage", { method: "GET" }, token);

export const getTypeDamage = (
  token: string,
  uuid: string
): Promise<TypeDamageData> =>
  fetchWithCSRF(`/api/type-damage/${uuid}`, { method: "GET" }, token);

export const createTypeDamage = (
  token: string,
  typeData: TypeDamageData
): Promise<TypeDamageData> =>
  fetchWithCSRF(
    "/api/type-damage/store",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(typeData),
    },
    token
  );

export const updateTypeDamage = (
  token: string,
  uuid: string,
  typeData: TypeDamageData
): Promise<TypeDamageData> =>
  fetchWithCSRF(
    `/api/type-damage/update/${uuid}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(typeData),
    },
    token
  );

export const deleteTypeDamage = (token: string, uuid: string): Promise<void> =>
  fetchWithCSRF(`/api/type-damage/delete/${uuid}`, { method: "DELETE" }, token);
