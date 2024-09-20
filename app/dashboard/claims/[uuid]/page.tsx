// src/app/claims/[uuid]/page.tsx
"use client";
import React, { useEffect, useState, Suspense } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import { Home, ArrowBack } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DescriptionIcon from "@mui/icons-material/Description";
import ShareIcon from "@mui/icons-material/Share";
import ClaimDetails from "../../../../src/components/Claims/ClaimDetails";
import { useParams } from "next/navigation";
import { getData } from "../../../lib/actions/claimsActions";
import { ClaimsData } from "../../../types/claims";
import { useSession } from "next-auth/react";
import InvoiceTable from "../../../../src/components/Claims/InvoiceTable";
import ClaimHeader from "../../../../src/components/Claims/ClaimHeader";
import ClaimTabs from "../../../../src/components/Claims/ClaimTabs";
const ClaimProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [claim, setClaim] = useState<ClaimsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { uuid } = useParams();

  const { data: session } = useSession();

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const token = session?.accessToken as string;
        if (token && uuid) {
          const data = await getData(token, uuid as string);
          console.log("Fetched claim response:", data);
          setClaim(data);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch claim");
        setLoading(false);
      }
    };

    fetchClaim();
  }, [uuid, session?.accessToken]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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
        <ClaimHeader claim={claim} />

        <ClaimDetails claim={claim} />
        <InvoiceTable claim={claim} />

        <ClaimTabs />
      </Box>
    </Suspense>
  );
};

export default ClaimProfile;
