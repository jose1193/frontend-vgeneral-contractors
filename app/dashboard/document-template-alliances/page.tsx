"use client";

import React, { Suspense } from "react";
import { useDocumentTemplatesAlliance } from "../../../src/hooks/useDocumentTemplatesAlliance";
import DocumentTemplateAllianceList from "../../../src/components/Document-Template-Alliance/DocumentTemplateAllianceList";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ButtonCreate from "../../components/ButtonCreate";
import { withRoleProtection } from "../../../src/components/withRoleProtection";
import TypographyHeading from "../../components/TypographyHeading";
import { PERMISSIONS } from "../../../src/config/permissions";

// Custom loading component
const LoadingComponent = () => (
  <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
    <CircularProgress />
  </Box>
);

// Custom error component
const ErrorComponent = ({ message }: { message: string }) => (
  <Box sx={{ p: 3 }}>
    <Alert severity="error">{message}</Alert>
  </Box>
);

const DocumentTemplateAlliancePage = () => {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const userRole = session?.user?.user_role;

  const {
    documentTemplatesAlliance,
    deleteDocumentTemplateAlliance,
    error,
    loading,
  } = useDocumentTemplatesAlliance(token);

  if (!token) {
    return <ErrorComponent message="Authentication required" />;
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return (
    <Suspense>
      <Box sx={{ width: "100%", ml: -6, overflow: "hidden" }}>
        <TypographyHeading>Alliance Document Templates</TypographyHeading>

        {userRole !== "Salesperson" && (
          <Link href="/dashboard/document-template-alliances/create" passHref>
            <ButtonCreate sx={{ ml: 4 }}>
              Create Alliance Document Template
            </ButtonCreate>
          </Link>
        )}

        {loading ? (
          <LoadingComponent />
        ) : (
          <DocumentTemplateAllianceList
            documentTemplates={documentTemplatesAlliance}
            onDelete={deleteDocumentTemplateAlliance}
            userRole={userRole}
          />
        )}
      </Box>
    </Suspense>
  );
};

// Protection configuration
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_DOCUMENTS],
};

// Single export default with protection
export default withRoleProtection(
  DocumentTemplateAlliancePage,
  protectionConfig
);
