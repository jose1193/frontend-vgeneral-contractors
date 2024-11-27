"use client";

import React, { useEffect, Suspense } from "react";
import { useW9FormSync } from "../../../src/hooks/W9Form/useW9FormSync";
import { useW9FormStore } from "@/stores/w9formStore";
import W9FormList from "@/components/W9Form/W9FormList";
import { Box, Container, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Loading from "./loading";
import TypographyHeading from "../../components/TypographyHeading";
import ButtonCreate from "../../components/ButtonCreate";

export default function W9FormListPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const {
    loading,
    error,
    handleDelete: originalHandleDelete,
    handleRestore: originalHandleRestore,
    refreshItems,
  } = useW9FormSync(token);

  const items = useW9FormStore((state) => state.items);

  // Wrapper functions to handle void return type
  const handleDelete = async (uuid: string): Promise<void> => {
    await originalHandleDelete(uuid);
  };

  const handleRestore = async (uuid: string): Promise<void> => {
    await originalHandleRestore(uuid);
  };

  useEffect(() => {
    refreshItems();
  }, [refreshItems]);

  if (loading) return <Loading />;

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
        <TypographyHeading>W9Form Management</TypographyHeading>
        <Link href={`/dashboard/w9forms/create`} passHref>
          <ButtonCreate sx={{ mt: 5 }}>Create New W9Form</ButtonCreate>
        </Link>

        <W9FormList
          items={items}
          onDelete={handleDelete}
          onRestore={handleRestore}
          userRole={session?.user?.user_role}
        />
      </Box>
    </Suspense>
  );
}
