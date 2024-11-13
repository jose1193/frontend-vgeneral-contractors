import { useState, useEffect, useCallback } from "react";
import { DocumentTemplateAdjusterData } from "../../app/types/document-template-adjuster";
import * as documentTemplateAdjusterActions from "../../app/lib/actions/documentTemplateAdjusterActions";

export const useDocumentTemplateAdjusters = (token: string) => {
  const [documentTemplateAdjusters, setDocumentTemplateAdjusters] = useState<
    DocumentTemplateAdjusterData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocumentTemplateAdjusters = useCallback(async () => {
    try {
      setLoading(true);
      const response =
        await documentTemplateAdjusterActions.getTemplatesAdjusterFetch(token);
      if (response.success && Array.isArray(response.data)) {
        setDocumentTemplateAdjusters(response.data);
        setError(null);
      } else {
        console.error("Fetched data is not in the expected format:", response);
        setDocumentTemplateAdjusters([]);
        setError("Received invalid data format");
      }
    } catch (err) {
      console.error("Error fetching document template adjusters:", err);
      setDocumentTemplateAdjusters([]);
      setError("Failed to fetch document template adjusters");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDocumentTemplateAdjusters();
  }, [fetchDocumentTemplateAdjusters]);

  const createDocumentTemplateAdjuster = useCallback(
    async (templateData: DocumentTemplateAdjusterData) => {
      try {
        const newTemplate =
          await documentTemplateAdjusterActions.createTemplateAdjuster(
            token,
            templateData
          );
        setDocumentTemplateAdjusters((prevTemplates) => [
          ...prevTemplates,
          newTemplate,
        ]);
        return newTemplate;
      } catch (err) {
        console.error("Error creating document template adjuster:", err);
        setError("Failed to create document template adjuster");
        throw err;
      }
    },
    [token]
  );

  const updateDocumentTemplateAdjuster = useCallback(
    async (uuid: string, templateData: DocumentTemplateAdjusterData) => {
      try {
        const updatedTemplate =
          await documentTemplateAdjusterActions.updateTemplateAdjuster(
            token,
            uuid,
            templateData
          );
        setDocumentTemplateAdjusters((prevTemplates) =>
          prevTemplates.map((template) =>
            template.uuid === uuid ? updatedTemplate : template
          )
        );
        return updatedTemplate;
      } catch (err) {
        console.error("Error updating document template adjuster:", err);
        setError("Failed to update document template adjuster");
        throw err;
      }
    },
    [token]
  );

  const deleteDocumentTemplateAdjuster = useCallback(
    async (uuid: string) => {
      try {
        await documentTemplateAdjusterActions.deleteTemplateAdjuster(
          token,
          uuid
        );
        // Primero actualizamos el estado local
        setDocumentTemplateAdjusters((prevTemplates) =>
          prevTemplates.filter((template) => template.uuid !== uuid)
        );
        // Luego refrescamos la lista del servidor
        await fetchDocumentTemplateAdjusters();
      } catch (err) {
        console.error("Error deleting document template adjuster:", err);
        setError("Failed to delete document template adjuster");
        throw err;
      }
    },
    [token, fetchDocumentTemplateAdjusters]
  );

  return {
    documentTemplateAdjusters,
    loading,
    error,
    createDocumentTemplateAdjuster,
    updateDocumentTemplateAdjuster,
    deleteDocumentTemplateAdjuster,
    refreshDocumentTemplateAdjusters: fetchDocumentTemplateAdjusters,
  };
};
