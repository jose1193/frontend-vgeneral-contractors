"use client";

import React, { Suspense } from "react";
import { useDocumentTemplates } from "../../../src/hooks/useDocumentTemplate";
import DocumentTemplateList from "../../../src/components/Document-Template/DocumentTemplateList";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ButtonCreate from "../../components/ButtonCreate";
import { withRoleProtection } from "../../../src/components/withRoleProtection";
import { PERMISSIONS } from "../../../src/config/permissions";
import { useListPermissions } from "../../../src/hooks/useListPermissions";
import TypographyHeading from "../../components/TypographyHeading";

const DocumentTemplatesPage = () => {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { canModifyList } = useListPermissions();

  const { documentTemplates, deleteDocumentTemplate } =
    useDocumentTemplates(token);

  const listConfig = {
    permission: PERMISSIONS.MANAGE_DOCUMENTS,
    restrictedRoles: ["Salesperson"],
  };

  return (
    <Suspense>
      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <TypographyHeading>Document Templates</TypographyHeading>
        {canModifyList(listConfig) && (
          <Link href="/dashboard/document-templates/create" passHref>
            <ButtonCreate>Create Document Template</ButtonCreate>
          </Link>
        )}

        <DocumentTemplateList
          documentTemplates={documentTemplates}
          onDelete={deleteDocumentTemplate}
        />
      </Box>
    </Suspense>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_DOCUMENTS],
};

export default withRoleProtection(DocumentTemplatesPage, protectionConfig);
