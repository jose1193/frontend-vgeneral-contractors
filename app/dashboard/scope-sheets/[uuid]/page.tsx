"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Tab,
  Tabs,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useScopeSheet } from "@/hooks/ScopeSheet/useScopeSheet";
import { useScopeSheetPresentationSync } from "@/hooks/Scope-Sheet-Presentation/useScopeSheetPresentationSync";
import Header from "@/components/ScopeSheet/Header";
import MainPhotosTab from "@/components/ScopeSheet/MainPhotosTab";
import EditScopeSheetDialog from "@/components/ScopeSheet/EditScopeSheetDialog";
import CustomTabPanel from "@/components/ScopeSheet/CustomTabPanel";
import { useScopeSheetExport } from "@/hooks/ScopeSheetExport/useScopeSheetExport";
import ScopeSheetExport from "@/components/ScopeSheetExport/ScopeSheetExport";
import {
  PhotoCamera as PhotoCameraIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Map as MapIcon,
} from "@mui/icons-material";

export default function ScopeSheetPage({
  params,
}: {
  params: { uuid: string };
}) {
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({
    front_house: null as FileList | null,
    house_number: null as FileList | null,
  });

  const session = useSession();
  const token = session?.data?.user?.token ?? "";
  const { getItem, currentItem, loading, error } = useScopeSheet(token);
  const { refreshItems } = useScopeSheetPresentationSync(token);

  useEffect(() => {
    if (params.uuid && token) {
      getItem(params.uuid);
    }
  }, [params.uuid, token, getItem]);

  const handleFileChange =
    (section: "front_house" | "house_number") => (files: FileList) => {
      setSelectedFiles((prev) => ({
        ...prev,
        [section]: files,
      }));
    };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentItem) {
    return <Box sx={{ p: 3 }}></Box>;
  }

  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        <Header
          scopeSheet={currentItem}
          onEdit={() => setEditDialogOpen(true)}
        />

        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={(_e, v) => setTabValue(v)}>
              <Tab
                label="Main Photos"
                icon={<PhotoCameraIcon />}
                iconPosition="start"
              />
              <Tab label="Add Zones" icon={<MapIcon />} iconPosition="start" />
              <Tab
                label="Scope Sheet Export PDF"
                icon={<PictureAsPdfIcon />}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <CustomTabPanel value={tabValue} index={0}>
            <MainPhotosTab
              selectedFiles={selectedFiles}
              onFileChange={handleFileChange}
              scope_sheet_uuid={params.uuid}
              presentations_images={currentItem.presentations_images}
              onUpdate={() => getItem(params.uuid)}
            />
          </CustomTabPanel>

          <CustomTabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6">Add New Zone</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
              >
                Create Zone
              </Button>
            </Box>
          </CustomTabPanel>

          <CustomTabPanel value={tabValue} index={2}>
            <ScopeSheetExport
              scope_sheet_export={currentItem.scope_sheet_export}
              scope_sheet_uuid={params.uuid}
              onUpdate={() => getItem(params.uuid)}
            />
          </CustomTabPanel>
        </Box>
      </Paper>

      {currentItem && (
        <EditScopeSheetDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSuccess={async () => {
            await getItem(params.uuid);
            await refreshItems();
            setEditDialogOpen(false);
          }}
          currentItem={currentItem}
          token={token}
        />
      )}
    </Box>
  );
}
