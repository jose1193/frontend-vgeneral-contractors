"use client";

import React, { Suspense } from "react";
import { useW9FormSync } from "../../../../src/hooks/W9Form/useW9FormSync";
import W9FormForm from "@/components/W9Form/W9FormForm";
import { Box, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { W9FormCreateDTO, W9FormData } from "../../../types/w9form";
import { useSession } from "next-auth/react";
import { withRoleProtection } from "../../../../src/components/withRoleProtection";
import TypographyHeading from "../../../components/TypographyHeading";
import { PERMISSIONS } from "../../../../src/config/permissions";

const CreateW9FormPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { loading, handleCreate } = useW9FormSync(token);

  const openDocument = (url: string) => {
    // Verificar si es una URL de S3
    if (url.includes("s3.amazonaws.com")) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    // Para URLs relativas u otros casos
    if (!url.startsWith("http")) {
      const baseUrl = window.location.origin;
      url = `${baseUrl}${url}`;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async (data: W9FormCreateDTO): Promise<void> => {
    try {
      const newItem = await handleCreate(data);

      if (!newItem || !("uuid" in newItem)) {
        throw new Error("No UUID received from W9Form creation");
      }

      console.log("New W9Form created:", newItem);

      // Si existe document_path, abrimos el documento
      if (newItem.document_path) {
        openDocument(newItem.document_path);

        // Log para debugging
        console.log("Opening document URL:", newItem.document_path);
      } else {
        console.log("No document_path received");
      }

      // Navegamos a la página de detalle del W9Form
      router.push(`/dashboard/w9forms/${newItem.uuid}`);
    } catch (error) {
      console.error("Error creating W9Form:", error);
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
        <TypographyHeading>Create W9 Form</TypographyHeading>

        <Paper
          elevation={3}
          sx={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backgroundColor: "background.paper",
          }}
        >
          <W9FormForm onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Suspense>
  );
};

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

export default withRoleProtection(CreateW9FormPage, protectionConfig);
