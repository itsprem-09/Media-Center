import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'draft-js/dist/Draft.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import * as api from '../../utils/api';
import FileUpload from '../../components/FileUpload';
import { 
  Paper, 
  Typography, 
  Button, 
  TextField, 
  MenuItem, 
  Grid, 
  Box, 
  Chip,
  Divider,
  FormHelperText,
  Alert,
  CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TagIcon from '@mui/icons-material/Tag';

const FormContainer = styled(Paper)`
  padding: 32px;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  animation: fadeIn 0.4s ease forwards;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

const FormTitle = styled(Typography)`
  margin-bottom: 24px;
  font-family: 'Noto Serif', serif;
  font-weight: 600;
  position: relative;
  padding-bottom: 12px;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    width: 60px;
    background-color: var(--primary-color);
  }
`;

const FormGroup = styled(Box)`
  margin-bottom: 24px;
`;

const Label = styled(Typography)`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-dark);
  font-size: 0.95rem;
`;

const StyledTextField = styled(TextField)`
  width: 100%;
  
  .MuiOutlinedInput-root {
    border-radius: 8px;
    transition: all 0.3s ease;
    font-family: 'Open Sans', sans-serif;
    
    &:hover fieldset {
      border-color: var(--primary-color);
    }
    
    &.Mui-focused fieldset {
      border-color: var(--primary-color);
      border-width: 2px;
    }
  }
  
  .MuiInputLabel-root {
    font-family: 'Open Sans', sans-serif;
    
    &.Mui-focused {
      color: var(--primary-color);
    }
  }
  
  .MuiInputBase-input {
    padding: 14px 16px;
  }
