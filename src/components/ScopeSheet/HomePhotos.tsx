import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import FeedbackSnackbar from "../../../app/components/FeedbackSnackbar";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Video from "yet-another-react-lightbox/plugins/video";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { Slide, SlideImage, SlideVideo } from "yet-another-react-lightbox";
import Checkbox from "@mui/material/Checkbox";
import ShareIcon from "@mui/icons-material/Share";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { blue, green, red } from "@mui/material/colors";

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
  onReorderImages: (newOrder: string[]) => Promise<void>;
  onShareViaEmail?: (images: string[]) => void;
  onShareViaWhatsApp?: (images: string[]) => void;
}

const SortableImage = ({
  image,
  index,
  onPreview,
  onDownload,
  onEdit,
  onDelete,
  selected,
  onSelect,
}: {
  image: { path: string; uuid: string };
  index: number;
  onPreview: () => void;
  onDownload: () => void;
  onEdit: () => void;
  onDelete: () => void;
  selected: boolean;
  onSelect: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: image.uuid,
  });

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1000 : 1,
        opacity: isDragging ? 0.5 : 1,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-id={image.uuid}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          "&:hover .overlay": { opacity: 1 },
          "&:hover .checkbox-overlay": { opacity: 1 },
        }}
      >
        <Box
          {...attributes}
          {...listeners}
          sx={{
            position: "relative",
            width: "100%",
            height: "180px",
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          <Image
            src={image.path}
            alt={`Presentation ${index + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: "cover",
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
            pointerEvents: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              pointerEvents: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              size="small"
              onClick={onPreview}
              sx={{
                color: "white",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={onDownload}
              sx={{
                color: "white",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <DownloadIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={onEdit}
              sx={{
                color: "white",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={onDelete}
              sx={{
                color: "#f44336",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Box
          className="checkbox-overlay"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            opacity: 0,
            transition: "opacity 0.2s",
            zIndex: 2,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "4px",
            ".MuiCheckbox-root": {
              padding: 0.5,
            },
          }}
        >
          <Checkbox
            checked={selected}
            onChange={onSelect}
            onClick={(e) => e.stopPropagation()}
          />
        </Box>
      </Box>
    </motion.div>
  );
};

const HomePhotos: React.FC<HomePhotosProps> = ({
  onFileChange,
  onImageSelect,
  onDeleteImage,
  onUpdateImage,
  presentations_images,
  loading,
  scope_sheet_uuid,
  onReorderImages,
  onShareViaEmail,
  onShareViaWhatsApp,
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
  const [previewImages, setPreviewImages] = useState<{
    [key: number]: { file: File; preview: string } | null;
  }>({});
  const [editPreviewImage, setEditPreviewImage] = useState<{
    uuid: string;
    preview: string;
    file: File;
  } | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleEditClick = (
    uuid: string,
    ref: React.RefObject<HTMLInputElement>
  ) => {
    if (ref.current) {
      ref.current.dataset.uuid = uuid;
      ref.current.click();
    }
  };

  const handleEditFileChange =
    (uuid: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            setEditPreviewImage({
              uuid,
              preview: result,
              file: file,
            });
          }
        };
        reader.readAsDataURL(file);
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
    if (presentations_images) {
      const frontHouseImages = presentations_images
        .filter((img) => img.photo_type === "front_house" && !img.deleted_at)
        .sort((a, b) => (a.photo_order || 0) - (b.photo_order || 0))
        .map((img) => ({
          path: img.photo_path || "",
          uuid: img.uuid || "",
        }));
      setPresentationImages(frontHouseImages);
    }
  }, [presentations_images]);

  useEffect(() => {
    setMainImage(filteredHouseNumberImage);
  }, [filteredHouseNumberImage]);

  const getLightboxSlides = useMemo(() => {
    const slides: Slide[] = [];

    if (mainImage) {
      slides.push({
        src: mainImage.path,
        title: "House Number",
        description: "Main house number photo",
      } as SlideImage);
    }

    presentationImages.forEach((image, index) => {
      const isVideo = image.path.toLowerCase().endsWith(".mp4");
      if (isVideo) {
        slides.push({
          type: "video",
          src: image.path,
          sources: [{ src: image.path, type: "video/mp4" }],
          title: `Front House Video ${index + 1}`,
          description: "Front house video presentation",
        } as SlideVideo);
      } else {
        slides.push({
          src: image.path,
          title: `Front House Photo ${index + 1}`,
          description: "Front house photo presentation",
        } as SlideImage);
      }
    });

    return slides;
  }, [mainImage, presentationImages]);

  const handleImagePreview = (imagePath: string) => {
    const index = getLightboxSlides.findIndex((slide) => {
      if ("type" in slide && slide.type === "video") {
        return slide.sources?.[0]?.src === imagePath;
      }
      return (slide as SlideImage).src === imagePath;
    });

    if (index !== -1) {
      setLightboxIndex(index);
      setLightboxOpen(true);
    }
  };

  const handleMainImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [onFileChange]
  );

  const handlePresentationImages = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFileChange("front_house")(files);
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            setPresentationImages((prevImages) =>
              [...prevImages, { path: result, uuid: "" }].slice(0, 3)
            );
          }
        };
        reader.readAsDataURL(files[0]);
      }
    },
    [onFileChange]
  );

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
      setPresentationImages((current) =>
        current.filter((img) => img.uuid !== selectedImageToDelete.uuid)
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

  const removePresentationImage = useCallback(
    (index: number, uuid: string) => {
      const imageToDelete = presentationImages[index];
      if (imageToDelete) {
        handleDeleteClick(imageToDelete);
      }
    },
    [presentationImages]
  );

  const removeMainImage = () => {
    if (mainImage) {
      handleDeleteClick(mainImage);
    }
  };

  const handlePresentationPreview =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            setPreviewImages((prev) => ({
              ...prev,
              [index]: { file, preview: result },
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    };

  const handleConfirmUpload = async (index: number) => {
    const previewImage = previewImages[index];
    if (previewImage) {
      const fileList = new DataTransfer();
      fileList.items.add(previewImage.file);
      await onFileChange("front_house")(fileList.files);
      // Clear preview after successful upload
      setPreviewImages((prev) => ({
        ...prev,
        [index]: null,
      }));
    }
  };

  const handleCancelUpload = (index: number) => {
    setPreviewImages((prev) => ({
      ...prev,
      [index]: null,
    }));
  };

  const handleCancelEdit = () => {
    setEditPreviewImage(null);
  };

  const handleConfirmEdit = async () => {
    if (editPreviewImage && scope_sheet_uuid) {
      setEditLoading(true);
      try {
        await onUpdateImage(editPreviewImage.uuid, editPreviewImage.file);
        setEditPreviewImage(null);
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
      } finally {
        setEditLoading(false);
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = presentationImages.findIndex(
      (img) => img.uuid === active.id
    );
    const newIndex = presentationImages.findIndex(
      (img) => img.uuid === over.id
    );

    if (oldIndex === -1 || newIndex === -1) return;

    // Update local state optimistically
    const newOrder = arrayMove(presentationImages, oldIndex, newIndex);
    setPresentationImages(newOrder);

    try {
      // Get UUIDs from the new order
      const frontHouseUuids = newOrder.map((img) => img.uuid);
      await onReorderImages(frontHouseUuids);
    } catch (error) {
      console.error("Error reordering images:", error);
      // Revert to original order on error
      if (presentations_images) {
        const originalOrder = presentations_images
          .filter((img) => img.photo_type === "front_house" && !img.deleted_at)
          .sort((a, b) => (a.photo_order || 0) - (b.photo_order || 0))
          .map((img) => ({
            path: img.photo_path || "",
            uuid: img.uuid || "",
          }));
        setPresentationImages(originalOrder);
      }
      setSnackbar({
        open: true,
        message: "Failed to reorder images",
        severity: "error",
      });
    }
  };

  const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setAnchorEl(null);
  };

  const handleShareViaEmail = () => {
    const selectedImageUrls = Array.from(selectedImages)
      .map((uuid) => {
        const image = presentationImages.find((img) => img.uuid === uuid);
        return image?.path;
      })
      .filter(Boolean);

    const subject = encodeURIComponent("Shared Photos");
    const body = encodeURIComponent(
      "Here are the shared photos:\n\n" + selectedImageUrls.join("\n")
    );

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    handleShareClose();
  };

  const handleShareViaWhatsApp = () => {
    const selectedImageUrls = Array.from(selectedImages)
      .map((uuid) => {
        const image = presentationImages.find((img) => img.uuid === uuid);
        return image?.path;
      })
      .filter(Boolean);

    const text = encodeURIComponent(
      "Check out these photos:\n\n" + selectedImageUrls.join("\n")
    );

    // WhatsApp API URL
    const whatsappUrl = `https://api.whatsapp.com/send?text=${text}`;

    // Open in new tab
    window.open(whatsappUrl, "_blank");
    handleShareClose();
  };

  const handleImageSelect = (uuid: string) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(uuid)) {
        newSet.delete(uuid);
      } else {
        newSet.add(uuid);
      }
      return newSet;
    });
  };

  return (
    <Box sx={{ maxWidth: "4xl", mx: 0, "& > *": { mb: 3 } }}>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Front House Photos
            </Typography>

            {/* Action buttons */}
            {selectedImages.size > 0 && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<ShareIcon />}
                  onClick={handleShareClick}
                  sx={{
                    bgcolor: blue[500],
                    "&:hover": { bgcolor: blue[700] },
                  }}
                >
                  Share Photos
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => {
                    Array.from(selectedImages).forEach((uuid) => {
                      const image = presentationImages.find(
                        (img) => img.uuid === uuid
                      );
                      if (image) handleDownload(image.path);
                    });
                  }}
                  sx={{
                    bgcolor: green[500],
                    "&:hover": { bgcolor: green[700] },
                  }}
                >
                  Download Selected
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    Array.from(selectedImages).forEach((uuid) => {
                      const image = presentationImages.find(
                        (img) => img.uuid === uuid
                      );
                      if (image) handleDeleteClick(image);
                    });
                  }}
                  color="error"
                  sx={{
                    bgcolor: red[500],
                    "&:hover": { bgcolor: red[700] },
                  }}
                >
                  Delete Selected
                </Button>
              </Box>
            )}
          </Box>

          {/* Share Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleShareClose}
          >
            <MenuItem onClick={handleShareViaEmail}>
              <EmailIcon sx={{ mr: 1 }} /> Share via Email
            </MenuItem>
            <MenuItem onClick={handleShareViaWhatsApp}>
              <WhatsAppIcon sx={{ mr: 1, color: green[500] }} /> Share via
              WhatsApp
            </MenuItem>
          </Menu>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Grid container spacing={2}>
              <SortableContext
                items={presentationImages.map((img) => img.uuid)}
                strategy={rectSortingStrategy}
              >
                <AnimatePresence>
                  {presentationImages.map((image, index) => (
                    <Grid item xs={12} sm={6} md={4} key={image.uuid}>
                      <SortableImage
                        image={image}
                        index={index}
                        onPreview={() => handleImagePreview(image.path)}
                        onDownload={() => handleDownload(image.path)}
                        onEdit={() =>
                          handleEditClick(image.uuid, editFrontHouseRef)
                        }
                        onDelete={() =>
                          removePresentationImage(index, image.uuid)
                        }
                        selected={selectedImages.has(image.uuid)}
                        onSelect={() => handleImageSelect(image.uuid)}
                      />
                    </Grid>
                  ))}
                </AnimatePresence>
              </SortableContext>

              {/* Add Photo Button */}
              {presentationImages.length < 3 && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box
                    sx={{
                      height: "180px",
                      border: "2px dashed",
                      borderColor: "grey.300",
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      cursor: "pointer",
                    }}
                    component="label"
                  >
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handlePresentationImages}
                    />
                    <CameraAltIcon sx={{ fontSize: 48, color: "grey.500" }} />
                    <Typography sx={{ mt: 1, color: "grey.500" }}>
                      Add photo
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </DndContext>
        </CardContent>
      </Card>

      {/* House Number Photos Card */}
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold" }}>
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
                <Box
                  sx={{ position: "relative", width: "100%", height: "256px" }}
                >
                  <Image
                    src={mainImage.path}
                    alt="Main"
                    fill
                    sizes="100vw"
                    style={{
                      objectFit: "contain",
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
                    onClick={() =>
                      handleEditClick(mainImage.uuid, editHouseNumberRef)
                    }
                    sx={{ color: "white" }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={removeMainImage}
                    sx={{ color: "#f44336" }}
                  >
                    <DeleteIcon />
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

      {/* Edit Preview Dialog */}
      <Dialog
        open={!!editPreviewImage}
        onClose={handleCancelEdit}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            textAlign: "center",
            mb: 3,
            fontWeight: "bold",
          }}
        >
          Edit Image
        </DialogTitle>
        <DialogContent>
          {editPreviewImage && (
            <Box sx={{ position: "relative", width: "100%", height: "400px" }}>
              <Image
                src={editPreviewImage.preview}
                alt="Edit preview"
                fill
                style={{ objectFit: "contain" }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCancelEdit}
            color="inherit"
            disabled={editLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmEdit}
            color="primary"
            variant="contained"
            disabled={editLoading}
            startIcon={editLoading ? <CircularProgress size={20} /> : null}
          >
            {editLoading ? "Saving..." : "Save Changes"}
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

      {/* Feedback Snackbar */}
      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="md"
        fullWidth
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
            <Box sx={{ position: "relative", width: "100%", height: "400px" }}>
              <Image
                src={selectedImageToDelete.path}
                alt="To delete"
                fill
                style={{ objectFit: "contain" }}
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

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={getLightboxSlides}
        plugins={[Captions, Fullscreen, Slideshow, Thumbnails, Video, Zoom]}
        carousel={{
          spacing: 0,
          padding: 0,
        }}
        thumbnails={{
          position: "bottom",
          width: 120,
          height: 80,
          gap: 2,
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
        video={{
          autoPlay: false,
          controls: true,
          playsInline: true,
          muted: false,
          loop: false,
          preload: "metadata",
        }}
        slideshow={{
          autoplay: false,
          delay: 5000,
        }}
        captions={{
          showToggle: true,
          descriptionTextAlign: "center",
        }}
      />
    </Box>
  );
};

export default HomePhotos;
