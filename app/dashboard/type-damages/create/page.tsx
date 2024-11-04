// src/app/type-damages/create/page.tsx
"use client";

import React, { Suspense } from "react";
import { useTypeDamages } from "../../../../src/hooks/useTypeDamage";
import TypeDamagesForm from "../../../../src/components/Type-Damages/TypeDamagesForm";
import { Typography, Box, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { TypeDamageData } from "../../../../app/types/type-damage";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import TypographyHeading from "../../../components/TypographyHeading";
import { PERMISSIONS } from "../../../../src/config/permissions";

const CreateTypeDamagePage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const token = session?.accessToken as string;
  const { createTypeDamage } = useTypeDamages(token);

  const handleSubmit = async (data: TypeDamageData) => {
    await createTypeDamage(data);
    console.log("Type Damage data to submit:", data);
    router.push("/dashboard/type-damages");
  };

  return (
    <Suspense>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",

          mb: 10,
          p: { xs: 3, sm: 3, md: 2, lg: 4 },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            mb: 5,
            fontSize: {
              xs: "1.5rem",
              sm: "1.75rem",
              md: "2rem",
              lg: "2.25rem",
            },
          }}
        >
          Create Type Damage
        </Typography>
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <TypeDamagesForm onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
};
const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

// Single export default with protection
export default withRoleProtection(CreateTypeDamagePage, protectionConfig);
