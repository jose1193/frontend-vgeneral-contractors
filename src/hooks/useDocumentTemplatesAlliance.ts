import { useState, useEffect, useCallback } from "react";
import { DocumentTemplateAllianceData } from "../../app/types/document-template-alliance";
import * as documentTemplateAllianceActions from "../../app/lib/actions/documentTemplateAllianceActions";

export const useDocumentTemplatesAlliance = (token: string) => {
  const [documentTemplatesAlliance, setDocumentTemplatesAlliance] = useState<
    DocumentTemplateAllianceData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocumentTemplatesAlliance = useCallback(async () => {
    try {
      setLoading(true);
      const response =
        await documentTemplateAllianceActions.getTemplatesAllianceFetch(token);
      if (response.success && Array.isArray(response.data)) {
        setDocumentTemplatesAlliance(response.data);
        setError(null);
      } else {
        console.error("Fetched data is not in the expected format:", response);
        setDocumentTemplatesAlliance([]);
        setError("Received invalid data format");
      }
    } catch (err) {
      console.error("Error fetching document templates alliance:", err);
      setDocumentTemplatesAlliance([]);
      setError("Failed to fetch document templates alliance");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDocumentTemplatesAlliance();
  }, [fetchDocumentTemplatesAlliance]);

  const createDocumentTemplateAlliance = useCallback(
    async (templateData: DocumentTemplateAllianceData) => {
      try {
        const newTemplate =
          await documentTemplateAllianceActions.createAllianceTemplate(
            token,
            templateData
          );
        setDocumentTemplatesAlliance((prevTemplates) => [
          ...prevTemplates,
          newTemplate,
        ]);
        return newTemplate;
      } catch (err) {
        console.error("Error creating document template alliance:", err);
        setError("Failed to create document template alliance");
        throw err;
      }
    },
    [token]
  );

  const updateDocumentTemplateAlliance = useCallback(
    async (uuid: string, templateData: DocumentTemplateAllianceData) => {
      try {
        const updatedTemplate =
          await documentTemplateAllianceActions.updateAllianceTemplate(
            token,
            uuid,
            templateData
          );
        setDocumentTemplatesAlliance((prevTemplates) =>
          prevTemplates.map((template) =>
            template.uuid === uuid ? updatedTemplate : template
          )
        );
        return updatedTemplate;
      } catch (err) {
        console.error("Error updating document template alliance:", err);
        setError("Failed to update document template alliance");
        throw err;
      }
    },
    [token]
  );

  const deleteDocumentTemplateAlliance = useCallback(
    async (uuid: string) => {
      try {
        await documentTemplateAllianceActions.deleteAllianceTemplate(
          token,
          uuid
        );
        setDocumentTemplatesAlliance((prevTemplates) =>
          prevTemplates.filter((template) => template.uuid !== uuid)
        );
      } catch (err) {
        console.error("Error deleting document template alliance:", err);
        setError("Failed to delete document template alliance");
        throw err;
      }
    },
    [token]
  );

  return {
    documentTemplatesAlliance,
    loading,
    error,
    createDocumentTemplateAlliance,
    updateDocumentTemplateAlliance,
    deleteDocumentTemplateAlliance,
    refreshDocumentTemplatesAlliance: fetchDocumentTemplatesAlliance,
  };
};
