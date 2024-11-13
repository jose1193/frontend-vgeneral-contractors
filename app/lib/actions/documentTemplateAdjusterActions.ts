import { DocumentTemplateAdjusterData } from "../../types/document-template-adjuster";
import { fetchWithCSRF } from "../api";

export const getTemplatesAdjusterFetch = (token: string) =>
  fetchWithCSRF("/api/document-template-adjuster", { method: "GET" }, token);

export const getDataAdjuster = (
  token: string,
  uuid: string
): Promise<DocumentTemplateAdjusterData> =>
  fetchWithCSRF(
    `/api/document-template-adjuster/${uuid}`,
    { method: "GET" },
    token
  );

export const createTemplateAdjuster = (
  token: string,
  templateData: DocumentTemplateAdjusterData
): Promise<DocumentTemplateAdjusterData> => {
  const formData = new FormData();

  Object.entries(templateData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  return fetchWithCSRF(
    "/api/document-template-adjuster/store",
    {
      method: "POST",
      body: formData,
    },
    token
  );
};

export const updateTemplateAdjuster = (
  token: string,
  uuid: string,
  templateData: DocumentTemplateAdjusterData
): Promise<DocumentTemplateAdjusterData> => {
  const formData = new FormData();

  Object.entries(templateData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  return fetchWithCSRF(
    `/api/document-template-adjuster/update/${uuid}`,
    {
      method: "POST",
      body: formData,
    },
    token
  );
};

export const deleteTemplateAdjuster = (
  token: string,
  uuid: string
): Promise<void> =>
  fetchWithCSRF(
    `/api/document-template-adjuster/delete/${uuid}`,
    { method: "DELETE" },
    token
  );
