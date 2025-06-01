import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AdminLayout from './components/AdminLayout';
import { fetchGalleries, deleteGallery } from '../utils/api';

// Material UI components
import { 
  Typography, 
  Button, 
  Box, 
  Paper, 
  Grid, 
  Container,
  Chip,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  Pagination,
  Alert,
  CircularProgress
} from '@mui/material';

// Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ImageIcon from '@mui/icons-material/Image';
import DateRangeIcon from '@mui/icons-material/DateRange';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const GalleriesContainer = styled(Container)`
  padding: 30px 24px;
  max-width: 1280px;
`;

const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
`;

const Title = styled(Typography)`
  margin: 0;
  font-family: 'Noto Serif', serif;
  font-weight: 700; /* Slightly bolder */
  color: var(--text-dark);
  position: relative;
  padding-bottom: 10px; /* Increased padding */
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 70px; /* Slightly wider */
    height: 3.5px; /* Slightly thicker */
    background-color: var(--primary-color);
    border-radius: 2px; /* Soften edges */
  }
`;

const AddButton = styled(Button)`
  &.MuiButton-root {
    padding: 10px 22px; /* Adjusted padding */
    font-weight: 600;
    border-radius: 8px; /* Consistent with AdminArticles */
    box-shadow: 0 4px 8px rgba(43, 109, 168, 0.2);
    transition: all 0.3s ease;
    background-color: var(--primary-color);
    text-transform: none;
    font-size: 0.95rem;
    color: white;
    font-family: 'Open Sans', sans-serif;
    
    svg {
      margin-right: 8px;
    }

    &:hover {
      background-color: var(--primary-dark);
      box-shadow: 0 6px 12px rgba(43, 109, 168, 0.3);
      transform: translateY(-2px);
    }
  }
`;

const GalleriesGrid = styled(Grid)`
  margin-bottom: 40px;
