import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as api from '../../utils/api';
import FileUpload from '../../components/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 40px;
`;

const FormTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #0087a8;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: ${props => props.$secondary ? '#f5f5f5' : '#4caf50'};
  color: ${props => props.$secondary ? '#333' : 'white'};
  border: ${props => props.$secondary ? '1px solid #ddd' : 'none'};
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.$secondary ? '#e5e5e5' : '#3d8b40'};
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const AddImageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 20px;
  
  svg {
    margin-right: 5px;
  }
  
  &:hover {
    background-color: #1976d2;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  margin-top: 5px;
  font-size: 14px;
`;

const GalleryImagesContainer = styled.div`
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const GalleryImagesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
`;

const GalleryImageItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background: white;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`;

const GalleryImageWrapper = styled.div`
  position: relative;
  height: 180px;
  overflow: hidden;
  border-radius: 4px 4px 0 0;
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const GalleryImageCaption = styled.input`
  width: 100%;
  padding: 8px;
  border: none;
  border-top: 1px solid #ddd;
  font-size: 14px;
  
  &:focus {
    outline: none;
    background-color: #f9f9f9;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const NoImagesMessage = styled.div`
  text-align: center;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
  color: #666;
`;

const GalleryForm = ({ initialData, isEditing = false }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [images, setImages] = useState([]);
  const [showUploader, setShowUploader] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Initialize form data when editing and initialData is available
  useEffect(() => {
    if (isEditing && initialData) {
      setTitle(initialData.title || '');
      
      // Make sure we properly handle the images array
      if (initialData.images && Array.isArray(initialData.images)) {
        // Make sure each image has the required properties
        const processedImages = initialData.images.map(img => ({
          url: img.url,
          public_id: img.public_id || null,
          caption: img.caption || ''
        }));
        setImages(processedImages);
      }
    }
  }, [initialData, isEditing]);
  
  const navigate = useNavigate();
  
  // Handle image upload success
  const handleImageUploadSuccess = (imageData) => {
    // Add the new image to the gallery
    setImages([
      ...images,
      {
        url: imageData.url,
        public_id: imageData.public_id,
        caption: ''
      }
    ]);
    
    // Hide the uploader after successful upload
    setShowUploader(false);
  };
  
  // Handle image caption change
  const handleCaptionChange = (index, caption) => {
    const updatedImages = [...images];
    updatedImages[index].caption = caption;
    setImages(updatedImages);
  };
  
  // Handle image removal
  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (images.length === 0) {
      setError('At least one image is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const galleryData = {
        title,
        images
      };
      
      if (isEditing) {
        await api.updateGallery(initialData._id, galleryData);
      } else {
        await api.createGallery(galleryData);
      }
      
      // Redirect back to galleries list
      navigate('/admin/galleries');
    } catch (error) {
      console.error('Gallery form error:', error);
      setError(error.response?.data?.message || 'Error saving gallery');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FormContainer>
      <FormTitle>{isEditing ? 'Edit Gallery' : 'Create New Gallery'}</FormTitle>
      {isEditing && initialData && (
        <div style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
          Gallery ID: {initialData._id} • Contains: {images.length} image{images.length !== 1 ? 's' : ''}
        </div>
      )}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Gallery Title</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter gallery title"
            required
          />
        </FormGroup>
        
        <GalleryImagesContainer>
          <Label>Gallery Images</Label>
          
          {!showUploader && (
            <AddImageButton 
              type="button"
              onClick={() => setShowUploader(true)}
            >
              <AddIcon /> Add Image
            </AddImageButton>
          )}
          
          {showUploader && (
            <FileUpload
              type="image"
              label="Upload Gallery Image"
              onUploadSuccess={handleImageUploadSuccess}
              onUploadError={(msg) => setError(msg)}
              onRemove={() => setShowUploader(false)}
            />
          )}
          
          {images.length > 0 ? (
            <GalleryImagesList>
              {images.map((image, index) => (
                <GalleryImageItem key={index}>
                  <GalleryImageWrapper>
                    <GalleryImage src={image.url} alt={image.caption || `Gallery image ${index + 1}`} />
                    <DeleteButton 
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      title="Remove image"
                    >
                      <DeleteIcon fontSize="small" />
                    </DeleteButton>
                  </GalleryImageWrapper>
                  <GalleryImageCaption
                    type="text"
                    value={image.caption || ''}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    placeholder="Add caption..."
                  />
                </GalleryImageItem>
              ))}
            </GalleryImagesList>
          ) : (
            <NoImagesMessage>
              No images added yet. Click "Add Image" to upload images to this gallery.
            </NoImagesMessage>
          )}
        </GalleryImagesContainer>
        
        <ButtonContainer>
          <Button 
            type="button" 
            $secondary 
            onClick={() => navigate('/admin/galleries')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Gallery' : 'Create Gallery')}
          </Button>
        </ButtonContainer>
      </form>
    </FormContainer>
  );
};

export default GalleryForm;
