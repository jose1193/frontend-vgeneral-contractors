import React, { useCallback, useState, useMemo } from "react";
import { Box } from "@mui/material";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";
import HomePhotos from "./HomePhotos";
import { useSession } from "next-auth/react";
import { useScopeSheetPresentationSync } from "../../hooks/Scope-Sheet-Presentation/useScopeSheetPresentationSync";
import { useScopeSheetPresentation } from "../../hooks/Scope-Sheet-Presentation/useScopeSheetPresentation";
import {
  ScopeSheetPresentationData,
  ScopeSheetPresentationUpdateDTO,
} from "../../../app/types/scope-sheet-presentation";
import { ScopeSheetData } from "../../../app/types/scope-sheet";

interface MainPhotosTabProps {
  selectedFiles: {
    front_house: FileList | null;
    house_number: FileList | null;
  };
  onFileChange: (
    section: "front_house" | "house_number"
  ) => (files: FileList) => void;
  scope_sheet_uuid: string;
  presentations_images?: ScopeSheetPresentationData[];
  onUpdate: () => Promise<ScopeSheetData | null>;
}

const MainPhotosTab = ({
  selectedFiles,
  onFileChange,
  scope_sheet_uuid,
  presentations_images,
  onUpdate,
}: MainPhotosTabProps) => {
  const { data: session } = useSession();
  const token = session?.user?.token ?? "";

  const { handleDelete, refreshItems, loading, error, items, handleUpdate } =
    useScopeSheetPresentationSync(token);

  const { uploadImages } = useScopeSheetPresentation(token);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const filteredImages = useMemo(() => {
    console.log("Raw images:", presentations_images); // Debug
    if (!presentations_images?.length) {
      return [];
    }
    return presentations_images.filter((img) => !img.deleted_at);
  }, [presentations_images]);

  const handleFileChange = useCallback(
    (section: "front_house" | "house_number") => (files: FileList) => {
      const filesArray = Array.from(files);

      uploadImages(scope_sheet_uuid, filesArray, section)
        .then(() => onFileChange(section)(files))
        .then(() => refreshItems())
        .then(() => onUpdate())
        .then(() =>
          setSnackbar({
            open: true,
            message: "Images uploaded successfully",
            severity: "success",
          })
        )
        .catch((error) => {
          console.error("Error uploading images:", error);
          setSnackbar({
            open: true,
            message: "Failed to upload images",
            severity: "error",
          });
        });
    },
    [scope_sheet_uuid, onFileChange, refreshItems, uploadImages, onUpdate]
  );

  const handleDeleteImage = useCallback(
    async (uuid: string) => {
      try {
        await handleDelete(uuid);
        await refreshItems(); // Always refresh to ensure UI is in sync
        await onUpdate(); // Ensure getItem is awaited

        setSnackbar({
          open: true,
          message: "Image deleted successfully",
          severity: "success",
        });
      } catch (error) {
        console.error("Error deleting image:", error);
        setSnackbar({
          open: true,
          message: "Failed to delete image",
          severity: "error",
        });
        await refreshItems(); // Refresh on error as well
      }
    },
    [handleDelete, refreshItems, onUpdate]
  );

  const handleSnackbarClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageSelect = useCallback((imagePath: string) => {
    setSelectedImage(imagePath);
  }, []);

  const handleUpdateImage = useCallback(
    async (uuid: string, file: File) => {
      try {
        // Find the image to determine its photo_type
        const imageToUpdate = presentations_images?.find(
          (img) => img.uuid === uuid
        );
        if (!imageToUpdate) {
          throw new Error("Image not found");
        }

        if (!imageToUpdate.photo_type) {
          throw new Error("Invalid photo type");
        }

        const updateData: ScopeSheetPresentationUpdateDTO & {
          scope_sheet_uuid: string;
        } = {
          photo_type: imageToUpdate.photo_type,
          scope_sheet_uuid,
        };

        await handleUpdate(uuid, updateData, [file]);
        await refreshItems();
        await onUpdate();

        setSnackbar({
          open: true,
          message: "Image updated successfully",
          severity: "success",
        });
      } catch (error) {
        console.error("Error updating image:", error);
        setSnackbar({
          open: true,
          message: "Failed to update image",
          severity: "error",
        });
        await refreshItems();
      }
    },
    [
      handleUpdate,
      refreshItems,
      onUpdate,
      presentations_images,
      scope_sheet_uuid,
    ]
  );

  const memoizedHomePhotos = useMemo(
    () => (
      <HomePhotos
        onFileChange={handleFileChange}
        onImageSelect={handleImageSelect}
        onDeleteImage={handleDeleteImage}
        onUpdateImage={handleUpdateImage}
        presentations_images={filteredImages}
        loading={loading}
        scope_sheet_uuid={scope_sheet_uuid}
      />
    ),
    [
      handleFileChange,
      handleImageSelect,
      handleDeleteImage,
      handleUpdateImage,
      filteredImages,
      loading,
      scope_sheet_uuid,
    ]
  );

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
