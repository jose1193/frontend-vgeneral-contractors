'use client';

import React, { Suspense } from "react";
import { useScopeSheetSync } from '../../../src/hooks/scope-sheet/useScopeSheetSync';
import { useScopeSheetStore } from '@/stores/scope-sheetStore';
import ScopeSheetForm from '@/components/ScopeSheet/ScopeSheetForm';
import { Box, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ScopeSheetCreateDTO } from '@/app/types/scope-sheet';
import { useSession } from 'next-auth/react';
import TypographyHeading from "../../../components/TypographyHeading";

interface ScopeSheetEditPageProps {
  params: {
    uuid: string;
  };
}

export default function ScopeSheetEditPage({ params }: ScopeSheetEditPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { loading, error, handleUpdate } = useScopeSheetSync(token);
  const currentItem = useScopeSheetStore((state) => 
    state.items.find(item => item.uuid === params.uuid)
  );

  const handleSubmit = async (data: ScopeSheetCreateDTO): Promise<void> => {
    try {
      await handleUpdate(params.uuid, data);
      console.log("ScopeSheet updated successfully");
      router.push(`/dashboard/scope-sheets/${params.uuid}`);
    } catch (error) {
      console.error("Error updating ScopeSheet:", error);
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
        <TypographyHeading>ScopeSheet not found</TypographyHeading>
        <Typography align="center">
          The requested ScopeSheet could not be found
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
        <TypographyHeading>Edit ScopeSheet</TypographyHeading>

        <Paper
          elevation={3}
          sx={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backgroundColor: "background.paper",
          }}
        >
          <ScopeSheetForm
            initialData={currentItem}
            onSubmit={handleSubmit}
          />
        </Paper>
      </Box>
    </Suspense>
  );
}