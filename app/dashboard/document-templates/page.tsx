"use client";

import React, { Suspense } from "react";
import { useDocumentTemplates } from "../../../src/hooks/useDocumentTemplate";
import DocumentTemplateList from "../../../src/components/Document-Template/DocumentTemplateList";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ButtonCreate from "../../components/ButtonCreate";

const DocumentTemplatesPage = () => {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const userRole = session?.user?.user_role;

  const { documentTemplates, deleteDocumentTemplate } =
    useDocumentTemplates(token);

  return (
    <Suspense>
      <Box sx={{ width: "100%", ml: -6, overflow: "hidden" }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            textAlign: "left",
            mb: 3,
            fontSize: {
              xs: "1.5rem",
              sm: "1.75rem",
              md: "2rem",
              lg: "2.25rem",
            },
            fontWeight: "bold",
            ml: 4,
          }}
        >
          Document Templates
        </Typography>

        <Link href="/dashboard/document-templates/create" passHref>
          <ButtonCreate sx={{ ml: 4 }}>Create Document Template</ButtonCreate>
        </Link>

        <DocumentTemplateList
          documentTemplates={documentTemplates}
          onDelete={deleteDocumentTemplate}
          userRole={userRole}
        />
      </Box>
    </Suspense>
  );
};

export default DocumentTemplatesPage;
