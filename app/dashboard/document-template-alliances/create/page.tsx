"use client";

import React, { Suspense } from "react";
import { useDocumentTemplatesAlliance } from "../../../../src/hooks/useDocumentTemplatesAlliance";
import DocumentTemplateAllianceForm from "../../../../src/components/Document-Template-Alliance/DocumentTemplateAllianceForm";
import { Box, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { DocumentTemplateAllianceFormData } from "../../../../app/types/document-template-alliance";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import TypographyHeading from "../../../components/TypographyHeading";
import { PERMISSIONS } from "../../../../src/config/permissions";

const DocumentTemplateAlliancePage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const token = session?.accessToken as string;
  const { createDocumentTemplateAlliance } =
    useDocumentTemplatesAlliance(token);

  const handleSubmit = async (formData: DocumentTemplateAllianceFormData) => {
    await createDocumentTemplateAlliance({
      ...formData,
      uuid: "",
    });
    console.log("Document Template Alliance data to submit:", formData);
    router.push("/dashboard/document-template-alliances");
  };

  return (
    <Suspense>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",

          mb: 10,
          p: { xs: 1, lg: 2 },
        }}
      >
        <TypographyHeading>Create Document Template Alliance</TypographyHeading>

        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <DocumentTemplateAllianceForm onSubmit={handleSubmit} />{" "}
          {/* Asegúrate de que este componente exista */}
        </Paper>
      </Box>
    </Suspense>
  );
};
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_DOCUMENTS],
};

export default withRoleProtection(
  DocumentTemplateAlliancePage,
  protectionConfig
);
