"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useDocumentTemplateAdjusters } from "../../../../../src/hooks/useDocumentTemplateAdjuster";
import DocumentTemplateAdjusterForm from "@/components/Document-Template-Adjuster/DocumentTemplateAdjusterForm";
import {
  DocumentTemplateAdjusterData,
  DocumentTemplateAdjusterFormData,
} from "../../../../types/document-template-adjuster";
import { Typography, Box, Paper } from "@mui/material";
import GeneralFormSkeleton from "@/components/skeletons/GeneralFormSkeleton";
import { useSession } from "next-auth/react";
import { TEMPLATE_TYPES_ADJUSTER } from "../../../../../app/types/document-template-adjuster";
import { withRoleProtection } from "../../../../../src/components/withRoleProtection";
import TypographyHeading from "../../../../components/TypographyHeading";
import { PERMISSIONS } from "../../../../../src/config/permissions";
import useFormSnackbar from "../../../../../src/hooks/useFormSnackbar";
import FeedbackSnackbar from "../../../../../app/components/FeedbackSnackbar";

function EditDocumentTemplateAdjusterPage() {
  const { uuid } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const {
    documentTemplateAdjusters,
    updateDocumentTemplateAdjuster,
    loading,
    error,
  } = useDocumentTemplateAdjusters(token);

  const { snackbar, setSnackbar, handleSnackbarClose } = useFormSnackbar();

  const documentTemplate = documentTemplateAdjusters.find(
    (template) => template.uuid === uuid
  );

  const handleSubmit = async (formData: DocumentTemplateAdjusterFormData) => {
    if (!documentTemplate?.uuid) return;

    try {
      const updatedData: DocumentTemplateAdjusterData = {
        ...formData,
        uuid: documentTemplate.uuid,
      };

      await updateDocumentTemplateAdjuster(uuid as string, updatedData);
      setSnackbar({
        open: true,
        message: "Document template adjuster updated successfully",
        severity: "success",
      });
      router.push("/dashboard/document-template-adjusters");
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update document template adjuster",
        severity: "error",
      });
    }
  };

  if (loading) {
    return <GeneralFormSkeleton />;
  }

  const formInitialData: Partial<DocumentTemplateAdjusterFormData> = {
    template_description_adjuster:
      documentTemplate?.template_description_adjuster ?? null,
    template_type_adjuster:
      documentTemplate?.template_type_adjuster ?? TEMPLATE_TYPES_ADJUSTER[0],
    template_path_adjuster: documentTemplate?.template_path_adjuster,
    public_adjuster_id: documentTemplate?.public_adjuster_id ?? null,
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "hidden",
        mb: 10,
        p: { xs: 1, lg: 2 },
      }}
    >
      <TypographyHeading>Edit Document Template Adjuster</TypographyHeading>

      {error && (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      )}

      <Paper
        elevation={3}
        style={{
          padding: "20px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {documentTemplate ? (
          <DocumentTemplateAdjusterForm
            initialData={formInitialData}
            onSubmit={handleSubmit}
          />
        ) : (
          <Typography variant="h6" color="error">
            No document template adjuster found
          </Typography>
        )}
      </Paper>

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_DOCUMENTS],
};

export default withRoleProtection(
  EditDocumentTemplateAdjusterPage,
  protectionConfig
);
