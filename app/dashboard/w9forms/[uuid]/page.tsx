"use client";

import { useW9FormSync } from "../../../../src/hooks/W9Form/useW9FormSync";
import { useW9FormStore } from "@/stores/w9formStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Paper,
  Typography,
  Divider,
  Avatar,
  IconButton,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import Loading from "./loading";
import TypographyHeading from "../../../components/TypographyHeading";

interface DetailRowProps {
  label: string;
  value: string | number | boolean | null | undefined;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <Box display="flex" alignItems="center" my={1}>
    <Typography variant="body1" component="span" mr={1}>
      {label}:
    </Typography>
    <Typography variant="body1" component="span" fontWeight="bold">
      {value === null || value === undefined
        ? "N/A"
        : typeof value === "boolean"
        ? value
          ? "Yes"
          : "No"
        : value}
    </Typography>
  </Box>
);

interface W9FormDetailPageProps {
  params: {
    uuid: string;
  };
}

export default function W9FormDetailPage({ params }: W9FormDetailPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const { loading, error } = useW9FormSync(token);
  const currentItem = useW9FormStore((state) =>
    state.items.find((item) => item.uuid === params.uuid)
  );

  const handleDownload = () => {
    if (currentItem?.document_path) {
      window.open(currentItem.document_path, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Box sx={{ mt: 2, mb: 10, p: { xs: 3, sm: 3, md: 2, lg: 4 } }}>
        <Button
          variant="outlined"
          onClick={() => router.back()}
          startIcon={<ArrowBackIcon />}
          style={{ marginBottom: "20px" }}
        >
          Back
        </Button>
        <Typography color="error" align="center">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (!currentItem) {
    return (
      <Box sx={{ mt: 2, mb: 10, p: { xs: 3, sm: 3, md: 2, lg: 4 } }}>
        <Button
          variant="outlined"
          onClick={() => router.back()}
          startIcon={<ArrowBackIcon />}
          style={{ marginBottom: "20px" }}
        >
          Back
        </Button>
        <Typography align="center">W9Form not found</Typography>
      </Box>
    );
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
      <TypographyHeading>W9Form Details</TypographyHeading>

      <Paper
        elevation={3}
        style={{
          padding: "20px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          marginBottom: "20px",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton size="large" edge="start" color="inherit">
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: "#EBF4FF",
                  color: "#7F9CF5",
                }}
              >
                {currentItem.name ? currentItem.name[0].toUpperCase() : "W"}
              </Avatar>
            </IconButton>
            <Typography variant="h6" sx={{ ml: 2 }}>
              {currentItem.name}
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            {currentItem.document_path && (
              <Button
                variant="contained"
                color="info"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                sx={{ height: 36 }}
              >
                Download
              </Button>
            )}
            <Button
              variant="contained"
              color="warning"
              startIcon={<EditIcon />}
              onClick={() =>
                router.push(`/dashboard/w9forms/${params.uuid}/edit`)
              }
              sx={{ height: 36 }}
            >
              Edit
            </Button>
          </Stack>
        </Box>

        <DetailRow label="Business Name" value={currentItem.business_name} />
        <DetailRow
          label="Individual/Sole Proprietor"
          value={currentItem.is_individual_sole_proprietor}
        />
        <DetailRow label="Corporation" value={currentItem.is_corporation} />
        <DetailRow label="Partnership" value={currentItem.is_partnership} />
        <DetailRow
          label="Limited Liability Company"
          value={currentItem.is_limited_liability_company}
        />
        <DetailRow label="Exempt Payee" value={currentItem.is_exempt_payee} />
        <DetailRow label="Other" value={currentItem.is_other} />
        <DetailRow
          label="LLC Tax Classification"
          value={currentItem.llc_tax_classification}
        />
        <DetailRow label="Address" value={currentItem.address} />
        <DetailRow label="Address 2" value={currentItem.address_2} />
        <DetailRow label="City" value={currentItem.city} />
        <DetailRow label="State" value={currentItem.state} />
        <DetailRow label="ZIP Code" value={currentItem.zip_code} />
        <DetailRow label="Country" value={currentItem.country} />

        <Divider sx={{ my: 2 }} />

        <DetailRow label="Record Status" value={currentItem.status} />
        <DetailRow
          label="Created At"
          value={
            currentItem.created_at
              ? new Date(currentItem.created_at).toLocaleString()
              : undefined
          }
        />
        <DetailRow
          label="Updated At"
          value={
            currentItem.updated_at
              ? new Date(currentItem.updated_at).toLocaleString()
              : undefined
          }
        />
      </Paper>
    </Box>
  );
}
