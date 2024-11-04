"use client";
import React, { Suspense } from "react";
import { useCauseOfLosses } from "../../../src/hooks/useCauseOfLosses";
import CauseOfLossList from "../../../src/components/Cause-Of-Loss/CauseOfLossList";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ButtonCreate from "../../components/ButtonCreate";
import { withRoleProtection } from "../../../src/components/withRoleProtection";
import TypographyHeading from "../../components/TypographyHeading";
import { PERMISSIONS } from "../../../src/config/permissions";

const CauseOfLossPage = () => {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const userRole = session?.user?.user_role;
  const { causeOfLosses, deleteCauseOfLoss } = useCauseOfLosses(token);

  return (
    <Suspense>
      <TypographyHeading>Cause of Losses</TypographyHeading>
      <Box>
        <Link href="/dashboard/cause-of-losses/create" passHref>
          <ButtonCreate sx={{ mt: 5 }}>Create Cause of Loss</ButtonCreate>
        </Link>

        <CauseOfLossList
          causeOfLosses={causeOfLosses}
          onDelete={deleteCauseOfLoss}
          userRole={userRole}
        />
      </Box>
    </Suspense>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

export default withRoleProtection(CauseOfLossPage, protectionConfig);
