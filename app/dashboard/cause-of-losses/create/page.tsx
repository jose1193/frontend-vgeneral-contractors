"use client";

import React, { Suspense } from "react";
import { useCauseOfLosses } from "../../../../src/hooks/useCauseOfLosses";
import CauseOfLossForm from "../../../../src/components/Cause-Of-Loss/CauseOfLossForm";
import { Typography, Box, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { CauseOfLossData } from "../../../../app/types/cause-of-loss";
import { useSession } from "next-auth/react";
import TypographyHeading from "../../../components/TypographyHeading";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import { PERMISSIONS } from "../../../../src/config/permissions";

const CreateCauseOfLossPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const token = session?.accessToken as string;
  const { createCauseOfLoss } = useCauseOfLosses(token);

  const handleSubmit = async (data: CauseOfLossData) => {
    await createCauseOfLoss(data);
    console.log("Cause of Loss data to submit:", data);
    router.push("/dashboard/cause-of-losses");
  };

  return (
    <Suspense>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",

          mb: 10,
          p: { xs: 1, lg: 2 },
        }}
      >
        <TypographyHeading>Create Cause of Loss</TypographyHeading>

        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <CauseOfLossForm onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

export default withRoleProtection(CreateCauseOfLossPage, protectionConfig);
