// DocusignPage.tsx
"use client";

import React, { Suspense } from "react";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import DocusignList from "../../../../src/components/DocuSign/DocusignList";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import { PERMISSIONS } from "../../../../src/config/permissions";
import { useListPermissions } from "../../../../src/hooks/useListPermissions";
import TypographyHeading from "../../../../app/components/TypographyHeading";
import { useDocuSignConnection } from "../../../../src/hooks/useDocuSign";

const DocusignPage = () => {
  const { data: session } = useSession();
  const userRole = session?.user?.user_role;
  const token = session?.accessToken as string;
  const { deleteDocusignDocument } = useDocuSignConnection(token);
  const { canModifyList } = useListPermissions();

  const listConfig = {
    permission: PERMISSIONS.MANAGE_CLAIMS,
    restrictedRoles: ["Salesperson"],
  };

  return (
    <Suspense>
      <Box>
        <Box sx={{ textAlign: "center", overflow: "hidden" }}>
          <TypographyHeading>DocuSign Documents</TypographyHeading>
        </Box>

        <DocusignList userRole={userRole} onDelete={deleteDocusignDocument} />
      </Box>
    </Suspense>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CLAIMS],
};

export default withRoleProtection(DocusignPage, protectionConfig);
