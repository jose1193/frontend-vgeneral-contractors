"use client";

import React, { Suspense } from "react";
import { useDocumentTemplatesAlliance } from "../../../src/hooks/useDocumentTemplatesAlliance";
import DocumentTemplateAllianceList from "../../../src/components/Document-Template-Alliance/DocumentTemplateAllianceList";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ButtonCreate from "../../components/ButtonCreate";
import { withRoleProtection } from "../../../src/components/withRoleProtection";
import { PERMISSIONS } from "../../../src/config/permissions";
import { useListPermissions } from "../../../src/hooks/useListPermissions";
import TypographyHeading from "../../components/TypographyHeading";
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
  const { canModifyList } = useListPermissions();

  const listConfig = {
    permission: PERMISSIONS.MANAGE_DOCUMENTS,
    restrictedRoles: ["Salesperson"],
  };

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
      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <TypographyHeading>Alliance Document Templates</TypographyHeading>
        {canModifyList(listConfig) && (
          <Link href="/dashboard/document-template-alliances/create" passHref>
            <ButtonCreate>Create Alliance Document Template</ButtonCreate>
          </Link>
        )}

        {loading ? (
          <LoadingComponent />
        ) : (
          <DocumentTemplateAllianceList
            documentTemplates={documentTemplatesAlliance}
            onDelete={deleteDocumentTemplateAlliance}
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
