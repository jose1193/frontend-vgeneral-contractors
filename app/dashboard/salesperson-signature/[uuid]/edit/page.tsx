"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getData } from "../../../../lib/actions/salespersonSignatureActions";
import { useSalespersonSignatures } from "../../../../../src/hooks/useSalespersonSignatures";
import SalesPersonSignatureForm from "../../../../../src/components/Salesperson-Signature/SalesPersonSignatureForm";
import { SalesPersonSignatureData } from "../../../../types/salesperson-signature";
import { Typography, Box, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GeneralFormSkeleton from "@/components/skeletons/GeneralFormSkeleton";
import { useSession } from "next-auth/react";
import TypographyHeading from "../../../../components/TypographyHeading";

function EditSalesPersonSignaturePage() {
  const { uuid } = useParams();
  const router = useRouter();
  const [salesPersonSignature, setSalesPersonSignature] =
    useState<SalesPersonSignatureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const { updateSalespersonSignature } = useSalespersonSignatures(token);

  useEffect(() => {
    const fetchSalesPersonSignature = async () => {
      try {
        const data = await getData(token, uuid as string);
        setSalesPersonSignature(data);
      } catch (err) {
        setError("No salesperson signature found");
      } finally {
        setLoading(false);
      }
    };
    fetchSalesPersonSignature();
  }, [uuid, token]);

  const handleSubmit = async (data: SalesPersonSignatureData) => {
    await updateSalespersonSignature(uuid as string, data);
    router.push("/dashboard/salesperson-signature");
  };

  if (loading) {
    return <GeneralFormSkeleton />;
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "hidden",

        mb: 10,
        p: { xs: 1, lg: 2 },
      }}
    >
      <TypographyHeading> Edit Salesperson Signature</TypographyHeading>
      {error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : salesPersonSignature ? (
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <SalesPersonSignatureForm
            initialData={salesPersonSignature}
            onSubmit={handleSubmit}
          />
        </Paper>
      ) : (
        <Typography variant="h6" color="error">
          No salesperson signature found
        </Typography>
      )}
    </Box>
  );
}

export default EditSalesPersonSignaturePage;
