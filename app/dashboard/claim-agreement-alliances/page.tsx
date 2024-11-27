"use client";

import React, { useEffect, Suspense } from "react";
import { useClaimAgreementAllianceSync } from "../../../src/hooks/ClaimAgreementAlliance/useClaimAgreementAllianceSync";
import { useClaimAgreementAllianceStore } from "@/stores/claim-agreement-allianceStore";
import ClaimAgreementAllianceList from "@/components/ClaimAgreementAlliance/ClaimAgreementAllianceList";
import { Box, Container, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Loading from "./loading";
import TypographyHeading from "../../components/TypographyHeading";
import ButtonCreate from "../../components/ButtonCreate";

export default function ClaimAgreementAllianceListPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const {
    loading,
    error,
    handleDelete: originalHandleDelete,
    handleRestore: originalHandleRestore,
    refreshItems,
  } = useClaimAgreementAllianceSync(token);

  const items = useClaimAgreementAllianceStore((state) => state.items);

  // Wrapper functions that ignore the return value
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
        <TypographyHeading>Claim Agreement Alliance</TypographyHeading>

        <ClaimAgreementAllianceList
          items={items}
          onDelete={handleDelete}
          onRestore={handleRestore}
          userRole={session?.user?.user_role}
        />
      </Box>
    </Suspense>
  );
}
