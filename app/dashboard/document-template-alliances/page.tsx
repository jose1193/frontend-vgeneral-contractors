"use client";

import React, { Suspense } from "react";
import { useDocumentTemplatesAlliance } from "../../../src/hooks/useDocumentTemplatesAlliance";
import DocumentTemplateAllianceList from "../../../src/components/Document-Template-Alliance/DocumentTemplateAllianceList";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ButtonCreate from "../../components/ButtonCreate";

export default function DocumentTemplateAlliancePage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const userRole = session?.user?.user_role;

  const { documentTemplatesAlliance, deleteDocumentTemplateAlliance } =
    useDocumentTemplatesAlliance(token);

  return (
    <Suspense fallback={<div>Loading...</div>}>
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
          Alliance Document Templates
        </Typography>

        {userRole !== "Salesperson" && (
          <Link href="/dashboard/document-template-alliances/create" passHref>
            <ButtonCreate sx={{ ml: 4 }}>
              Create Alliance Document Template
            </ButtonCreate>
          </Link>
        )}

        <DocumentTemplateAllianceList
          documentTemplates={documentTemplatesAlliance}
          onDelete={deleteDocumentTemplateAlliance}
          userRole={userRole}
        />
      </Box>
    </Suspense>
  );
}
