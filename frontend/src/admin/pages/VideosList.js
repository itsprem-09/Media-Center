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
  Divider,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Tooltip,
  Fade,
  Chip,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import AdminLayout from '../components/AdminLayout';
import SearchBar from '../../components/SearchBar';

const Container = styled.div`
  width: 100%;
  animation: fadeIn 0.4s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  width: 100%;
  
  .MuiCircularProgress-root {
    color: var(--primary-color);
  }
`;

const VideoCard = styled(Card)`
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

const VideoMedia = styled(CardMedia)`
  height: 0;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  position: relative;
  background-size: cover;
  background-position: center;
  transition: all 0.3s ease;
  
  &:hover {
    filter: brightness(1.05);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%);
    z-index: 1;
    pointer-events: none;
  }
`;

const PlayOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  z-index: 2;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }
  
  .play-icon {
    font-size: 54px;
    color: white;
    opacity: 0.9;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &:hover .play-icon {
    opacity: 1;
    transform: scale(1.2);
  }
`;

const VideoCardContent = styled(CardContent)`
  flex-grow: 1;
  padding: 18px;
`;

const VideoDescription = styled(Typography)`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 8px;
  color: #666;
  line-height: 1.5;
`;

const NoVideosMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  background-color: var(--background-off);
  border-radius: 12px;
  color: var(--text-medium);
  margin-top: 20px;
  border: 1px dashed var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  
  svg {
    font-size: 64px;
    color: var(--primary-color);
    opacity: 0.6;
    margin-bottom: 8px;
  }
`;

const VideoCount = styled(Typography)`
  margin-bottom: 24px;
  color: var(--text-medium);
  font-weight: 500;
`;

const VideoDate = styled(Typography)`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  color: #666;
  font-size: 0.85rem;
`;

const VideoCardActions = styled(CardActions)`
  display: flex;
  justify-content: flex-start;
  padding: 8px 16px 16px;
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

const ActionButton = styled(IconButton)`
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
`;

const AddButton = styled(Button)`
  &.MuiButton-root {
    padding: 10px 20px;
    font-weight: 600;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(43, 109, 168, 0.2);
    transition: all 0.3s ease;
    background-color: var(--primary-color);
    text-transform: none;
    font-size: 0.95rem;
    
    &:hover {
      background-color: var(--primary-dark);
      box-shadow: 0 6px 12px rgba(43, 109, 168, 0.3);
      transform: translateY(-2px);
    }
  }
`;

const VideoTitle = styled(Typography)`
  margin-bottom: 6px;
  font-weight: 600;
  font-family: 'Noto Serif', serif;
  line-height: 1.3;
  color: #2b6da8;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  ${VideoCard}:hover & {
    color: #194c7f;
  }
`;

