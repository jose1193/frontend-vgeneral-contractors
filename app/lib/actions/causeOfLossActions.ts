import { CauseOfLossData } from "../../types/cause-of-loss"; // Asegúrate de que esto apunta al archivo correcto
import { fetchWithCSRF } from "../api";

export const getCauseOfLosses = (token: string) =>
  fetchWithCSRF("/api/cause-of-losses", { method: "GET" }, token);

export const getCauseOfLoss = (
  token: string,
  uuid: string
): Promise<CauseOfLossData> =>
  fetchWithCSRF(`/api/cause-of-losses/${uuid}`, { method: "GET" }, token);

export const createCauseOfLoss = (
  token: string,
  causeData: CauseOfLossData
): Promise<CauseOfLossData> =>
  fetchWithCSRF(
    "/api/cause-of-losses/store",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(causeData),
    },
    token
  );

export const updateCauseOfLoss = (
  token: string,
  uuid: string,
  causeData: CauseOfLossData
): Promise<CauseOfLossData> =>
  fetchWithCSRF(
    `/api/cause-of-losses/update/${uuid}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(causeData),
    },
    token
  );

export const deleteCauseOfLoss = (token: string, uuid: string): Promise<void> =>
  fetchWithCSRF(
    `/api/cause-of-losses/delete/${uuid}`,
    { method: "DELETE" },
    token
  );
