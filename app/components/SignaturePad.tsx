import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
} from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import Image from "next/image";

interface SignaturePadProps {
  name: string;
  onChange: (value: string | null) => void;
  maxWidth?: number;
  height?: number;
  initialValue?: string;
}

export type SignaturePadRef = {
  clear: () => void;
  isEmpty: () => boolean;
};

interface ExtendedSignatureCanvas extends SignatureCanvas {
  getTrimmedCanvas: () => HTMLCanvasElement;
}

const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(
  ({ name, onChange, maxWidth = 900, height = 200, initialValue }, ref) => {
    const sigCanvas = useRef<ExtendedSignatureCanvas>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [isEditing, setIsEditing] = useState(!initialValue);
    const [signatureImage, setSignatureImage] = useState<string | null>(
      initialValue || null
    );
    const [openDialog, setOpenDialog] = useState(false);

    useImperativeHandle(ref, () => ({
      clear: () => {
        clearSignature();
      },
      isEmpty: () => !signatureImage && (sigCanvas.current?.isEmpty() ?? true),
    }));

    const handleEnd = () => {
      if (sigCanvas.current) {
        const trimmedCanvas = sigCanvas.current.getTrimmedCanvas();
        const base64Image = trimmedCanvas.toDataURL("image/png");
        setSignatureImage(base64Image);
        onChange(base64Image);
      }
    };

    const clearSignature = () => {
      sigCanvas.current?.clear();
      setSignatureImage(null);
      setIsEditing(true);
      onChange(null);
    };

    const handleButtonClick = () => {
      if (!isEditing && initialValue) {
        setOpenDialog(true);
      } else {
        clearSignature();
      }
    };

    const handleDialogClose = () => {
      setOpenDialog(false);
    };

    const handleConfirmEdit = () => {
      clearSignature();
      setOpenDialog(false);
    };

    useEffect(() => {
      const updateCanvasWidth = () => {
        if (containerRef.current) {
          const containerWidth =
            containerRef.current.getBoundingClientRect().width;
          setCanvasWidth(Math.min(containerWidth, maxWidth));
        }
      };

      updateCanvasWidth();
      window.addEventListener("resize", updateCanvasWidth);

      return () => {
        window.removeEventListener("resize", updateCanvasWidth);
      };
    }, [maxWidth]);

    useEffect(() => {
      if (initialValue && !isEditing) {
        setSignatureImage(initialValue);
        onChange(initialValue); // Send the initial value to the parent component
      }
    }, [initialValue, isEditing, onChange]);

    // Add this new useEffect to handle changes in signatureImage
    useEffect(() => {
      if (signatureImage) {
        onChange(signatureImage);
      }
    }, [signatureImage, onChange]);

    return (
      <div
        ref={containerRef}
        style={{ width: "100%", maxWidth: `${maxWidth}px`, margin: "0 auto" }}
      >
        <div
          style={{ position: "relative", width: "100%", height: `${height}px` }}
        >
          {isEditing ? (
            <SignatureCanvas
              ref={sigCanvas as React.RefObject<SignatureCanvas>}
              onEnd={handleEnd}
              canvasProps={{
                width: canvasWidth,
                height: height,
                className: "border border-gray-300 rounded",
                style: { width: "100%", height: `${height}px` },
              }}
            />
          ) : signatureImage ? (
            <Image
              src={signatureImage}
              alt="Signature"
              layout="fill"
              objectFit="contain"
            />
          ) : null}
        </div>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "end" }}>
          <Button
            variant="contained"
            color="error"
            startIcon={<DriveFileRenameOutlineIcon />}
            onClick={handleButtonClick}
          >
            {isEditing ? "Clear Signature" : "Edit Signature"}
          </Button>
        </Box>
        <Dialog
          open={openDialog}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{
              backgroundColor: "#ef4444",
              mb: 5,
              textAlign: "center",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            {"Confirm Edit Signature"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to edit the existing signature? This will
              clear the current signature.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmEdit}
              variant="contained"
              color="error"
              autoFocus
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
);

SignaturePad.displayName = "SignaturePad";

export default SignaturePad;
