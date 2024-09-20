// src/app/type-damages/[uuid]/edit/page.tsx
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTypeDamage } from "../../../../lib/actions/typeDamageActions";
import { useTypeDamages } from "../../../../../src/hooks/useTypeDamage";
import TypeDamageForm from "../../../../../src/components/Type-Damages/TypeDamagesForm";
import { TypeDamageData } from "../../../../types/type-damage";
import { Typography, Box, Paper } from "@mui/material";
import { withRoleProtection } from "../../../../../src/components/withRoleProtection";
import { useSession } from "next-auth/react";

const EditTypeDamagePage = () => {
  const { uuid } = useParams();
  const router = useRouter();
  const [typeDamage, setTypeDamage] = useState<TypeDamageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { updateTypeDamage } = useTypeDamages(token);

  useEffect(() => {
    const fetchTypeDamage = async () => {
      try {
        const data = await getTypeDamage(token, uuid as string);
        setTypeDamage(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch type damage");
        setLoading(false);
      }
    };

    fetchTypeDamage();
  }, [uuid, token]);

  const handleSubmit = async (data: TypeDamageData) => {
    await updateTypeDamage(uuid as string, data);
    router.push("/dashboard/type-damages");
  };

  if (error) return <div>Error: {error}</div>;
  if (!typeDamage) return <div></div>;

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
          Edit Type Damage
        </Typography>
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <TypeDamageForm initialData={typeDamage} onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
};
export default withRoleProtection(EditTypeDamagePage, ["Super Admin"]);
