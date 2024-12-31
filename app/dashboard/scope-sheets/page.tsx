"use client";

import React, { useEffect, Suspense } from "react";
import { useScopeSheetSync } from "../../../src/hooks/ScopeSheet/useScopeSheetSync";
import { useScopeSheetStore } from "@/stores/scope-sheetStore";
import ScopeSheetList from "@/components/ScopeSheet/ScopeSheetList";
import { Box, Container, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Loading from "./loading";
import TypographyHeading from "../../components/TypographyHeading";
import ButtonCreate from "../../components/ButtonCreate";

export default function ScopeSheetListPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const [initialLoading, setInitialLoading] = React.useState(true);
  const {
    loading,
    error,
    handleDelete: originalHandleDelete,
    handleRestore: originalHandleRestore,
    refreshItems,
  } = useScopeSheetSync(token);

  // Wrapper functions to handle void return type
  const handleDelete = async (uuid: string): Promise<void> => {
    await originalHandleDelete(uuid);
  };

  const handleRestore = async (uuid: string): Promise<void> => {
    await originalHandleRestore(uuid);
  };

  useEffect(() => {
    const init = async () => {
      await refreshItems();
      setInitialLoading(false);
    };
    init();
  }, [refreshItems]);

  if (initialLoading) return <Loading />;

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Suspense>
      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <TypographyHeading>Scope Sheet Management</TypographyHeading>
        

        <ScopeSheetList
          onDelete={handleDelete}
          onRestore={handleRestore}
          userRole={session?.user?.user_role}
        />
      </Box>
    </Suspense>
  );
}
