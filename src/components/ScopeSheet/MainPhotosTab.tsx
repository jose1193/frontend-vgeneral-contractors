import React, { useCallback, useState, useMemo } from 'react';
import { Box } from '@mui/material';
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";
import HomePhotos from './HomePhotos';
import { useSession } from 'next-auth/react';
import { useScopeSheetPresentationSync } from '../../hooks/Scope-Sheet-Presentation/useScopeSheetPresentationSync';
import { useScopeSheetPresentation } from '../../hooks/Scope-Sheet-Presentation/useScopeSheetPresentation';
import { ScopeSheetPresentationData } from '../../../app/types/scope-sheet-presentation';
import { ScopeSheetData } from '../../../app/types/scope-sheet';

interface MainPhotosTabProps {
  selectedFiles: {
    front_house: FileList | null;
    house_number: FileList | null;
  };
  onFileChange: (section: "front_house" | "house_number") => (files: FileList) => void;
  scope_sheet_uuid: string;
  presentations_images?: ScopeSheetPresentationData[];
  onUpdate: () => Promise<ScopeSheetData | null>;
}

const MainPhotosTab = ({ selectedFiles, onFileChange, scope_sheet_uuid, presentations_images, onUpdate }: MainPhotosTabProps) => {
  const { data: session } = useSession();
  const token = session?.user?.token ?? "";

  const {
    handleDelete,
    refreshItems,
    loading,
    error,
    items
  } = useScopeSheetPresentationSync(token);

  const { uploadImages } = useScopeSheetPresentation(token);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const filteredImages = useMemo(() => {
    console.log('Raw images:', presentations_images); // Debug
    if (!presentations_images?.length) {
      return [];
    }
    return presentations_images.filter(img => !img.deleted_at);
  }, [presentations_images]);

  const handleFileChange = useCallback((section: "front_house" | "house_number") => (files: FileList) => {
    const filesArray = Array.from(files);

    uploadImages(scope_sheet_uuid, filesArray, section)
      .then(() => onFileChange(section)(files))
      .then(() => refreshItems())
      .then(() => onUpdate())
      .then(() =>
        setSnackbar({
          open: true,
          message: 'Images uploaded successfully',
          severity: 'success',
        })
      )
      .catch((error) => {
        console.error('Error uploading images:', error);
        setSnackbar({
          open: true,
          message: 'Failed to upload images',
          severity: 'error',
        });
      });
  }, [scope_sheet_uuid, onFileChange, refreshItems, uploadImages, onUpdate]);

  const handleDeleteImage = useCallback(async (uuid: string) => {
    try {
      await handleDelete(uuid);
      await refreshItems(); // Always refresh to ensure UI is in sync
      await onUpdate(); // Ensure getItem is awaited

      setSnackbar({
        open: true,
        message: 'Image deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete image',
        severity: 'error'
      });
      await refreshItems(); // Refresh on error as well
    }
  }, [handleDelete, refreshItems, onUpdate]);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageSelect = useCallback((imagePath: string) => {
    setSelectedImage(imagePath);
  }, []);

  const memoizedHomePhotos = useMemo(() => (
    <HomePhotos
      onFileChange={handleFileChange}
      onImageSelect={handleImageSelect}
      onDeleteImage={handleDeleteImage}
      presentations_images={filteredImages}
      loading={loading}
    />
  ), [handleFileChange, handleImageSelect, handleDeleteImage, filteredImages, loading]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box>
      {memoizedHomePhotos}
      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
};

export default MainPhotosTab;
