"use client";

import React, { Suspense } from "react";
import { useDocumentTemplateAdjusters } from "../../../../src/hooks/useDocumentTemplateAdjuster";
import DocumentTemplateAdjusterForm from "../../../../src/components/Document-Template-Adjuster/DocumentTemplateAdjusterForm";
import { Box, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { DocumentTemplateAdjusterFormData } from "../../../../app/types/document-template-adjuster";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import TypographyHeading from "../../../components/TypographyHeading";
import { PERMISSIONS } from "../../../../src/config/permissions";

const DocumentTemplateAdjusterCreatePage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const token = session?.accessToken as string;
  const { createDocumentTemplateAdjuster } =
    useDocumentTemplateAdjusters(token);

  const handleSubmit = async (formData: DocumentTemplateAdjusterFormData) => {
    await createDocumentTemplateAdjuster({
      ...formData,
      uuid: "",
    });
    console.log("Document Template Adjuster data to submit:", formData);
    router.push("/dashboard/document-template-adjusters");
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
        <TypographyHeading>Create Document Template Adjuster</TypographyHeading>

        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <DocumentTemplateAdjusterForm onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_DOCUMENTS],
};

export default withRoleProtection(
  DocumentTemplateAdjusterCreatePage,
  protectionConfig
);
