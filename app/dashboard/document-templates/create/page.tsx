"use client";

import React, { Suspense } from "react";
import { useDocumentTemplates } from "../../../../src/hooks/useDocumentTemplate";
import DocumentTemplateForm from "../../../../src/components/Document-Template/DocumentTemplateForm";
import { Box, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { DocumentTemplateFormData } from "../../../../app/types/document-template";
import { useSession } from "next-auth/react";
import TypographyHeading from "../../../components/TypographyHeading";

const CreateDocumentTemplatePage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const token = session?.accessToken as string;
  const { createDocumentTemplate } = useDocumentTemplates(token);

  const handleSubmit = async (formData: DocumentTemplateFormData) => {
    await createDocumentTemplate({
      ...formData,
      uuid: "", // Se generará en el backend
    });
    console.log("Document Template data to submit:", formData);
    router.push("/dashboard/document-templates");
  };

  return (
    <Suspense>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          ml: -7,
          mb: 10,
          mt: -2,
          p: { xs: 3, sm: 3, md: 2, lg: 4 },
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

        <TypographyHeading>Create Document Template</TypographyHeading>

        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <DocumentTemplateForm onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
};

export default CreateDocumentTemplatePage;
