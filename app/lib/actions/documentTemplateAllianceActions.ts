import { DocumentTemplateAllianceData } from "../../types/document-template-alliance";
import { fetchWithCSRF } from "../api";

export const getTemplatesAllianceFetch = (token: string) =>
  fetchWithCSRF("/api/document-template-alliance", { method: "GET" }, token);

export const getData = (
  token: string,
  uuid: string
): Promise<DocumentTemplateAllianceData> =>
  fetchWithCSRF(
    `/api/document-template-alliance/${uuid}`,
    { method: "GET" },
    token
  );

export const createAllianceTemplate = (
  token: string,
  templateData: DocumentTemplateAllianceData
): Promise<DocumentTemplateAllianceData> => {
  const formData = new FormData();

  Object.entries(templateData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  return fetchWithCSRF(
    "/api/document-template-alliance/store",
    {
      method: "POST",
      body: formData,
    },
    token
  );
};

export const updateAllianceTemplate = (
  token: string,
  uuid: string,
  templateData: DocumentTemplateAllianceData
): Promise<DocumentTemplateAllianceData> => {
  const formData = new FormData();

  Object.entries(templateData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  return fetchWithCSRF(
    `/api/document-template-alliance/update/${uuid}`,
    {
      method: "PUT",
      body: formData,
    },
    token
  );
};

export const deleteAllianceTemplate = (
  token: string,
  uuid: string
): Promise<void> =>
  fetchWithCSRF(
    `/api/document-template-alliance/delete/${uuid}`,
    { method: "DELETE" },
    token
  );
