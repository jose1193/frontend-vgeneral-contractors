// pages/dashboard/zones/page.tsx
"use client";

import React, { Suspense, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Box } from "@mui/material";
import { withRoleProtection } from "../../../src/components/withRoleProtection";
import { PERMISSIONS } from "../../../src/config/permissions";
import { useZoneSync } from "../../../src/hooks/useZoneSync";
import { useFilteredZones } from "../../../app/zustand/useZoneStore";
import ZoneList from "../../../src/components/Zone/ZoneList";
import TypographyHeading from "../../../app/components/TypographyHeading";

const ZonesPage = () => {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const userRole = session?.user?.user_role;

  const { loading, error, handleDelete, handleRestore, refreshZones } =
    useZoneSync(token);

  const { zones } = useFilteredZones();

  useEffect(() => {
    if (token) {
      console.log("Initial zones fetch");
      refreshZones();
    }
  }, [token, refreshZones]);

  if (error) {
    console.error("Error in ZonesPage:", error);
  }

  return (
    <Suspense>
      <Box>
        <Box sx={{ textAlign: "center" }}>
          <TypographyHeading>Zones</TypographyHeading>
        </Box>

        <ZoneList
          zones={zones}
          onDelete={handleDelete}
          onRestore={handleRestore}
          userRole={userRole}
          loading={loading}
          error={error}
        />
      </Box>
    </Suspense>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

export default withRoleProtection(ZonesPage, protectionConfig);
