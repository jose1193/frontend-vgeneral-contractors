"use client";

import React, { useEffect, Suspense } from "react";
import { useClaimAgreementFullSync } from "../../../src/hooks/ClaimAgreementFull/useClaimAgreementFullSync";
import { useClaimAgreementFullStore } from "@/stores/claim-agreement-fullStore";
import ClaimAgreementFullList from "@/components/ClaimAgreementFull/ClaimAgreementFullList";
import { Box, Button, Container, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import Loading from "./loading";
import TypographyHeading from "../../components/TypographyHeading";

export default function ClaimAgreementFullListPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const { loading, error, handleDelete, handleRestore, refreshItems } =
    useClaimAgreementFullSync(token);

  const items = useClaimAgreementFullStore((state) => state.items);

  // Wrapper functions para manejar el tipo de retorno
  const handleDeleteWrapper = async (uuid: string) => {
    const result = await handleDelete(uuid);
    return result;
  };

  const handleRestoreWrapper = async (uuid: string) => {
    const result = await handleRestore(uuid);
    return result;
  };

  useEffect(() => {
    refreshItems();
  }, [refreshItems]);

  if (loading) {
    return <Loading />;
  }

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
        <TypographyHeading>Claim Agreement Full</TypographyHeading>

        <ClaimAgreementFullList
          items={items}
          onDelete={handleDeleteWrapper}
          onRestore={handleRestoreWrapper}
          userRole={session?.user?.user_role}
        />
      </Box>
    </Suspense>
  );
}
