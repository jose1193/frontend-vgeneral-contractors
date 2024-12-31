"use client";
import React, { useState, useEffect } from "react";
import { Box, Paper, Tab, Tabs, Typography, Button, CircularProgress } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useScopeSheet } from "@/hooks/ScopeSheet/useScopeSheet";
import Header from "@/components/ScopeSheet/Header";
import MainPhotosTab from "@/components/ScopeSheet/MainPhotosTab";
import EditScopeSheetDialog from "@/components/ScopeSheet/EditScopeSheetDialog";
import CustomTabPanel from "@/components/ScopeSheet/CustomTabPanel";

export default function ScopeSheetPage({ params }: { params: { uuid: string } }) {
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({
    front_house: null as FileList | null,
    house_number: null as FileList | null,
  });

  const session = useSession();
  const token = session?.data?.user?.token ?? "";
  const { getItem, currentItem, loading, error } = useScopeSheet(token);

  useEffect(() => {
    if (params.uuid && token) {
      getItem(params.uuid);
    }
  }, [params.uuid, token, getItem]);

  const handleFileChange = (section: "front_house" | "house_number") => (files: FileList) => {
    setSelectedFiles(prev => ({
      ...prev,
      [section]: files
    }));
  };

  const handleGeneratePDF = () => {
    console.log("Generating PDF for scope sheet:", params.uuid);
  };

  if (loading && !currentItem) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!currentItem) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Scope sheet not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        <Header
          scopeSheet={currentItem}
          onGeneratePDF={handleGeneratePDF}
          onEdit={() => setEditDialogOpen(true)}
        />

        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={(_e, v) => setTabValue(v)}>
              <Tab label="Main Photos" />
              <Tab label="Add Zones" icon={<AddIcon />} iconPosition="end" />
            </Tabs>
          </Box>

          <CustomTabPanel value={tabValue} index={0}>
            <MainPhotosTab
              selectedFiles={selectedFiles}
              onFileChange={handleFileChange}
              scope_sheet_uuid={params.uuid}
              presentations_images={currentItem.presentations_images}
            />
          </CustomTabPanel>

          <CustomTabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6">Add New Zone</Typography>
              <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 2 }}>
                Create Zone
              </Button>
            </Box>
          </CustomTabPanel>
        </Box>
      </Paper>

      {currentItem && (
        <EditScopeSheetDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSuccess={async () => {
            await getItem(params.uuid);
            setEditDialogOpen(false);
          }}
          currentItem={currentItem}
          token={token}
        />
      )}
    </Box>
  );
}