const VideoStatusChip = styled(Chip)`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

// Helper function to get search params from URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const VideosList = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const searchQuery = query.get('query') || '';
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  
  useEffect(() => {
    fetchVideos();
  }, [searchQuery]);
  
  const fetchVideos = async () => {
    try {
      setLoading(true);
      let videosData = [];
      
      if (searchQuery) {
        // If there's a search query, use the search API
        const response = await api.searchContent(searchQuery);
        videosData = response.data.results.videos || [];
      } else {
        // Otherwise fetch all videos
        const response = await api.fetchVideos();
        videosData = response.data.videos || [];
      }
      
      // Sort videos by created date (newest first by default)
      const sortedVideos = sortVideos(videosData, sortOrder);
      setVideos(sortedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Failed to load videos. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const sortVideos = (videoData, order) => {
    let sortedVideos = [...videoData];
    
    if (order === 'newest') {
      sortedVideos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (order === 'oldest') {
      sortedVideos.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (order === 'title') {
      sortedVideos.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    return sortedVideos;
  };
  
  const handleSortChange = (order) => {
    setSortOrder(order);
    const sortedVideos = sortVideos(videos, order);
    setVideos(sortedVideos);
  };
  
  const handleDeleteClick = (video) => {
    setVideoToDelete(video);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!videoToDelete) return;
    
    try {
      await api.deleteVideo(videoToDelete._id);
      setVideos(videos.filter(video => video._id !== videoToDelete._id));
      setDeleteDialogOpen(false);
      setVideoToDelete(null);
    } catch (error) {
      console.error('Error deleting video:', error);
      setError('Failed to delete video. Please try again.');
    }
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setVideoToDelete(null);
  };
  
  const handleEditClick = (id) => {
    navigate(`/admin/videos/edit/${id}`);
  };
  
  const handleViewClick = (id) => {
    // Open the video in a new tab
    window.open(`/video/${id}`, '_blank');
  };
  
  const handlePlayClick = (id) => {
    // Navigate to the video page
    window.open(`/video/${id}`, '_blank');
  };

  if (loading) {
    return (
      <AdminLayout>
        <Container>
          <LoadingContainer>
            <CircularProgress size={50} thickness={4} />
          </LoadingContainer>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container>
        <div className="admin-panel-header">
          <div>
            <Typography variant="h4" component="h1" sx={{ mb: 1, color: '#2b6da8', display: 'flex', alignItems: 'center', gap: 2, fontFamily: '"Noto Serif", serif' }}>
              <VideoFileIcon fontSize="large" />
              Manage Videos
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
              Manage and organize your video content
            </Typography>
          </div>
          <AddButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/videos/new')}
            size="large"
          >
            Add New Video
          </AddButton>
        </div>
        
        {/* Search Bar */}
        <Box mb={3}>
          <SearchBar 
            initialQuery={searchQuery}
            onSearch={(query) => {
              if (query.trim()) {
                navigate(`/admin/videos?query=${encodeURIComponent(query.trim())}`);
              } else {
                navigate('/admin/videos');
              }
            }}
            placeholder="Search videos by title or description..."
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
                onClick={() => navigate('/admin/videos')}
              >
                Clear search
              </Button>
            </Typography>
          </Box>
        )}
        
        {error && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              mb: 3, 
              bgcolor: 'rgba(211, 47, 47, 0.08)', 
              color: '#d32f2f',
              border: '1px solid rgba(211, 47, 47, 0.2)',
              borderRadius: 2
            }}
          >
            <Typography>
              {error}
            </Typography>
          </Paper>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          {videos.length > 0 && (
            <VideoCount variant="body2">
              {videos.length} {videos.length === 1 ? 'video' : 'videos'} found
            </VideoCount>
          )}
          
          {videos.length > 1 && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Tooltip title="Sort by newest" arrow placement="top">
                <Chip 
                  icon={<SortIcon />} 
                  label="Newest" 
                  onClick={() => handleSortChange('newest')} 
                  variant={sortOrder === 'newest' ? 'filled' : 'outlined'}
                  color={sortOrder === 'newest' ? 'primary' : 'default'}
                  size="small"
                />
              </Tooltip>
              <Tooltip title="Sort by oldest" arrow placement="top">
                <Chip 
                  icon={<SortIcon />} 
                  label="Oldest" 
                  onClick={() => handleSortChange('oldest')} 
                  variant={sortOrder === 'oldest' ? 'filled' : 'outlined'}
                  color={sortOrder === 'oldest' ? 'primary' : 'default'}
                  size="small"
                />
              </Tooltip>
              <Tooltip title="Sort by title" arrow placement="top">
                <Chip 
                  icon={<SortIcon />} 
                  label="A-Z" 
                  onClick={() => handleSortChange('title')} 
                  variant={sortOrder === 'title' ? 'filled' : 'outlined'}
                  color={sortOrder === 'title' ? 'primary' : 'default'}
                  size="small"
                />
              </Tooltip>
            </div>
          )}
        </div>
        
        {videos.length > 0 ? (
          <Grid container spacing={3}>
            {videos.map((video) => {
              const thumbnailUrl = video.thumbnail || '/placeholder-image.jpg';
              const createdDate = new Date(video.createdAt);
              const formattedDate = createdDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              });
              
              return (
                <Fade in={true} timeout={500} key={video._id}>
                  <Grid item xs={12} sm={6} md={4}>
                    <VideoCard>
                      <VideoStatusChip 
                        size="small" 
                        label={video.published ? 'Published' : 'Draft'} 
                        color={video.published ? 'success' : 'default'}
                      />
                      <VideoMedia
                        image={thumbnailUrl}
                        title={video.title}
                      >
                        <PlayOverlay onClick={() => handlePlayClick(video._id)}>
                          <PlayArrowIcon className="play-icon" />
                        </PlayOverlay>
                      </VideoMedia>
                      <VideoCardContent>
                        <VideoTitle variant="h6" component="h2">
                          {video.title}
                        </VideoTitle>
                        <VideoDescription variant="body2">
                          {video.description}
                        </VideoDescription>
                        <VideoDate variant="caption">
                          <CalendarTodayIcon fontSize="small" />
                          {formattedDate}
                        </VideoDate>
                      </VideoCardContent>
                      <VideoCardActions>
                        <Tooltip title="View Video" arrow placement="top">
                          <ActionButton 
                            size="small"
                            onClick={() => handleViewClick(video._id)}
                          >
                            <VisibilityIcon />
                          </ActionButton>
                        </Tooltip>
                        <Tooltip title="Edit Video" arrow placement="top">
                          <ActionButton 
                            size="small"
                            onClick={() => handleEditClick(video._id)}
                          >
                            <EditIcon />
                          </ActionButton>
                        </Tooltip>
                        <Tooltip title="Delete Video" arrow placement="top">
                          <ActionButton 
                            size="small"
                            className="delete-btn"
                            onClick={() => handleDeleteClick(video)}
                          >
                            <DeleteIcon />
                          </ActionButton>
                        </Tooltip>
                      </VideoCardActions>
                    </VideoCard>
                  </Grid>
                </Fade>
              );
            })}
          </Grid>
        ) : (
          <NoVideosMessage>
            <VideoFileIcon />
            <Typography variant="h5" fontWeight={500} sx={{ color: '#2b6da8', fontFamily: '"Noto Serif", serif' }}>No videos found</Typography>
            <Typography variant="body1">
              Get started by adding your first video using the button above
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={() => navigate('/admin/videos/new')}
              sx={{ mt: 2 }}
            >
              Add New Video
            </Button>
          </NoVideosMessage>
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
              Are you sure you want to delete the video <strong>"{videoToDelete?.title}"</strong>? 
              This will permanently delete the video file and its data. This action cannot be undone.
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
              Delete Video
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AdminLayout>
  );
};

export default VideosList;
