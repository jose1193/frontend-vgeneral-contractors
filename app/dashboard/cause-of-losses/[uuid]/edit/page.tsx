"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCauseOfLoss } from "../../../../lib/actions/causeOfLossActions";
import { useCauseOfLosses } from "../../../../../src/hooks/useCauseOfLosses";
import CauseOfLossForm from "@/components/Cause-Of-Loss/CauseOfLossForm";
import { CauseOfLossData } from "../../../../types/cause-of-loss";
import { withRoleProtection } from "../../../../../src/components/withRoleProtection";
import { PERMISSIONS } from "../../../../../src/config/permissions";
import TypographyHeading from "../../../../components/TypographyHeading";
import {
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GeneralFormSkeleton from "@/components/skeletons/GeneralFormSkeleton";
import { useSession } from "next-auth/react";

function EditCauseOfLossPage() {
  const { uuid } = useParams();
  const router = useRouter();
  const [causeOfLoss, setCauseOfLoss] = useState<CauseOfLossData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { updateCauseOfLoss } = useCauseOfLosses(token);

  useEffect(() => {
    const fetchCauseOfLoss = async () => {
      try {
        const data = await getCauseOfLoss(token, uuid as string);
        setCauseOfLoss(data);
      } catch (err) {
        setError("No cause of loss found");
      } finally {
        setLoading(false);
      }
    };

    fetchCauseOfLoss();
  }, [uuid, token]);

  const handleSubmit = async (data: CauseOfLossData) => {
    await updateCauseOfLoss(uuid as string, data);
    router.push("/dashboard/cause-of-losses");
  };

  if (loading) {
    return <GeneralFormSkeleton />;
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "hidden",

        mb: 10,
        p: { xs: 1, lg: 2 },
      }}
    >
      <TypographyHeading>Edit Cause of Loss</TypographyHeading>
      {error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : causeOfLoss ? (
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <CauseOfLossForm initialData={causeOfLoss} onSubmit={handleSubmit} />
        </Paper>
      ) : (
        <Typography variant="h6" color="error">
          No cause of loss found
        </Typography>
      )}
    </Box>
  );
}

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

export default withRoleProtection(EditCauseOfLossPage, protectionConfig);
