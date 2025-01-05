import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import { ScopeSheetPresentationData } from "../../../app/types/scope-sheet-presentation";
import Image from "next/image";

interface HomePhotosProps {
  onFileChange: (
    section: "front_house" | "house_number"
  ) => (files: FileList) => void;
  onImageSelect: (image: string) => void;
  onDeleteImage: (uuid: string) => void;
  onUpdateImage: (uuid: string, file: File) => void;
  presentations_images?: ScopeSheetPresentationData[];
  loading?: boolean;
  scope_sheet_uuid: string;
}

const HomePhotos: React.FC<HomePhotosProps> = ({
  onFileChange,
  onImageSelect,
  onDeleteImage,
  onUpdateImage,
  presentations_images,
  loading,
  scope_sheet_uuid,
}) => {
  const editFrontHouseRef = useRef<HTMLInputElement>(null);
  const editHouseNumberRef = useRef<HTMLInputElement>(null);
  
  // State declarations
  const [mainImage, setMainImage] = useState<{
    path: string;
    uuid: string;
  } | null>(null);
  const [presentationImages, setPresentationImages] = useState<
    Array<{ path: string; uuid: string }>
  >([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImageToDelete, setSelectedImageToDelete] = useState<{
    path: string;
    uuid: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleEditClick = (uuid: string, ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.dataset.uuid = uuid;
      ref.current.click();
    }
  };

  const handleEditFileChange = (uuid: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && scope_sheet_uuid) {
      await onUpdateImage(uuid, files[0]);
    }
  };

  const handleDownload = async (imagePath: string) => {
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const filteredFrontHouseImages = useMemo(() => {
    if (!presentations_images) return [];
    return presentations_images
      .filter((img) => img.photo_type === "front_house" && !img.deleted_at)
      .sort((a, b) => (a.photo_order || 0) - (b.photo_order || 0))
      .map((img) => ({
        path: img.photo_path || "",
        uuid: img.uuid || "",
      }));
  }, [presentations_images]);

  const filteredHouseNumberImage = useMemo(() => {
    if (!presentations_images) return null;
    const houseNumberImage = presentations_images.find(
      (img) => img.photo_type === "house_number" && !img.deleted_at
    );
    return houseNumberImage
      ? {
          path: houseNumberImage.photo_path || "",
          uuid: houseNumberImage.uuid || "",
        }
      : null;
  }, [presentations_images]);

  useEffect(() => {
    setPresentationImages(filteredFrontHouseImages);
  }, [filteredFrontHouseImages]);

  useEffect(() => {
    setMainImage(filteredHouseNumberImage);
  }, [filteredHouseNumberImage]);

  const handleImagePreview = (imagePath: string) => {
    setSelectedImage(imagePath);
  };

  const handleMainImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileChange("house_number")(files);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setMainImage({ path: result, uuid: "" });
        }
      };
      reader.readAsDataURL(files[0]);
    }
  }, [onFileChange]);

  const handlePresentationImages = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileChange("front_house")(files);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setPresentationImages((prevImages) =>
            [...prevImages, { path: result, uuid: "" }].slice(0, 4)
          );
        }
      };
      reader.readAsDataURL(files[0]);
    }
  }, [onFileChange]);

  const handleDeleteClick = (image: { path: string; uuid: string }) => {
    setSelectedImageToDelete(image);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedImageToDelete?.uuid) return;

    setDeleting(true);
    try {
      await onDeleteImage(selectedImageToDelete.uuid);
      
      // Immediately update local state
      if (mainImage?.uuid === selectedImageToDelete.uuid) {
        setMainImage(null);
      }
      setPresentationImages(current => 
        current.filter(img => img.uuid !== selectedImageToDelete.uuid)
      );
      
      // Close preview if the deleted image is currently being previewed
      if (selectedImage === selectedImageToDelete.path) {
        setSelectedImage(null);
      }
      
    } catch (error) {
      console.error("Failed to delete image:", error);
    } finally {
      setDeleting(false);
      setSelectedImageToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const removePresentationImage = useCallback((index: number, uuid: string) => {
    const imageToDelete = presentationImages[index];
    if (imageToDelete) {
      handleDeleteClick(imageToDelete);
    }
  }, [presentationImages]);

  const removeMainImage = () => {
    if (mainImage) {
      handleDeleteClick(mainImage);
    }
  };

  return (
    <Box sx={{ maxWidth: "4xl", mx: "auto", "& > *": { mb: 3 } }}>
      {/* Front House Card */}
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            Front House Photos
          </Typography>
          <Grid container spacing={2}>
            {[...Array(4)].map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: "grey.300",
                    borderRadius: 1,
                    p: 2,
                    height: "160px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {presentationImages[index] ? (
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        "&:hover .overlay": { opacity: 1 },
                      }}
                    >
                      <Box sx={{ position: 'relative', width: '100%', height: '140px' }}>
                        <Image
                          src={presentationImages[index].path}
                          alt={`Presentation ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{
                            objectFit: 'cover',
                            borderRadius: "4px",
                          }}
                          priority
                        />
                      </Box>
                      <Box
                        className="overlay"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          bgcolor: "rgba(0, 0, 0, 0.5)",
                          opacity: 0,
                          transition: "opacity 0.2s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                          borderRadius: 1,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleImagePreview(presentationImages[index].path)
                          }
                          sx={{ color: "white" }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleDownload(presentationImages[index].path)
                          }
                          sx={{ color: "white" }}
                        >
                          <DownloadIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() =>
                            removePresentationImage(
                              index,
                              presentationImages[index].uuid
                            )
                          }
                          sx={{ color: "#f44336" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(presentationImages[index].uuid, editFrontHouseRef)}
                          sx={{ color: "white" }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  ) : (
                    <label
                      style={{
                        cursor: "pointer",
                        textAlign: "center",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CameraAltIcon sx={{ fontSize: 32, color: "grey.500" }} />
                      <Typography
                        variant="caption"
                        sx={{ mt: 1, color: "grey.500" }}
                      >
                        Photo {index + 1}
                      </Typography>
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handlePresentationImages}
                      />
                    </label>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* House Number Photos Card */}
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            House Number Photo
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed",
              borderColor: "grey.300",
              borderRadius: 1,
              p: 3,
              minHeight: "200px",
            }}
          >
            {mainImage ? (
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  "&:hover .overlay": { opacity: 1 },
                }}
              >
                <Box sx={{ position: 'relative', width: '100%', height: '256px' }}>
                  <Image
                    src={mainImage.path}
                    alt="Main"
                    fill
                    sizes="100vw"
                    style={{
                      objectFit: 'contain',
                    }}
                    priority
                  />
                </Box>
                <Box
                  className="overlay"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    opacity: 0,
                    transition: "opacity 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    borderRadius: 1,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleImagePreview(mainImage.path)}
                    sx={{ color: "white" }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDownload(mainImage.path)}
                    sx={{ color: "white" }}
                  >
                    <DownloadIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={removeMainImage}
                    sx={{ color: "#f44336" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleEditClick(mainImage.uuid, editHouseNumberRef)}
                    sx={{ color: "white" }}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
              </Box>
            ) : (
              <label style={{ cursor: "pointer", textAlign: "center" }}>
                <CameraAltIcon sx={{ fontSize: 48, color: "grey.500" }} />
                <Typography sx={{ mt: 1, color: "grey.500" }}>
                  Upload main photo
                </Typography>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleMainImage}
                />
              </label>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
            position: "relative",
          },
        }}
      >
        <DialogContent sx={{ position: "relative", p: 0, overflow: "hidden" }}>
          {selectedImage && (
            <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
              <Box sx={{ position: 'relative', width: '100%', height: '80vh' }}>
                <Image
                  src={selectedImage}
                  alt="Preview"
                  fill
                  sizes="100vw"
                  style={{
                    objectFit: 'contain',
                  }}
                  priority
                />
              </Box>
              <IconButton
                onClick={() => setSelectedImage(null)}
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  color: "white",
                  bgcolor: "rgba(239, 68, 68, 0.7)",
                  "&:hover": {
                    bgcolor: "rgba(239, 68, 68, 0.9)",
                  },
                  zIndex: 1300,
                  padding: "8px",
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#ef4444",
            mb: 2,
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              textAlign: "left",
              mb: 2,
              fontWeight: "bold",
            }}
          >
            Are you sure you want to delete this image?
          </Typography>
          {selectedImageToDelete && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Image
                src={selectedImageToDelete.path}
                alt="To delete"
                width={200}
                height={200}
                style={{
                  objectFit: "contain",
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleting}
            sx={{
              minWidth: "100px",
              position: "relative",
            }}
          >
            {deleting ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={20} color="inherit" />
              </Box>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hidden file inputs for editing */}
      <input
        type="file"
        hidden
        ref={editFrontHouseRef}
        accept="image/*"
        onChange={(e) => {
          const selectedUuid = editFrontHouseRef.current?.dataset.uuid;
          if (selectedUuid) handleEditFileChange(selectedUuid)(e);
        }}
      />
      <input
        type="file"
        hidden
        ref={editHouseNumberRef}
        accept="image/*"
        onChange={(e) => {
          if (mainImage?.uuid) handleEditFileChange(mainImage.uuid)(e);
        }}
      />
    </Box>
  );
};

export default HomePhotos;
