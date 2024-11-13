"use client";

import React, { Suspense } from "react";
import { useDocumentTemplateAdjusters } from "../../../src/hooks/useDocumentTemplateAdjuster";
import DocumentTemplateAdjusterList from "../../../src/components/Document-Template-Adjuster/DocumentTemplateAdjusterList";
import { Box } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ButtonCreate from "../../components/ButtonCreate";
import { withRoleProtection } from "../../../src/components/withRoleProtection";
import { PERMISSIONS } from "../../../src/config/permissions";
import { useListPermissions } from "../../../src/hooks/useListPermissions";
import TypographyHeading from "../../components/TypographyHeading";

const DocumentTemplateAdjustersPage = () => {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { canModifyList } = useListPermissions();

  const { documentTemplateAdjusters, deleteDocumentTemplateAdjuster } =
    useDocumentTemplateAdjusters(token);

  const listConfig = {
    permission: PERMISSIONS.MANAGE_DOCUMENTS,
    restrictedRoles: ["Public Adjuster", "Salesperson", "Technical Services"],
  };

  return (
    <Suspense>
      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <TypographyHeading>Document Template Adjusters</TypographyHeading>
        {canModifyList(listConfig) && (
          <Link href="/dashboard/document-template-adjusters/create" passHref>
            <ButtonCreate>Create Document Template Adjuster</ButtonCreate>
          </Link>
        )}

        <DocumentTemplateAdjusterList
          documentTemplateAdjusters={documentTemplateAdjusters}
          onDelete={deleteDocumentTemplateAdjuster}
        />
      </Box>
    </Suspense>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_DOCUMENTS],
};

export default withRoleProtection(
  DocumentTemplateAdjustersPage,
  protectionConfig
);
