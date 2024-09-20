// src/app/claims/[uuid]/edit/page.tsx
"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { getData } from "../../../../lib/actions/claimsActions";
import { useClaims } from "../../../../../src/hooks/useClaims";
import ClaimsForm from "../../../../../src/components/Claims/ClaimsForm";
import { ClaimsData } from "../../../../types/claims";
import { Container, Typography, Box, Paper } from "@mui/material";
import { withRoleProtection } from "../../../../../src/components/withRoleProtection";
import { useSession } from "next-auth/react";
import ClaimsFormSkeleton from "../../../../../src/components/skeletons/ClaimsFormSkeleton";
const EditClaimPage = () => {
  const { uuid } = useParams();
  const router = useRouter();
  const [claim, setClaim] = useState<ClaimsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { updateClaim } = useClaims(token);

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const data = await getData(token, uuid as string);
        setClaim(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch claim");
        setLoading(false);
      }
    };

    fetchClaim();
  }, [uuid, token]);

  const handleSubmit = async (
    data: ClaimsData
  ): Promise<string | undefined> => {
    try {
      await updateClaim(uuid as string, data);
      router.push(`/dashboard/claims/${uuid}`);
      return uuid as string;
    } catch (error) {
      console.error("Error updating claim:", error);
      return undefined;
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!claim) return <ClaimsFormSkeleton />;

  return (
    <Suspense>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          ml: -7,
          mb: 10,
          p: { xs: 3, sm: 3, md: 2, lg: 4 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: {
              xs: "1.5rem",
              sm: "1.75rem",
              md: "2rem",
              lg: "2.25rem",
            },
          }}
          component="h1"
          gutterBottom
        >
          Edit Claim
        </Typography>
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <ClaimsForm initialData={claim} onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
};

export default withRoleProtection(EditClaimPage, [
  "Super Admin",
  "Admin",
  "Manager",
  "Lead",
]);