`;

const GalleryCard = styled(Card)`
  && {
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 12px; /* Slightly more rounded */
    overflow: hidden;
    box-shadow: var(--card-shadow-light, 0 4px 12px rgba(0,0,0,0.08)); /* Softer shadow */
    transition: all 0.3s ease;
    background-color: var(--background-paper, white);
    border: 1px solid var(--border-color-light, #e0e0e0);

    &:hover {
      transform: translateY(-6px); /* Increased lift */
      box-shadow: var(--card-shadow-hover, 0 10px 25px rgba(0,0,0,0.15)); /* Enhanced hover shadow */
      
      .gallery-thumbnail {
        transform: scale(1.07);
      }
    }
  }
`;

const GalleryThumbnail = styled(CardMedia)`
  && {
    height: 200px;
    background-image: url(${props => props.image || '/placeholder-image.jpg'});
    background-size: cover;
    background-position: center;
    position: relative;
    transition: transform 0.6s ease;
  }
`;

const NoImagePlaceholder = styled(Box)`
  height: 200px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
  
  svg {
    font-size: 54px;
    margin-bottom: 8px;
    opacity: 0.7;
  }
`;

const ImageCount = styled(Chip)`
  && {
    position: absolute;
    top: 12px;
    right: 12px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 12px;
    height: 26px;
    font-weight: 500;
    backdrop-filter: blur(4px);
    
    .MuiChip-icon {
      color: white;
      opacity: 0.8;
    }
  }
`;

const GalleryInfo = styled(CardContent)`
  && {
    padding: 16px;
    flex-grow: 1;
  }
`;

const GalleryTitle = styled(Typography)`
  margin: 0 0 10px; /* Adjusted margin */
  font-size: 1.15rem; /* Adjusted size */
  font-weight: 600;
  color: var(--text-dark);
  font-family: 'Noto Serif', serif;
  line-height: 1.45; /* Adjusted line height */
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: calc(1.45em * 2); /* Ensure space for two lines */
`;

const GalleryDate = styled(Box)`
  font-size: 0.875rem; /* Adjusted size */
  color: var(--text-secondary, #6c757d); /* Use a secondary text color variable */
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  font-family: 'Open Sans', sans-serif;
  
  svg {
    font-size: 1.1rem; /* Adjusted icon size */
    margin-right: 8px; /* Adjusted spacing */
    opacity: 0.65;
  }
`;

const ActionButtons = styled(CardActions)`
  && {
    padding: 12px 16px; /* Adjusted padding */
    background-color: var(--background-off, #f9f9f9); /* Use theme variable */
    border-top: 1px solid var(--border-color, #eee);
    display: flex;
    gap: 12px;
  }
`;

const EditButton = styled(Button)`
  &.MuiButton-root {
    background-color: rgba(43, 109, 168, 0.1); /* Primary color with low opacity */
    color: var(--primary-color);
    font-family: 'Open Sans', sans-serif;
    font-weight: 600;
    text-transform: none;
    border-radius: 6px;
    padding: 6px 12px;
    box-shadow: none;
    border: 1px solid rgba(43, 109, 168, 0.3);
    
    &:hover {
      background-color: rgba(43, 109, 168, 0.2);
      border-color: rgba(43, 109, 168, 0.5);
    }
  }
`;

const DeleteButton = styled(Button)`
  &.MuiButton-root {
    background-color: rgba(211, 47, 47, 0.1); /* Error color with low opacity */
    color: var(--error-main, #d32f2f);
    font-family: 'Open Sans', sans-serif;
    font-weight: 600;
    text-transform: none;
    border-radius: 6px;
    padding: 6px 12px;
    box-shadow: none;
    border: 1px solid rgba(211, 47, 47, 0.3);

    &:hover {
      background-color: rgba(211, 47, 47, 0.2);
      border-color: rgba(211, 47, 47, 0.5);
    }
  }
`;

const PaginationContainer = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 32px;
  margin-bottom: 16px;
`;

const StyledPagination = styled(Pagination)`
  && {
    .MuiPaginationItem-root {
      font-family: 'Open Sans', sans-serif;
    }
    
    .MuiPaginationItem-page.Mui-selected {
      background-color: var(--primary-color);
      color: white;
      
      &:hover {
        background-color: var(--primary-dark);
      }
    }
  }
`;

const LoadingContainer = styled(Box)`
  padding: 40px;
  text-align: center;
  color: var(--text-medium);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 16px;
`;

const NoGalleriesMessage = styled(Paper)`
  padding: 40px 30px; /* Adjusted padding */
  text-align: center;
  background-color: var(--background-paper, white);
  border-radius: 12px;
  box-shadow: var(--card-shadow-light, 0 4px 12px rgba(0,0,0,0.08));
  margin-top: 32px;
  border: 1px dashed var(--border-color-light, #e0e0e0);

  .empty-state-icon {
    font-size: 56px;
    color: var(--primary-color);
    opacity: 0.7;
    margin-bottom: 20px;
  }

  .empty-state-title {
    font-family: 'Noto Serif', serif;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 8px;
    font-size: 1.5rem;
  }

  .empty-state-message {
    font-family: 'Open Sans', sans-serif;
    color: var(--text-secondary, #6c757d);
    margin-bottom: 24px;
    font-size: 1rem;
  }

  .empty-state-button {
    font-family: 'Open Sans', sans-serif;
    font-weight: 600;
    text-transform: none;
    border-radius: 8px;
    padding: 10px 22px;
    font-size: 0.95rem;
  }
`;

const AdminGalleries = () => {
  const [galleries, setGalleries] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchGalleriesData = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetchGalleries({ 
        page,
        limit: 12
      });
      
      setGalleries(res.data.galleries);
      setPagination(res.data.pagination);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching galleries:', err);
      setError('Failed to load galleries. Please try again later.');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchGalleriesData();
  }, []);
  
  const handlePageChange = (page) => {
    fetchGalleriesData(page);
  };
  
  const handleDeleteGallery = async (id) => {
    if (window.confirm('Are you sure you want to delete this gallery?')) {
      try {
        await deleteGallery(id);
        fetchGalleriesData(pagination.page);
      } catch (error) {
        console.error('Error deleting gallery:', error);
        alert('Failed to delete gallery. Please try again.');
      }
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <LoadingContainer>
          <CircularProgress size={50} thickness={4} sx={{ color: 'var(--primary-color)' }} />
          <Typography variant="h6" sx={{ mt: 2, fontFamily: '"Open Sans", sans-serif' }}>
            Loading galleries...
          </Typography>
        </LoadingContainer>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <GalleriesContainer maxWidth="lg">
        <Header>
          <Title variant="h4">Photo Galleries</Title>
          <AddButton 
            component={Link} 
            to="/admin/galleries/new"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add New Gallery
          </AddButton>
        </Header>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: '8px' }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}
        
        {galleries.length > 0 ? (
          <GalleriesGrid container spacing={3}>
            {galleries.map(gallery => (
              <Grid item xs={12} sm={6} md={4} key={gallery._id}>
                <GalleryCard>
                  {gallery.images && gallery.images.length > 0 ? (
                    <GalleryThumbnail 
                      image={gallery.images[0].url}
                      className="gallery-thumbnail"
                    >
                      <ImageCount 
                        label={`${gallery.images.length} photos`}
                        size="small"
                        icon={<ImageIcon />}
                      />
                    </GalleryThumbnail>
                  ) : (
                    <NoImagePlaceholder>
                      <PhotoLibraryIcon />
                      <Typography variant="body2">No images</Typography>
                    </NoImagePlaceholder>
                  )}
                  
                  <GalleryInfo>
                    <GalleryTitle variant="h6">{gallery.title}</GalleryTitle>
                    <GalleryDate>
                      <DateRangeIcon />
                      Created: {formatDate(gallery.createdAt)}
                    </GalleryDate>
                  </GalleryInfo>
                  
                  <ActionButtons>
                    <EditButton 
                      component={Link} 
                      to={`/admin/galleries/edit/${gallery._id}`}
                      variant="contained"
                      startIcon={<EditIcon />}
                      fullWidth
                    >
                      Edit
                    </EditButton>
                    <DeleteButton 
                      onClick={() => handleDeleteGallery(gallery._id)}
                      variant="contained"
                      startIcon={<DeleteIcon />}
                      fullWidth
                    >
                      Delete
                    </DeleteButton>
                  </ActionButtons>
                </GalleryCard>
              </Grid>
            ))}
          </GalleriesGrid>
        ) : (
          <NoGalleriesMessage elevation={1}>
            <PhotoLibraryIcon className="empty-state-icon" />
            <Typography variant="h5" className="empty-state-title">
              No Galleries Found
            </Typography>
            <Typography variant="body1" className="empty-state-message">
              Create your first photo gallery to showcase your media collection.
            </Typography>
            <Button
              component={Link}
              to="/admin/galleries/new"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              className="empty-state-button"
            >
              Create Gallery
            </Button>
          </NoGalleriesMessage>
        )}
        
        {pagination.pages > 1 && (
          <PaginationContainer>
            <StyledPagination
              count={pagination.pages}
              page={pagination.page}
              onChange={(e, page) => handlePageChange(page)}
              variant="outlined"
              shape="rounded"
              color="primary"
              showFirstButton
              showLastButton
            />
          </PaginationContainer>
        )}
      </GalleriesContainer>
    </AdminLayout>
  );
};

export default AdminGalleries;
