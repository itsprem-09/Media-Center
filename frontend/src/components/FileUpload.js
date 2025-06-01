import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import * as api from '../utils/api';

// Material UI components
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  CircularProgress, 
  IconButton
} from '@mui/material';

// Material UI icons
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoIcon from '@mui/icons-material/Photo';
import VideocamIcon from '@mui/icons-material/Videocam';

const UploadContainer = styled(Box)`
  margin-bottom: 24px;
  animation: fadeIn 0.4s ease forwards;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const UploadLabel = styled(Typography)`
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: var(--text-dark);
  font-size: 0.95rem;
`;

const UploadBox = styled(Paper)`
  border: 2px dashed var(--border-color);
  border-radius: 10px;
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${props => props.$isDragOver ? 'rgba(43, 109, 168, 0.05)' : 'transparent'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(to right, transparent, var(--primary-light), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    border-color: var(--primary-color);
    background-color: rgba(43, 109, 168, 0.02);
    
    &::before {
      opacity: 1;
    }
  }
`;

const UploadIcon = styled(Box)`
  margin-bottom: 16px;
  color: var(--primary-color);
  
  svg {
    font-size: 56px;
    opacity: 0.8;
    transition: all 0.3s ease;
  }
  
  ${UploadBox}:hover & svg {
    transform: translateY(-5px);
    opacity: 1;
  }
`;

const UploadText = styled(Typography)`
  margin-bottom: 10px;
  color: var(--text-medium);
  font-size: 1rem;
  line-height: 1.5;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
`;

const UploadHint = styled(Typography)`
  font-size: 0.85rem;
  color: var(--text-light);
  margin-top: 8px;
`;

const FileInput = styled('input')`
  display: none;
`;

const PreviewContainer = styled(Box)`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.4s ease forwards;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const PreviewImageWrapper = styled(Box)`
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%);
    pointer-events: none;
    z-index: 1;
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 200px; /* Fixed height to ensure proper display */
  display: block;
  object-fit: cover;
`;

const VideoPreview = styled('video')`
  width: 100%;
  max-width: 360px;
  height: auto;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const UploadStatus = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  padding: 8px 16px;
  border-radius: 20px;
  background-color: ${props => props.$error ? 'rgba(211, 47, 47, 0.1)' : props.$success ? 'rgba(76, 175, 80, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  color: ${props => props.$error ? 'var(--secondary-color)' : props.$success ? '#4caf50' : 'var(--text-medium)'};
  font-weight: 500;
  font-size: 0.9rem;
  
  svg {
    margin-right: 8px;
  }
`;

const RemoveButton = styled(Button)`
  &.MuiButton-root {
    margin-top: 16px;
    padding: 8px 16px;
    background-color: rgba(211, 47, 47, 0.1);
    color: var(--secondary-color);
    border-radius: 8px;
    text-transform: none;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: rgba(211, 47, 47, 0.2);
      transform: translateY(-2px);
    }
  }
`;

const PreviewTypeIcon = styled(Box)`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 5;
  color: white;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * Reusable file upload component that handles Cloudinary uploads
 * @param {Object} props
 * @param {string} props.type - 'image' or 'video'
 * @param {function} props.onUploadSuccess - Callback with uploaded file data
 * @param {function} props.onUploadError - Callback with error message
 * @param {function} props.onRemove - Callback when file is removed
 * @param {Object} props.initialPreview - Initial preview data (url, public_id)
 */
const FileUpload = ({ 
  type = 'image', 
  onUploadSuccess, 
  onUploadError,
  onRemove,
  initialPreview = null,
  label = 'Upload File'
}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({
    success: false,
    error: false,
    message: ''
  });
  
  // Set initial preview state right away and when it changes
  useEffect(() => {
    // Only update if we have a valid URL and it's different from current preview
    if (initialPreview && initialPreview.url) {
      // Force the preview to update with the new URL
      setPreview(null); // Clear it first to trigger a re-render
      // Use setTimeout to ensure state updates separately
      setTimeout(() => {
        setPreview(initialPreview.url);
      }, 0);
    }
  }, [initialPreview]);

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    handleFile(selectedFile);
  };
  
  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };
  
  // Common file handling logic
  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    
    // Validate file type
    if (type === 'image' && !selectedFile.type.startsWith('image/')) {
      setUploadStatus({
        success: false,
        error: true,
        message: 'Please select an image file'
      });
      return;
    }
    
    if (type === 'video' && !selectedFile.type.startsWith('video/')) {
      setUploadStatus({
        success: false,
        error: true,
        message: 'Please select a video file'
      });
      return;
    }
    
    setFile(selectedFile);
    
    // Create preview for the file
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setPreview(fileReader.result);
    };
    fileReader.readAsDataURL(selectedFile);
    
    // Upload the file to Cloudinary
    uploadFile(selectedFile);
  };
  
  // Upload file to Cloudinary
  const uploadFile = async (selectedFile) => {
    try {
      setUploading(true);
      setUploadStatus({
        success: false,
        error: false,
        message: 'Uploading...'
      });
      
      const formData = new FormData();
      formData.append(type, selectedFile);
      
      const response = type === 'image' 
        ? await api.uploadImage(formData)
        : await api.uploadVideo(formData);
      
      const uploadedData = response.data[type]; // image or video data
      
      setUploading(false);
      setUploadStatus({
        success: true,
        error: false,
        message: 'Upload successful!'
      });
      
      if (onUploadSuccess) {
        onUploadSuccess(uploadedData);
      }
    } catch (error) {
      console.error('File upload error:', error);
      setUploading(false);
      setUploadStatus({
        success: false,
        error: true,
        message: 'Upload failed. Please try again.'
      });
      
      if (onUploadError) {
        onUploadError(error.message || 'Upload failed');
      }
    }
  };
  
  // Handle file removal
  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setUploadStatus({
      success: false,
      error: false,
      message: ''
    });
    
    if (onRemove) {
      onRemove();
    }
  };
  
  return (
    <UploadContainer>
      <UploadLabel variant="body2">{label}</UploadLabel>
      
      {!preview && (
        <>
          <UploadBox
            $isDragOver={isDragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById(`file-input-${type}`).click()}
            elevation={0}
          >
            <UploadIcon>
              {type === 'image' ? <PhotoIcon fontSize="large" /> : <VideocamIcon fontSize="large" />}
            </UploadIcon>
            <UploadText variant="body1">
              Drag and drop a {type} here, or click to select
            </UploadText>
            <UploadHint variant="caption">
              Supported formats: {type === 'image' ? 'JPG, PNG, WebP' : 'MP4, WebM, MOV'}
            </UploadHint>
          </UploadBox>
          
          <FileInput
            id={`file-input-${type}`}
            type="file"
            accept={type === 'image' ? 'image/*' : 'video/*'}
            onChange={handleFileChange}
          />
        </>
      )}
      
      {preview && (
        <PreviewContainer>
          {type === 'image' ? (
            <Box position="relative">
              <PreviewTypeIcon>
                <PhotoIcon fontSize="small" />
              </PreviewTypeIcon>
              <PreviewImageWrapper>
                <ImagePreview src={preview} alt="Preview" />
              </PreviewImageWrapper>
            </Box>
          ) : (
            <Box position="relative">
              <VideoPreview controls>
                <source src={preview} />
                Your browser does not support the video tag.
              </VideoPreview>
            </Box>
          )}
          
          <UploadStatus 
            $success={uploadStatus.success} 
            $error={uploadStatus.error}
          >
            {uploading ? (
              <>
                <CircularProgress size={16} thickness={4} color="inherit" />
                <span>Uploading {type}...</span>
              </>
            ) : uploadStatus.success ? (
              <>
                <CheckCircleIcon />
                <span>{uploadStatus.message}</span>
              </>
            ) : uploadStatus.error ? (
              <>
                <ErrorIcon />
                <span>{uploadStatus.message}</span>
              </>
            ) : null}
          </UploadStatus>
          
          <RemoveButton 
            onClick={handleRemove}
            startIcon={<DeleteIcon />}
            size="small"
            variant="text"
          >
            Remove {type}
          </RemoveButton>
        </PreviewContainer>
      )}
    </UploadContainer>
  );
};

export default FileUpload;
