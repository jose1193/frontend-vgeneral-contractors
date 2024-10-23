"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getData } from "../../../../lib/actions/documentTemplateActions";
import { useDocumentTemplates } from "../../../../../src/hooks/useDocumentTemplate";
import DocumentTemplateForm from "@/components/Document-Template/DocumentTemplateForm";
import {
  DocumentTemplateData,
  DocumentTemplateFormData,
} from "../../../../types/document-template";
import {
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GeneralFormSkeleton from "@/components/skeletons/GeneralFormSkeleton";
import { useSession } from "next-auth/react";
import { TEMPLATE_TYPES } from "../../../../../app/types/document-template";
function EditDocumentTemplatePage() {
  const { uuid } = useParams();
  const router = useRouter();
  const [documentTemplate, setDocumentTemplate] =
    useState<DocumentTemplateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { updateDocumentTemplate } = useDocumentTemplates(token);

  useEffect(() => {
    const fetchDocumentTemplate = async () => {
      try {
        const data = await getData(token, uuid as string);
        setDocumentTemplate(data);
      } catch (err) {
        setError("No document template found");
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentTemplate();
  }, [uuid, token]);

  const handleSubmit = async (formData: DocumentTemplateFormData) => {
    if (!documentTemplate?.uuid) return;

    // Convertir DocumentTemplateFormData a DocumentTemplateData
    const updatedData: DocumentTemplateData = {
      ...formData,
      uuid: documentTemplate.uuid,
    };

    await updateDocumentTemplate(uuid as string, updatedData);
    router.push("/dashboard/document-templates");
  };

  if (loading) {
    return <GeneralFormSkeleton />;
  }

  // Convertir DocumentTemplateData a DocumentTemplateFormData para el formulario
  const formInitialData: Partial<DocumentTemplateFormData> = {
    template_name: documentTemplate?.template_name ?? "",
    template_description: documentTemplate?.template_description ?? null,
    template_type: documentTemplate?.template_type ?? TEMPLATE_TYPES[0],
    template_path: documentTemplate?.template_path,
    created_at: documentTemplate?.created_at ?? new Date().toISOString(),
    updated_at: documentTemplate?.updated_at ?? new Date().toISOString(),
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "hidden",
        ml: -7,
        mb: 10,
        p: { xs: 3, sm: 3, md: 2, lg: 4 },
        mt: -3,
      }}
    >
      <Button
        variant="outlined"
        onClick={() => window.history.back()}
        startIcon={<ArrowBackIcon />}
        style={{ marginBottom: "20px" }}
      >
        Back
      </Button>
      <Typography
        variant="h4"
        sx={{
          fontSize: {
            xs: "1.5rem",
            sm: "1.75rem",
            md: "2rem",
            lg: "2.25rem",
          },
          my: 3,
          fontWeight: "bold",
        }}
        component="h1"
        gutterBottom
      >
        Edit Document Template
      </Typography>
      {error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : documentTemplate ? (
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <DocumentTemplateForm
            initialData={formInitialData}
            onSubmit={handleSubmit}
          />
        </Paper>
      ) : (
        <Typography variant="h6" color="error">
          No document template found
        </Typography>
      )}
    </Box>
  );
}

export default EditDocumentTemplatePage;