`;





const EditorContainer = styled(Box)`
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  background-color: white;
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(43, 109, 168, 0.1);
  }
  
  .rdw-editor-wrapper {
    font-family: 'Open Sans', sans-serif;
  }
  
  .rdw-editor-toolbar {
    border: none;
    border-bottom: 1px solid var(--border-color);
    padding: 12px;
    background-color: #f8f9fa;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  
  .rdw-editor-main {
    padding: 20px;
    min-height: 250px;
    font-size: 1rem;
    line-height: 1.6;
  }
  
  .rdw-option-wrapper {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
  }
  
  .rdw-option-active {
    background-color: #e0e0e0;
    box-shadow: none;
  }
  
  .public-DraftEditorPlaceholder-root {
    color: var(--text-light);
  }
`;

const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 40px;
`;

const SubmitButton = styled(Button)`
  &.MuiButton-root {
    padding: 10px 24px;
    font-weight: 600;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(43, 109, 168, 0.2);
    transition: all 0.3s ease;
    text-transform: none;
    font-size: 1rem;
    background-color: var(--primary-color);
    
    &:hover {
      background-color: var(--primary-dark);
      box-shadow: 0 6px 12px rgba(43, 109, 168, 0.3);
      transform: translateY(-2px);
    }
    
    &.Mui-disabled {
      background-color: rgba(0, 0, 0, 0.12);
      color: rgba(0, 0, 0, 0.26);
      box-shadow: none;
    }
  }
`;

const CancelButton = styled(Button)`
  &.MuiButton-root {
    padding: 10px 24px;
    font-weight: 600;
    border-radius: 8px;
    text-transform: none;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
  }
`;

const TagsContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const TagChip = styled(Chip)`
  &.MuiChip-root {
    font-weight: 500;
    background-color: rgba(43, 109, 168, 0.1);
    color: var(--primary-color);
    border-radius: 4px;
    padding: 2px 0;
  }
`;

// Available categories
const CATEGORIES = [
  'news',
  'opinion',
  'business',
  'sport',
  'entertainment',
  'technology',
  'lifestyle',
  'science',
  'health'
];

const ArticleForm = ({ initialData, isEditing = false }) => {
  // Initial form state
  const defaultFormState = {
    title: '',
    slug: '',
    summary: '',
    content: '',
    rawContent: '',
    category: '',
    imageUrl: '',
    videoUrl: '',
    tags: []
  };

  // Initialize form data with defaults or initial values
  const [formData, setFormData] = useState({ ...defaultFormState, ...initialData });

  // Initialize image data with proper fallback handling
  const [imageData, setImageData] = useState(() => {
    // If initialData has image URL, create proper image data object
    if (initialData?.image) {
      return {
        url: initialData.image,
        public_id: initialData.image_public_id || null
      };
    }
    return null;
  });

  // Initialize video data with proper fallback handling
  const [videoData, setVideoData] = useState(() => {
    if (initialData?.video) {
      return {
        url: initialData.video,
        public_id: initialData.video_public_id || null
      };
    }
    return null;
  });

  const [editorState, setEditorState] = useState(() => {
    if (initialData?.rawContent) {
      try {
        // Try to parse the raw content (rich text)
        const contentState = convertFromRaw(JSON.parse(initialData.rawContent));
        return EditorState.createWithContent(contentState);
      } catch (error) {
        // Fallback to plain text if raw content cannot be parsed
        if (initialData.content) {
          return EditorState.createWithContent(
            ContentState.createFromText(initialData.content)
          );
        }
      }
    } else if (initialData?.content) {
      // Fallback to plain text content
      return EditorState.createWithContent(
        ContentState.createFromText(initialData.content)
      );
    }
    return EditorState.createEmpty();
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [tags, setTags] = useState(initialData?.tags ? (Array.isArray(initialData.tags) ? initialData.tags.map(tag => String(tag).trim()).filter(Boolean) : String(initialData.tags).split(',').map(tag => tag.trim()).filter(Boolean)) : []);
  
  // Initialize navigation
  const navigate = useNavigate();

  // Set up form data with initial data if editing
  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        title: initialData.title || '',
        slug: initialData.slug || '',
        summary: initialData.summary || '',
        content: initialData.content || '',
        rawContent: initialData.rawContent || '',
        category: initialData.category || '',
        imageUrl: initialData.imageUrl || '',
        videoUrl: initialData.videoUrl || '',
        tags: initialData.tags || []
      });

      // Set image and video data if available
      if (initialData.imageUrl) {
        setImageData({
          url: initialData.imageUrl,
          publicId: initialData.imagePublicId || ''
        });
      }
      
      if (initialData.videoUrl) {
        setVideoData({
          url: initialData.videoUrl,
          publicId: initialData.videoPublicId || ''
        });
      }
      
      // Handle tags
      if (initialData.tags) {
        const initialTags = Array.isArray(initialData.tags)
          ? initialData.tags.map(tag => String(tag).trim()).filter(Boolean)
          : String(initialData.tags).split(',').map(tag => tag.trim()).filter(Boolean);
        setTags(initialTags);
      } else {
        setTags([]);
      }

      // Set image data if present in initialData
      if (initialData.image) {
        setImageData({ 
          url: initialData.image, 
          public_id: initialData.image_public_id || null 
        });
      } else {
        setImageData(null);
      }

      // Set video data if present in initialData
      if (initialData.video || initialData.videoUrl) {
        setVideoData({ 
          url: initialData.video || initialData.videoUrl, 
          public_id: initialData.video_public_id || null 
        });
      } else {
        setVideoData(null);
      }
    } else if (!isEditing) {
      // Reset all form state for new article creation
      setFormData({ title: '', content: '', author: '', category: CATEGORIES[0] });
      setEditorState(EditorState.createEmpty());
      setTags([]);
      setImageData(null);
      setVideoData(null);
    }
  }, [initialData, isEditing]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      // Process tags but don't set them to formData yet
      const lastChar = value.charAt(value.length - 1);
      if (lastChar === ',' || lastChar === ' ') {
        const newTag = value.slice(0, -1).trim();
        if (newTag && !tags.includes(newTag)) {
          setTags([...tags, newTag]);
          setFormData(prev => ({ ...prev, tags: [...tags, newTag].join(',') }));
        }
        return;
      }
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle tag deletion
  const handleDeleteTag = (tagToDelete) => {
    const updatedTags = tags.filter(tag => tag !== tagToDelete);
    setTags(updatedTags);
    setFormData(prev => ({ ...prev, tags: updatedTags.join(',') }));
  };
  
  // Handle tag addition on enter
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        setTags(updatedTags);
        setFormData(prev => ({ ...prev, tags: updatedTags.join(','), }));
        e.target.value = '';
      }
    }
  };
  
  // Handle editor changes
  const handleEditorChange = (state) => {
    setEditorState(state);
    // Store both the raw content (for saving/editing) and plain text (for validation)
    const currentContent = state.getCurrentContent();
    const rawContent = JSON.stringify(convertToRaw(currentContent));
    const plainText = currentContent.getPlainText();
    setFormData(prev => ({ 
      ...prev, 
      content: plainText,
      rawContent: rawContent 
    }));
  };
  
  // Handle image upload success
  const handleImageUploadSuccess = (data) => {
    setImageData(data);
  };
  
  // Handle image removal
  const handleImageRemove = () => {
    setImageData(null);
    console.log('ArticleForm: Set imageData to null (no featuredImage or videoUrl):');
  };
  
  // Handle video upload success
  const handleVideoUploadSuccess = (data) => {
    setVideoData(data);
  };
  
  // Handle video removal
  const handleVideoRemove = () => {
    setVideoData(null);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    let hasErrors = false;
    if (!formData.title || !formData.title.trim()) {
      setError('Title is required');
      hasErrors = true;
    } else if (!formData.content || !formData.content.trim()) {
      setError('Content is required');
      hasErrors = true;
    }
    
    if (hasErrors) return;
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Process any remaining tag in the input field
      const inputTagField = document.getElementById('tags-input');
      if (inputTagField && inputTagField.value.trim()) {
        const newTag = inputTagField.value.trim();
        if (!tags.includes(newTag)) {
          const updatedTags = [...tags, newTag];
          setTags(updatedTags);
          setFormData(prev => ({ ...prev, tags: updatedTags.join(',') }));
        }
      }
      
      // Convert the editor content to HTML for display
      const contentState = editorState.getCurrentContent();
      const rawContentState = convertToRaw(contentState);
      const htmlContent = draftToHtml(rawContentState);
      
      const articleData = {
        ...formData,
        content: htmlContent, // Use HTML content for display
        rawContent: JSON.stringify(rawContentState), // Store raw content for later editing
        imageData: imageData,
        videoData: videoData
      };
      
      if (isEditing) {
        await api.updateArticle(initialData._id, articleData);
      } else {
        await api.createArticle(articleData);
      }
      
      // Redirect back to articles list
      navigate('/admin/articles');
    } catch (error) {
      console.error('Article form error:', error);
      setError(error.response?.data?.message || 'Error saving article');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FormContainer elevation={1}>
      <FormTitle variant="h4">
        {isEditing ? 'Edit Article' : 'Create New Article'}
      </FormTitle>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormGroup>
              <Label variant="body2">Title</Label>
              <StyledTextField
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a descriptive title"
                fullWidth
                variant="outlined"
                required
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
            </FormGroup>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormGroup>
              <Label variant="body2">Author</Label>
              <StyledTextField
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Who wrote this article?"
                fullWidth
                variant="outlined"
                required
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
            </FormGroup>
          </Grid>
          
          <Grid item xs={12}>
            <FormGroup>
              <Label variant="body2">Category</Label>
              <StyledTextField
                id="category"
                name="category"
                select
                value={formData.category}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              >
                {CATEGORIES.map(category => (
                  <MenuItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </StyledTextField>
            </FormGroup>
          </Grid>
          
          <Grid item xs={12}>
            <FormGroup>
              <Label variant="body2">Tags</Label>
              <StyledTextField
                id="tags-input"
                name="tags"
                placeholder="Type a tag and press Enter or comma"
                fullWidth
                variant="outlined"
                onChange={handleChange}
                onKeyDown={handleTagKeyDown}
                InputProps={{
                  sx: { borderRadius: 2 },
                  startAdornment: tags.length > 0 ? (
                    <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                      <TagIcon fontSize="small" sx={{ color: 'var(--text-light)', mr: 0.5 }} />
                    </Box>
                  ) : null
                }}
              />
              {tags.length > 0 && (
                <TagsContainer>
                  {tags.map((tag, index) => (
                    <TagChip 
                      key={index} 
                      label={tag} 
                      onDelete={() => handleDeleteTag(tag)}
                      size="small"
                    />
                  ))}
                </TagsContainer>
              )}
              <FormHelperText>Tags help readers find your article</FormHelperText>
            </FormGroup>
          </Grid>
          
          <Grid item xs={12}>
            <FormGroup>
              <Label variant="body2">Content</Label>
              <EditorContainer>
                <Editor
                  editorState={editorState}
                  onEditorStateChange={handleEditorChange}
                  placeholder="Write your article content here..."
                  toolbar={{
                    options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'history'],
                    inline: {
                      options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
                      bold: { className: 'bordered-option-classname' },
                      italic: { className: 'bordered-option-classname' },
                      underline: { className: 'bordered-option-classname' },
                      strikethrough: { className: 'bordered-option-classname' },
                      code: { className: 'bordered-option-classname' }
                    },
                    blockType: {
                      className: 'bordered-option-classname',
                    },
                    fontSize: {
                      className: 'bordered-option-classname',
                    },
                    list: {
                      className: 'bordered-option-classname',
                    },
                  }}
                  wrapperClassName="rich-editor-wrapper"
                  editorClassName="rich-editor-content"
                  toolbarClassName="rich-editor-toolbar"
                />
              </EditorContainer>
              <FormHelperText>Rich, detailed content improves reader engagement</FormHelperText>
            </FormGroup>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormGroup>
              <FileUpload
                type="image"
                label="Featured Image"
                onUploadSuccess={handleImageUploadSuccess}
                onUploadError={(msg) => setError(msg)}
                onRemove={handleImageRemove}
                initialPreview={imageData}
              />
            </FormGroup>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormGroup>
              <FileUpload
                type="video"
                label="Featured Video"
                onUploadSuccess={handleVideoUploadSuccess}
                onUploadError={(msg) => setError(msg)}
                onRemove={handleVideoRemove}
                initialPreview={videoData}
              />
            </FormGroup>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <ButtonContainer>
          <CancelButton 
            variant="outlined"
            color="inherit"
            onClick={() => navigate('/admin/articles')}
            startIcon={<ArrowBackIcon />}
          >
            Cancel
          </CancelButton>
          <SubmitButton 
            type="submit" 
            variant="contained"
            disabled={isSubmitting}
            startIcon={<SaveIcon />}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Saving...
              </>
            ) : (
              isEditing ? 'Update Article' : 'Create Article'
            )}
          </SubmitButton>
        </ButtonContainer>
      </form>
    </FormContainer>
  );
};

export default ArticleForm;
