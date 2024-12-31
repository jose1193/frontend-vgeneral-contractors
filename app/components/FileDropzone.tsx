import React, { useState } from 'react';
import { 
  Paper, 
  Button, 
  Typography, 
  Box, 
  IconButton, 
  Dialog,
  DialogContent,
  Grid
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

interface FileDropzoneProps {
  title: string;
  onFilesSelected: (files: FileList) => void;
  selectedFiles: FileList | null;
  inputId: string;
}

interface PreviewFile {
  url: string;
  file: File;
}

const FileDropzone = ({ title, onFilesSelected, selectedFiles, inputId }: FileDropzoneProps) => {
  const [previews, setPreviews] = useState<PreviewFile[]>([]);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesSelected(event.target.files);
      
      // Create previews for the selected files
      const newFiles = Array.from(event.target.files);
      Promise.all(
        newFiles.map(file => {
          return new Promise<PreviewFile>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                url: e.target?.result as string,
                file: file
              });
            };
            reader.readAsDataURL(file);
          });
        })
      ).then(results => {
        setPreviews(results);
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    
    // Create new FileList from remaining files
    const dt = new DataTransfer();
    newPreviews.forEach(preview => dt.items.add(preview.file));
    onFilesSelected(dt.files);
  };

  return (
    <Box>
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          backgroundColor: "#f5f5f5",
          textAlign: "center",
          cursor: "pointer",
          '&:hover': {
            backgroundColor: "#eeeeee"
          }
        }}
      >
        <input
          type="file"
          id={inputId}
          multiple
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <label htmlFor={inputId}>
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
          >
            Choose Files
          </Button>
        </label>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {selectedFiles
            ? `${selectedFiles.length} files selected`
            : "Drop files here or click to select"}
        </Typography>
      </Paper>

      {/* Image Previews */}
      {previews.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {previews.map((preview, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Paper
                sx={{
                  position: 'relative',
                  p: 1,
                  '&:hover .preview-actions': {
                    opacity: 1
                  }
                }}
              >
                <img
                  src={preview.url}
                  alt={`Preview ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                />
                <Box
                  className="preview-actions"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    borderRadius: '4px'
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => setSelectedPreview(preview.url)}
                    sx={{ color: 'white', mr: 1 }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFile(index)}
                    sx={{ color: 'white' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={!!selectedPreview}
        onClose={() => setSelectedPreview(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedPreview && (
            <img
              src={selectedPreview}
              alt="Preview"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain'
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FileDropzone;
