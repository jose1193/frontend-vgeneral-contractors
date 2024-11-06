"use client";

import React, { Suspense } from "react";
import { useZones } from "../../../../src/hooks/useZones";
import ZoneForm from "../../../../src/components/Zone/ZoneForm";
import { Box, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { ZoneData } from "../../../../app/types/zone";
import { useSession } from "next-auth/react";
import TypographyHeading from "../../../components/TypographyHeading";

const CreateZonePage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { createZone } = useZones(token);

  const handleSubmit = async (data: ZoneData) => {
    await createZone(data);
    console.log("Zone data to submit:", data);
    router.push("/dashboard/zones");
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
        <Button
          variant="outlined"
          onClick={() => window.history.back()}
          startIcon={<ArrowBackIcon />}
          style={{ marginBottom: "20px" }}
        >
          Back
        </Button>

        <TypographyHeading>Create Zone</TypographyHeading>

        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <ZoneForm onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
};

export default CreateZonePage;
