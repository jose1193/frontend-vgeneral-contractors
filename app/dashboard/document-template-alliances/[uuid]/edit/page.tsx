"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  DocumentTemplateAllianceData,
  DocumentTemplateAllianceFormData,
} from "../../../../../app/types/document-template-alliance";
import { getData } from "../../../../lib/actions/documentTemplateAllianceActions";
import { useDocumentTemplatesAlliance } from "../../../../../src/hooks/useDocumentTemplatesAlliance";
import DocumentTemplateAllianceForm from "../../../../../src/components/Document-Template-Alliance/DocumentTemplateAllianceForm";
import { Box, Paper, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import GeneralFormSkeleton from "@/components/skeletons/GeneralFormSkeleton"; // Asegúrate de que este componente existe
import { TEMPLATE_TYPES_ALLIANCE } from "../../../../../app/types/document-template-alliance";
import { withRoleProtection } from "../../../../../src/components/withRoleProtection";
import TypographyHeading from "../../../../components/TypographyHeading";
import { PERMISSIONS } from "../../../../../src/config/permissions";
const DocumentTemplateAlliancePage = () => {
  const { uuid } = useParams(); // Obtiene el UUID de la URL
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const [documentTemplateAlliance, setDocumentTemplateAlliance] =
    useState<DocumentTemplateAllianceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { updateDocumentTemplateAlliance } =
    useDocumentTemplatesAlliance(token);

  useEffect(() => {
    const fetchDocumentTemplateAlliance = async () => {
      try {
        const data = await getData(token, uuid as string);
        setDocumentTemplateAlliance(data);
      } catch (err) {
        setError("No document template alliance found");
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentTemplateAlliance();
  }, [uuid, token]);

  const handleSubmit = async (formData: DocumentTemplateAllianceFormData) => {
    if (!documentTemplateAlliance?.uuid) return;

    // Actualiza la información de la plantilla de alianza
    const updatedData: DocumentTemplateAllianceData = {
      ...formData,
      uuid: documentTemplateAlliance.uuid,
    };

    await updateDocumentTemplateAlliance(uuid as string, updatedData);
    router.push("/dashboard/document-template-alliances"); 
  };

  if (loading) {
    return <GeneralFormSkeleton />;
  }

  const formInitialData: Partial<DocumentTemplateAllianceFormData> = {
    template_name_alliance:
      documentTemplateAlliance?.template_name_alliance ?? "",
    template_description_alliance:
      documentTemplateAlliance?.template_description_alliance ?? null,
    template_type_alliance:
      documentTemplateAlliance?.template_type_alliance ??
      TEMPLATE_TYPES_ALLIANCE[0],
    template_path_alliance: documentTemplateAlliance?.template_path_alliance,
    created_at:
      documentTemplateAlliance?.created_at ?? new Date().toISOString(),
    updated_at:
      documentTemplateAlliance?.updated_at ?? new Date().toISOString(),
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
      <TypographyHeading> Edit Document Template Alliance</TypographyHeading>
      {error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : documentTemplateAlliance ? (
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <DocumentTemplateAllianceForm
            initialData={formInitialData}
            onSubmit={handleSubmit}
          />
        </Paper>
      ) : (
        <Typography variant="h6" color="error">
          No document template alliance found
        </Typography>
      )}
    </Box>
  );
};
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_DOCUMENTS],
};

export default withRoleProtection(
  DocumentTemplateAlliancePage,
  protectionConfig
);
