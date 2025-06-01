import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as api from '../../utils/api';
import FileUpload from '../../components/FileUpload';

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
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

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  min-height: 150px;
  resize: vertical;
  
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

const ErrorMessage = styled.div`
  color: #f44336;
  margin-top: 5px;
  font-size: 14px;
`;

const InfoMessage = styled.div`
  margin-top: 10px;
  padding: 10px;
  background-color: #e3f2fd;
  border-radius: 4px;
  color: #0d47a1;
  font-size: 14px;
`;

const VideoForm = ({ initialData, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || ''
  });
  
  const [videoData, setVideoData] = useState(initialData?.videoUrl ? {
    url: initialData.videoUrl,
    public_id: initialData.video_public_id
  } : null);
  
  const [thumbnailData, setThumbnailData] = useState(initialData?.thumbnail ? {
    url: initialData.thumbnail,
    public_id: initialData.thumbnail_public_id
  } : null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [deleteThumbnail, setDeleteThumbnail] = useState(false);
  
  const navigate = useNavigate();
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle video upload success
  const handleVideoUploadSuccess = (newlyUploadedVideoData) => {
    setVideoData(newlyUploadedVideoData); // This is the new video's data from Cloudinary

    // If a custom thumbnail is currently set (thumbnailData state has a public_id), preserve it.
    // Otherwise, use the auto-generated thumbnail from the newly uploaded video.
    if (thumbnailData && thumbnailData.public_id) {
      // A custom thumbnail is already set and active in the form. Don't override with auto.
      // User must explicitly remove the custom thumbnail or upload a new one if they want to change it.
    } else {
      // No custom thumbnail active in the form, or current one in state is auto-generated (no public_id).
      // Use the new video's auto-generated thumbnail if available.
      if (newlyUploadedVideoData.thumbnail_url) {
        setThumbnailData({
          url: newlyUploadedVideoData.thumbnail_url,
          public_id: null // Auto-generated thumbnails don't have their own public_id
        });
      } else {
        // New video doesn't have a thumbnail_url (shouldn't happen with Cloudinary video uploads that succeed)
        // Clear any existing auto-generated thumbnail from state if the new video somehow lacks one.
        if (thumbnailData && !thumbnailData.public_id) {
           setThumbnailData(null);
        }
      }
    }
  };
  
  // Handle video removal
  const handleVideoRemove = () => {
    setVideoData(null);
    
    // If we're using the auto-generated thumbnail, remove it too
    if (thumbnailData && !thumbnailData.public_id) {
      setThumbnailData(null);
    }
  };
  
  // Handle thumbnail upload success
  // Handle thumbnail upload success
  const handleThumbnailUploadSuccess = (data) => {
    setThumbnailData(data);
    setDeleteThumbnail(false); // If a new thumbnail is uploaded, we are not deleting the (now old) one, but replacing it.
  };
  
  // Handle thumbnail removal (called by FileUpload's onRemove or a dedicated clear button for a new selection)
  const handleThumbnailRemove = () => {
    setThumbnailData(null);
    // If user was about to delete existing thumb, but then interacts with FileUpload to remove selection, 
    // it implies they might want to upload a new one or keep existing. So, don't enforce deleteThumbnail=true here.
    // setDeleteThumbnail(false); // Reconsider this line based on exact UX desired.
  };

  const handleToggleDeleteThumbnail = () => {
    setDeleteThumbnail(prevDeleteState => {
      const isNowDeleting = !prevDeleteState;

      if (isNowDeleting) {
        // User wants to use auto-generated thumbnail. Preview this.
        let autoThumbUrlToPreview = null;

        if (videoData && videoData.thumbnail_url) {
          // Case 1: A video has been uploaded in the current form session.
          // videoData.thumbnail_url is from the Cloudinary response for this new video.
          autoThumbUrlToPreview = videoData.thumbnail_url;
        } else if (initialData && initialData.video_public_id) {
          // Case 2: Editing an existing video, no new video uploaded in this session.
          // Check if the currently saved thumbnail for this video (initialData.thumbnail)
          // was an auto-generated one. This is true if thumbnail_public_id is null.
          if (initialData.thumbnail && !initialData.thumbnail_public_id) {
            autoThumbUrlToPreview = initialData.thumbnail;
          }
          // If initialData.thumbnail was custom, we don't have the video's specific auto-generated URL
          // readily available on the frontend without calling Cloudinary's URL generation.
          // In this scenario, autoThumbUrlToPreview remains null, leading to 'No preview'.
        }

        if (autoThumbUrlToPreview) {
          setThumbnailData({ url: autoThumbUrlToPreview, public_id: null });
        } else {
          setThumbnailData(null); // Fallback: No auto-thumbnail URL available to preview.
        }
      } else {
        // User unchecks 'delete/use auto', wants to manage custom thumbnail again.
        // Revert to the original custom thumbnail for preview if it existed and was indeed custom.
        if (initialData?.thumbnail && initialData?.thumbnail_public_id) {
          setThumbnailData({ url: initialData.thumbnail, public_id: initialData.thumbnail_public_id });
        } else {
          // No original custom thumbnail to revert to, or the original was auto-generated.
          // Set to null, which will allow FileUpload to show "Upload Thumbnail" or show "No preview" if no video uploaded yet.
          setThumbnailData(null);
        }
      }
      return isNowDeleting;
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    
    if (!videoData) {
      setError('Video is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const videoFormData = {
        ...formData,
        videoData,
        thumbnailData: deleteThumbnail ? null : thumbnailData, // Pass null if deleting, otherwise current thumbnailData
        deleteThumbnail: deleteThumbnail // Pass the flag to the backend
      };
      
      if (isEditing) {
        await api.updateVideo(initialData._id, videoFormData);
      } else {
        await api.createVideo(videoFormData);
      }
      
      // Redirect back to videos list
      navigate('/admin/videos');
    } catch (error) {
      console.error('Video form error:', error);
      setError(error.response?.data?.message || 'Error saving video');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FormContainer>
      <FormTitle>{isEditing ? 'Edit Video' : 'Add New Video'}</FormTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Video Title</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter video title"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter video description"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <FileUpload
            type="video"
            label="Upload Video"
            onUploadSuccess={handleVideoUploadSuccess}
            onUploadError={(msg) => setError(msg)}
            onRemove={handleVideoRemove}
            initialPreview={videoData}
          />
          
          <InfoMessage>
            Supported video formats: MP4, WebM, MOV, AVI. Maximum file size: 20MB.
          </InfoMessage>
        </FormGroup>
        
        <FormGroup>
          <Label>Thumbnail</Label>

          {/* Unified Thumbnail Preview Area */} 
          {thumbnailData && thumbnailData.url ? (
            <div style={{ marginBottom: '10px' }}>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'normal', color: '#555' }}>
                Preview: {thumbnailData.public_id ? <span style={{ color: '#007bff' }}>(Custom Thumbnail)</span> : <span style={{ color: '#28a745' }}>(Auto-generated from video)</span>}
              </p>
              <img 
                src={thumbnailData.url} 
                alt="Thumbnail preview" 
                style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '4px', border: '1px solid #ddd', display: 'block' }} 
              />
            </div>
          ) : (
            <p style={{ marginBottom: '10px', fontStyle: 'italic', color: '#777' }}>No thumbnail preview available. Upload a video or a custom thumbnail.</p>
          )}

          {/* Checkbox to toggle between custom and auto-generated (only in edit mode if an initial custom thumbnail existed) */} 
          {isEditing && initialData?.thumbnail && initialData?.thumbnail_public_id && (
            <div style={{ marginTop: '10px', marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 'normal' }}>
                <input 
                  type="checkbox" 
                  checked={deleteThumbnail} 
                  onChange={handleToggleDeleteThumbnail} 
                  style={{ marginRight: '8px', transform: 'scale(1.1)' }}
                />
                {deleteThumbnail 
                  ? "Using auto-generated thumbnail from video. Uncheck to manage custom thumbnail."
                  : "Use auto-generated thumbnail from video (removes current custom thumbnail on save)"
                }
              </label>
            </div>
          )}

          {/* FileUpload for custom thumbnail - visible if not explicitly deleting an existing custom one */} 
          { !deleteThumbnail && (
            <FileUpload
              type="image"
              label={ 
                (thumbnailData && thumbnailData.public_id) 
                  ? "Replace Custom Thumbnail" 
                  : "Upload Custom Thumbnail"
              }
              onUploadSuccess={handleThumbnailUploadSuccess}
              onUploadError={(msg) => setError(msg)}
              onRemove={handleThumbnailRemove}
              initialPreview={ (thumbnailData && thumbnailData.public_id) ? thumbnailData : null }
            />
          )}
          
          <InfoMessage style={{marginTop: '15px'}}>
            Recommended: 1280x720 (JPG, PNG). Max 2MB. 
            If no custom thumbnail is set, one is auto-generated from the video.
          </InfoMessage>
        </FormGroup>
        
        <ButtonContainer>
          <Button 
            type="button" 
            $secondary 
            onClick={() => navigate('/admin/videos')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Video' : 'Add Video')}
          </Button>
        </ButtonContainer>
      </form>
    </FormContainer>
  );
};

export default VideoForm;
