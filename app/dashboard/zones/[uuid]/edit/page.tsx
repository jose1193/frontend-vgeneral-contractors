"use client";

import React, { useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { Typography, Box, Paper } from "@mui/material";
import { useSession } from "next-auth/react";
import { useZones } from "@/hooks/useZones";
import ZoneForm from "../../../../../src/components/Zone/ZoneForm";
import { ZoneData, ZoneUpdateDTO } from "../../../../types/zone";
import GeneralFormSkeleton from "@/components/skeletons/GeneralFormSkeleton";
import TypographyHeading from "../../../../../app/components/TypographyHeading";
import { withRoleProtection } from "@/components/withRoleProtection";
import { PERMISSIONS } from "@/config/permissions";

function EditZonePage() {
  const { uuid } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const {
    getZone,
    updateZone,
    currentZone: zone,
    loading,
    error,
  } = useZones(token);

  useEffect(() => {
    if (uuid && token) {
      getZone(uuid as string);
    }
  }, [uuid, token, getZone]);

  const handleSubmit = async (formData: ZoneData) => {
    try {
      // Transformar ZoneData a ZoneUpdateDTO
      const updateData: ZoneUpdateDTO = {
        uuid: uuid as string,
        zone_name: formData.zone_name,
        zone_type: formData.zone_type,
        code: formData.code || undefined,
        description: formData.description || undefined,
      };

      await updateZone(uuid as string, updateData);
      router.push("/dashboard/zones");
    } catch (error) {
      console.error("Error updating zone:", error);
    }
  };

  if (loading) {
    return <GeneralFormSkeleton />;
  }

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
        <Paper
          elevation={3}
          sx={{
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 2,
            p: 3,
          }}
        >
          <TypographyHeading>Edit Zone</TypographyHeading>
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : zone ? (
            <ZoneForm
              initialData={zone}
              onSubmit={handleSubmit}
              uuid={uuid as string}
            />
          ) : (
            <Typography>No zone found</Typography>
          )}
        </Paper>
      </Box>
    </Suspense>
  );
}

const protectionConfig = {
  permissions: [PERMISSIONS.MANAGE_CONFIG],
};

export default withRoleProtection(EditZonePage, protectionConfig);
