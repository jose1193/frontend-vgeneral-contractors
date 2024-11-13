import { DocumentTemplateData } from "../../types/document-template";
import { fetchWithCSRF } from "../api";

export const getTemplatesFetch = (token: string) =>
  fetchWithCSRF("/api/document-template", { method: "GET" }, token);

export const getData = (
  token: string,
  uuid: string
): Promise<DocumentTemplateData> =>
  fetchWithCSRF(`/api/document-template/${uuid}`, { method: "GET" }, token);

export const createTemplate = (
  token: string,
  templateData: DocumentTemplateData
): Promise<DocumentTemplateData> => {
  const formData = new FormData();

  Object.entries(templateData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  return fetchWithCSRF(
    "/api/document-template/store",
    {
      method: "POST",
      body: formData,
    },
    token
  );
};

export const updateTemplate = (
  token: string,
  uuid: string,
  templateData: DocumentTemplateData
): Promise<DocumentTemplateData> => {
  const formData = new FormData();

  Object.entries(templateData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  return fetchWithCSRF(
    `/api/document-template/update/${uuid}`,
    {
      method: "POST",
      body: formData,
    },
    token
  );
};

export const deleteTemplate = (token: string, uuid: string): Promise<void> =>
  fetchWithCSRF(
    `/api/document-template/delete/${uuid}`,
    { method: "DELETE" },
    token
  );
