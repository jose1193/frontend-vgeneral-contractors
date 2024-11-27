"use client";

import React, { Suspense } from "react";
import { useW9FormSync } from "../../../../../src/hooks/W9Form/useW9FormSync";
import { useW9FormStore } from "@/stores/w9formStore";
import W9FormForm from "@/components/W9Form/W9FormForm";
import { Box, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { W9FormCreateDTO } from "../../../../types/w9form";
import { useSession } from "next-auth/react";
import TypographyHeading from "../../../../components/TypographyHeading";
import Loading from "./loading";

interface W9FormEditPageProps {
  params: {
    uuid: string;
  };
}

export default function W9FormEditPage({ params }: W9FormEditPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { loading, error, handleUpdate } = useW9FormSync(token);
  const currentItem = useW9FormStore((state) =>
    state.items.find((item) => item.uuid === params.uuid)
  );

  const handleSubmit = async (data: W9FormCreateDTO): Promise<void> => {
    try {
      await handleUpdate(params.uuid, data);
      console.log("W9 Form updated successfully");
      router.push(`/dashboard/w9forms/${params.uuid}`);
    } catch (error) {
      console.error("Error updating W9 Form:", error);
      throw error;
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          mb: 10,
          p: { xs: 1, lg: 2 },
        }}
      >
        <TypographyHeading>Error</TypographyHeading>
        <Typography color="error" align="center">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (!currentItem) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          mb: 10,
          p: { xs: 1, lg: 2 },
        }}
      >
        <TypographyHeading>W9 Form not found</TypographyHeading>
        <Typography align="center">
          The requested W9 Form could not be found
        </Typography>
      </Box>
    );
  }

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
        <TypographyHeading>Edit W9 Form</TypographyHeading>

        <Paper
          elevation={3}
          sx={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backgroundColor: "background.paper",
          }}
        >
          <W9FormForm initialData={currentItem} onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
}
