import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Paper } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  SUPPORTED_FORMATS,
  MAX_FILE_SIZE,
} from "../../../app/types/document-template";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  error?: string;
  selectedFile: File | null;
  onChange?: (file: File | null) => void;
  initialFile?: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  error,
  selectedFile,
  onChange,
  initialFile,
  ...rest
}) => {
  const displayFileName = selectedFile?.name || initialFile?.name;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onFileSelect(file);
        onChange?.(file);
      }
    },
    [onFileSelect, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: SUPPORTED_FORMATS.reduce(
      (acc, format) => ({ ...acc, [format]: [] }),
      {}
    ),
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          border: "2px dashed",
          borderColor: error
            ? "error.main"
            : isDragActive
            ? "primary.main"
            : "grey.300",
          bgcolor: isDragActive ? "action.hover" : "background.paper",
          cursor: "pointer",
          "&:hover": {
            borderColor: "primary.main",
          },
        }}
      >
        <input {...getInputProps()} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CloudUploadIcon
            color={error ? "error" : "primary"}
            sx={{ fontSize: 48 }}
          />
          <Typography variant="body1" color={error ? "error" : "textPrimary"}>
            {selectedFile
              ? `Selected file: ${selectedFile.name}`
              : isDragActive
              ? "Drop the file here"
              : "Drag and drop a file here, or click to select"}
          </Typography>
          {error && (
            <Typography variant="caption" color="error">
              {error}
            </Typography>
          )}
          <Typography variant="caption" color="textSecondary">
            Supported formats: PDF, DOC, DOCX (Max size: 15MB)
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default FileUpload;
