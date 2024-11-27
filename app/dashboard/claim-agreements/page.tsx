"use client";

import React, { useEffect, Suspense } from "react";
import { useClaimAgreementSync } from "../../../src/hooks/ClaimAgreement/useClaimAgreementSync";
import { useClaimAgreementStore } from "@/stores/claim-agreementStore";
import ClaimAgreementList from "@/components/ClaimAgreement/ClaimAgreementList";
import { Box, Button, Container, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import Loading from "./loading";
import TypographyHeading from "../../components/TypographyHeading";
export default function ClaimAgreementListPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const { loading, error, handleDelete, handleRestore, refreshItems } =
    useClaimAgreementSync(token);

  const items = useClaimAgreementStore((state) => state.items);

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
        <TypographyHeading>Claim Agreement PDF </TypographyHeading>

        <ClaimAgreementList
          items={items}
          onDelete={handleDelete}
          onRestore={handleRestore}
          userRole={session?.user?.user_role}
        />
      </Box>
    </Suspense>
  );
}
