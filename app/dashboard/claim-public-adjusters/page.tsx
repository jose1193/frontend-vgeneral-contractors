"use client";

import React, { useEffect, Suspense } from "react";
import { useClaimPublicAdjusterSync } from "../../../src/hooks/ClaimPublicAdjuster/useClaimPublicAdjusterSync";
import { useClaimPublicAdjusterStore } from "@/stores/claim-public-adjusterStore";
import ClaimPublicAdjusterList from "@/components/ClaimPublicAdjuster/ClaimPublicAdjusterList";
import { Box, Container, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Loading from "./loading";
import TypographyHeading from "../../components/TypographyHeading";
import ButtonCreate from "../../components/ButtonCreate";

export default function ClaimPublicAdjusterListPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const {
    loading,
    error,
    handleDelete: originalHandleDelete,
    handleRestore: originalHandleRestore,
    refreshItems,
  } = useClaimPublicAdjusterSync(token);

  const items = useClaimPublicAdjusterStore((state) => state.items);

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
        <TypographyHeading>ClaimPublicAdjuster Management</TypographyHeading>
        <Link href={`/dashboard/claim-public-adjusters/create`} passHref>
          <ButtonCreate sx={{ mt: 5 }}>
            Create New ClaimPublicAdjuster
          </ButtonCreate>
        </Link>

        <ClaimPublicAdjusterList
          items={items}
          onDelete={handleDelete}
          onRestore={handleRestore}
          userRole={session?.user?.user_role}
        />
      </Box>
    </Suspense>
  );
}
