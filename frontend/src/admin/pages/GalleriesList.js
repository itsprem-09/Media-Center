import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import * as api from '../../utils/api';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import AdminLayout from '../components/AdminLayout';
import SearchBar from '../../components/SearchBar';

const Container = styled.div`
  padding: 30px 20px;
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 16px;
  
  h1 {
    font-family: 'Noto Serif', serif;
    color: #2b6da8;
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  width: 100%;
  
  .MuiCircularProgress-root {
    color: #2b6da8;
  }
`;

const GalleryCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  background-color: white;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.12);
  }
`;

const GalleryMedia = styled(CardMedia)`
  height: 0;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  position: relative;
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%);
    pointer-events: none;
  }
  
  ${GalleryCard}:hover & {
    transform: scale(1.05);
  }
`;

const ImageCount = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;
  transition: all 0.3s ease;
  
  ${GalleryCard}:hover & {
    background-color: rgba(43, 109, 168, 0.9);
    transform: translateY(-2px);
  }
`;

const GalleryCardContent = styled(CardContent)`
  flex-grow: 1;
  padding: 18px;
  
  h2 {
    font-family: 'Noto Serif', serif;
    margin-bottom: 6px;
    font-size: 1.25rem;
    font-weight: 600;
    color: #2b6da8;
    transition: color 0.3s ease;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    
    ${GalleryCard}:hover & {
      color: #194c7f;
    }
  }
  
  .date {
    color: #666;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    margin-top: 6px;
  }
`;

const GalleryCardActions = styled(CardActions)`
  padding: 8px 16px 16px;
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  
  .MuiIconButton-root {
    background-color: #f5f7fa;
    transition: all 0.3s ease;
    width: 36px;
    height: 36px;
    
    &:hover {
      background-color: #2b6da8;
      color: white;
      transform: translateY(-2px);
    }
    
    &.delete-btn:hover {
      background-color: #d32f2f;
    }
  }
`;

const NoGalleriesMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  color: #666;
  margin-top: 20px;
  border: 1px dashed #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  
  h6 {
    font-family: 'Noto Serif', serif;
    margin-bottom: 8px;
    color: #2b6da8;
  }
  
  svg {
    font-size: 48px;
    color: #2b6da8;
    opacity: 0.7;
    margin-bottom: 16px;
  }
`;

// Helper function to get search params from URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const GalleriesList = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const searchQuery = query.get('query') || '';
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [galleryToDelete, setGalleryToDelete] = useState(null);
  
  useEffect(() => {
    fetchGalleries();
  }, [searchQuery]);
  
  const fetchGalleries = async () => {
    setLoading(true);
    try {
      if (searchQuery) {
        // If there's a search query, use the search API
        const response = await api.searchContent(searchQuery);
        setGalleries(response.data.results.galleries);
      } else {
        // Otherwise fetch all galleries
        const response = await api.fetchGalleries();
        setGalleries(response.data.galleries || []);
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
      setError('Failed to load galleries. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteClick = (gallery) => {
    setGalleryToDelete(gallery);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!galleryToDelete) return;
    
    try {
      await api.deleteGallery(galleryToDelete._id);
      setGalleries(galleries.filter(gallery => gallery._id !== galleryToDelete._id));
      setDeleteDialogOpen(false);
      setGalleryToDelete(null);
    } catch (error) {
      console.error('Error deleting gallery:', error);
      setError('Failed to delete gallery. Please try again.');
    }
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setGalleryToDelete(null);
  };
  
  const handleEditClick = (id) => {
    navigate(`/admin/galleries/edit/${id}`);
  };
  
  const handleViewClick = (id) => {
    // Open the gallery in a new tab
    window.open(`/gallery/${id}`, '_blank'); // Changed to singular "gallery"
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <Container>
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
        </Container>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <Container>
      <Header>
        <Typography variant="h4" component="h1">
          <PhotoLibraryIcon sx={{ mr: 1 }} />
          Photo Galleries
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/galleries/new')}
        >
          Add New Gallery
        </Button>
      </Header>
      
      {/* Search Bar */}
      <Box mb={3}>
        <SearchBar 
          initialQuery={searchQuery}
          onSearch={(query) => {
            if (query.trim()) {
              navigate(`/admin/galleries?query=${encodeURIComponent(query.trim())}`);
            } else {
              navigate('/admin/galleries');
            }
          }}
          placeholder="Search galleries by title..."
        />
      </Box>
      
      {/* Show search indicator if searching */}
      {searchQuery && (
        <Box display="flex" alignItems="center" mb={2} p={2} bgcolor="#f5f7fa" borderRadius={1}>
          <SearchIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="body2">
            Showing results for "{searchQuery}" {' '}
            <Button 
              size="small" 
              variant="text" 
              onClick={() => navigate('/admin/galleries')}
            >
              Clear search
            </Button>
          </Typography>
        </Box>
      )}
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {galleries.length > 0 ? (
        <Grid container spacing={3}>
          {galleries.map((gallery) => {
            // Get the first image as the cover image
            const coverImage = gallery.images && gallery.images.length > 0 
              ? gallery.images[0].url 
              : 'https://via.placeholder.com/400x225?text=No+Images';
            
            return (
              <Grid item xs={12} sm={6} md={4} key={gallery._id}>
                <GalleryCard>
                  <GalleryMedia
                    image={coverImage}
                    title={gallery.title}
                  >
                    <ImageCount>
                      <PhotoLibraryIcon fontSize="small" />
                      {gallery.images ? gallery.images.length : 0}
                    </ImageCount>
                  </GalleryMedia>
                  <GalleryCardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                      {gallery.title}
                    </Typography>
                    <Typography className="date" variant="body2" color="textSecondary">
                      <CalendarTodayIcon fontSize="small" />
                      {new Date(gallery.createdAt).toLocaleDateString()}
                    </Typography>
                  </GalleryCardContent>
                  <GalleryCardActions>
                    <Tooltip title="View Gallery" arrow placement="top">
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewClick(gallery._id)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Gallery" arrow placement="top">
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditClick(gallery._id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Gallery" arrow placement="top">
                      <IconButton 
                        size="small"
                        className="delete-btn"
                        onClick={() => handleDeleteClick(gallery)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </GalleryCardActions>
                </GalleryCard>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <NoGalleriesMessage>
          <PhotoLibraryIcon />
          <Typography variant="h6">No galleries found</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Get started by creating your first photo gallery!
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/galleries/new')}
            sx={{ mt: 2 }}
          >
            Create New Gallery
          </Button>
        </NoGalleriesMessage>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          style: {
            borderRadius: '12px',
            padding: '8px',
            maxWidth: '500px'
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#d32f2f' }}>
          Confirm Delete
        </DialogTitle>
        <Divider sx={{ mb: 2 }} />
        <DialogContent>
          <DialogContentText sx={{ color: 'var(--text-medium)' }}>
            Are you sure you want to delete the gallery <strong>"{galleryToDelete?.title}"</strong>? 
            This will permanently delete all images in this gallery. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button 
            onClick={handleDeleteCancel} 
            variant="outlined"
            sx={{ 
              borderRadius: '8px', 
              textTransform: 'none',
              fontWeight: 500,
              padding: '8px 16px'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            sx={{ 
              borderRadius: '8px', 
              textTransform: 'none', 
              fontWeight: 500,
              padding: '8px 16px'
            }}
          >
            Delete Gallery
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
    </AdminLayout>
  );
};

export default GalleriesList;
