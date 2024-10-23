import { useState, useEffect, useCallback } from "react";
import { DocumentTemplateData } from "../../app/types/document-template";
import * as documentTemplateActions from "../../app/lib/actions/documentTemplateActions";

export const useDocumentTemplates = (token: string) => {
  const [documentTemplates, setDocumentTemplates] = useState<
    DocumentTemplateData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocumentTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const response = await documentTemplateActions.getTemplatesFetch(token);
      if (response.success && Array.isArray(response.data)) {
        setDocumentTemplates(response.data);
        setError(null);
      } else {
        console.error("Fetched data is not in the expected format:", response);
        setDocumentTemplates([]);
        setError("Received invalid data format");
      }
    } catch (err) {
      console.error("Error fetching document templates:", err);
      setDocumentTemplates([]);
      setError("Failed to fetch document templates");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDocumentTemplates();
  }, [fetchDocumentTemplates]);

  const createDocumentTemplate = useCallback(
    async (templateData: DocumentTemplateData) => {
      try {
        const newTemplate = await documentTemplateActions.createTemplate(
          token,
          templateData
        );
        setDocumentTemplates((prevTemplates) => [
          ...prevTemplates,
          newTemplate,
        ]);
        return newTemplate;
      } catch (err) {
        console.error("Error creating document template:", err);
        setError("Failed to create document template");
        throw err;
      }
    },
    [token]
  );

  const updateDocumentTemplate = useCallback(
    async (uuid: string, templateData: DocumentTemplateData) => {
      try {
        const updatedTemplate = await documentTemplateActions.updateTemplate(
          token,
          uuid,
          templateData
        );
        setDocumentTemplates((prevTemplates) =>
          prevTemplates.map((template) =>
            template.uuid === uuid ? updatedTemplate : template
          )
        );
        return updatedTemplate;
      } catch (err) {
        console.error("Error updating document template:", err);
        setError("Failed to update document template");
        throw err;
      }
    },
    [token]
  );

  const deleteDocumentTemplate = useCallback(
    async (uuid: string) => {
      try {
        await documentTemplateActions.deleteTemplate(token, uuid);
        setDocumentTemplates((prevTemplates) =>
          prevTemplates.filter((template) => template.uuid !== uuid)
        );
      } catch (err) {
        console.error("Error deleting document template:", err);
        setError("Failed to delete document template");
        throw err;
      }
    },
    [token]
  );

  return {
    documentTemplates,
    loading,
    error,
    createDocumentTemplate,
    updateDocumentTemplate,
    deleteDocumentTemplate,
    refreshDocumentTemplates: fetchDocumentTemplates,
  };
};
