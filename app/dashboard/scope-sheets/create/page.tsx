'use client';

import React, { Suspense } from "react";
import { useScopeSheetSync } from '../../../../src/hooks/ScopeSheet/useScopeSheetSync';
import ScopeSheetForm from '@/components/ScopeSheet/ScopeSheetForm';
import { Box, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ScopeSheetCreateDTO } from '@/app/types/scope-sheet';
import { useSession } from 'next-auth/react';
import TypographyHeading from "../../../components/TypographyHeading";

export default function ScopeSheetCreatePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { loading, handleCreate } = useScopeSheetSync(token);

  const handleSubmit = async (data: ScopeSheetCreateDTO): Promise<void> => {
    try {
      const newItem = await handleCreate(data);

      if (!newItem || !('uuid' in newItem)) {
        throw new Error("No UUID received from ScopeSheet creation");
      }

      console.log("New ScopeSheet created:", newItem);
      router.push(`/dashboard/scope-sheets/${newItem.uuid}`);
    } catch (error) {
      console.error("Error creating ScopeSheet:", error);
      throw error;
    }
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
       
          <TypographyHeading>Create ScopeSheet</TypographyHeading>
       

        <Paper
          elevation={3}
          sx={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backgroundColor: "background.paper",
          }}
        >
          <ScopeSheetForm onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
}