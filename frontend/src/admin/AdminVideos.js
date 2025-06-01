import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AdminLayout from './components/AdminLayout';
import { fetchVideos, deleteVideo } from '../utils/api';

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
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DateRangeIcon from '@mui/icons-material/DateRange';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';

const VideosContainer = styled(Container)`
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

const VideosGrid = styled(Grid)`
  margin-bottom: 40px;
`;

const VideoCard = styled(Card)`
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
      
      .video-thumbnail {
        transform: scale(1.07);
      }
      
      .play-button {
        /* transform: translate(-50%, -50%) scale(1.1); // Already handled by PlayButton styled component hover */
        background-color: var(--primary-color);
      }
    }
  }
`;

const VideoThumbnail = styled(CardMedia)`
  && {
    height: 200px;
    background-image: url(${props => props.image || '/placeholder-image.jpg'});
    background-size: cover;
    background-position: center;
    position: relative;
    transition: transform 0.6s ease;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.3);
      transition: background-color 0.3s ease;
    }
    
    ${VideoCard}:hover &::after {
      background-color: rgba(0, 0, 0, 0.15);
    }
  }
`;

const PlayButton = styled(IconButton)`
  && {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 56px;
    height: 56px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    z-index: 1;
    transition: all 0.3s ease;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
    
    svg {
      font-size: 32px;
      transition: all 0.3s ease;
    }
    
    &:hover {
      background-color: var(--primary-color);
      transform: translate(-50%, -50%) scale(1.1);
      
      svg {
        transform: scale(1.1);
      }
    }
  }
`;

const NoThumbnailPlaceholder = styled(Box)`
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

const VideoInfo = styled(CardContent)`
  && {
    padding: 16px;
    flex-grow: 1;
  }
`;

const VideoTitle = styled(Typography)`
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

const VideoDate = styled(Box)`
  font-size: 0.875rem; /* Adjusted size */
  color: var(--text-secondary, #6c757d); /* Use a secondary text color variable */
  margin-bottom: 12px; /* Adjusted margin */
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

const NoVideosMessage = styled(Paper)`
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

const VideoDescription = styled(Typography)`
  font-size: 14px;
  color: var(--text-medium);
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  font-family: 'Open Sans', sans-serif;
`;

const AdminVideos = () => {
  const [videos, setVideos] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchVideosData = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetchVideos({ 
        page,
        limit: 12
      });
      
      setVideos(res.data.videos);
      setPagination(res.data.pagination);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos. Please try again later.');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchVideosData();
  }, []);
  
  const handlePageChange = (page) => {
    fetchVideosData(page);
  };
  
  const handleDeleteVideo = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteVideo(id);
        fetchVideosData(pagination.page);
      } catch (error) {
        console.error('Error deleting video:', error);
        alert('Failed to delete video. Please try again.');
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
            Loading videos...
          </Typography>
        </LoadingContainer>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <VideosContainer maxWidth="lg">
        <Header>
          <Title variant="h4">Videos</Title>
          <AddButton 
            component={Link} 
            to="/admin/videos/new"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add New Video
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
        
        {videos.length > 0 ? (
          <VideosGrid container spacing={3}>
            {videos.map(video => (
              <Grid item xs={12} sm={6} md={4} key={video._id}>
                <VideoCard>
                  {video.thumbnail ? (
                    <VideoThumbnail 
                      image={video.thumbnail}
                      className="video-thumbnail"
                    >
                      <PlayButton 
                        aria-label="Play video"
                        className="play-button"
                      >
                        <PlayArrowIcon />
                      </PlayButton>
                    </VideoThumbnail>
                  ) : (
                    <NoThumbnailPlaceholder>
                      <VideoLibraryIcon />
                      <Typography variant="body2">No thumbnail</Typography>
                    </NoThumbnailPlaceholder>
                  )}
                  
                  <VideoInfo>
                    <VideoTitle variant="h6">{video.title}</VideoTitle>
                    <VideoDate>
                      <DateRangeIcon />
                      Added: {formatDate(video.createdAt)}
                    </VideoDate>
                    <VideoDescription variant="body2">{video.description}</VideoDescription>
                  </VideoInfo>
                  
                  <ActionButtons>
                    <EditButton 
                      component={Link} 
                      to={`/admin/videos/edit/${video._id}`}
                      variant="contained"
                      startIcon={<EditIcon />}
                      fullWidth
                    >
                      Edit
                    </EditButton>
                    <DeleteButton 
                      onClick={() => handleDeleteVideo(video._id)}
                      variant="contained"
                      startIcon={<DeleteIcon />}
                      fullWidth
                    >
                      Delete
                    </DeleteButton>
                  </ActionButtons>
                </VideoCard>
              </Grid>
            ))}
          </VideosGrid>
        ) : (
          <NoVideosMessage elevation={1}>
            <OndemandVideoIcon className="empty-state-icon" /> {/* Changed icon to OndemandVideoIcon for videos */}
            <Typography variant="h5" className="empty-state-title">
              No Videos Found
            </Typography>
            <Typography variant="body1" className="empty-state-message">
              Add your first video to showcase your media collection.
            </Typography>
            <Button
              component={Link}
              to="/admin/videos/new"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              className="empty-state-button"
            >
              Add Video
            </Button>
          </NoVideosMessage>
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
      </VideosContainer>
    </AdminLayout>
  );
};

export default AdminVideos;
