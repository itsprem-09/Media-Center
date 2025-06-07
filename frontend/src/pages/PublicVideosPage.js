import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { fetchVideos } from '../utils/api'; // Changed from fetchGalleries
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CircularProgress, Typography, Container, Grid, Box } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam'; // Changed from PhotoLibraryIcon
import BrokenImageIcon from '@mui/icons-material/BrokenImage'; // For placeholder

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f4f6f8;
`;

const MainContent = styled(Container)`
  flex-grow: 1;
  padding-top: 40px;
  padding-bottom: 50px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const SectionTitleContainer = styled.div`
  margin-bottom: 30px;
  border-bottom: 2px solid #e1e1e1;
  padding-bottom: 15px;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 60px;
    height: 2px;
    background-color: #2b6da8;
  }
`;

const TitleContentWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const SectionTitleIcon = styled(VideocamIcon)` // Changed from PhotoLibraryIcon
  font-size: 32px;
  color: #2b6da8;
  margin-right: 12px;
`;

const SectionTitleText = styled(Typography)`
  font-family: 'Noto Serif', serif;
  font-size: 32px !important;
  font-weight: bold;
  color: #222;
  text-transform: capitalize;
`;

const ItemGrid = styled(Grid)` // Renamed from GalleryGrid
  margin-top: 25px;
`;

const VideoItemCard = styled.div` // Renamed from GalleryItemCard
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  }

  &:hover img {
    transform: scale(1.08);
  }
`;

const VideoThumbnailContainer = styled.div` // Renamed from GalleryImageContainer
  width: 100%;
  padding-top: 56.25%; // 16:9 aspect ratio for video thumbnails
  position: relative;
  background-color: #f0f0f0;
  overflow: hidden;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
`;

const ImagePlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #e0e0e0;
  color: #9e9e9e;
`;

const VideoTitle = styled(Typography)` // Renamed from GalleryTitle
  padding: 18px 20px;
  font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 500;
  font-size: 1.1rem; // Adjusted for video titles
  color: #333;
  text-align: left;
  line-height: 1.4;
  margin-top: auto;
  min-height: 70px;
  display: flex;
  align-items: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #555;
`;

const ErrorMessage = styled(Typography)`
  color: #d32f2f;
  text-align: center;
  margin-top: 30px;
  font-weight: 500;
`;

const NoItemsContainer = styled(Box)` // Renamed from NoGalleriesContainer
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
  text-align: center;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  margin-top: 30px;
`;

const NoItemsIcon = styled(VideocamIcon)` // Renamed and icon changed
  font-size: 60px;
  color: #bdbdbd;
  margin-bottom: 20px;
`;

const NoItemsText = styled(Typography)` // Renamed from NoGalleriesText
  color: #424242;
  font-size: 1.25rem;
  font-weight: 500;
`;

const PublicVideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const response = await fetchVideos({ limit: 0 });
        if (response && response.data && Array.isArray(response.data.videos)) {
          setVideos(response.data.videos);
        } else if (response && Array.isArray(response.data)) {
            setVideos(response.data);
        } else {
          console.warn('Videos data not found in expected structure:', response ? response.data : 'No response data');
          setVideos([]); 
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError(err.response?.data?.message || 'Failed to load videos. Please try again later.');
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, []);

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  if (loading) {
    return (
      <PageContainer>
        <Header />
        <MainContent>
          <LoadingContainer>
            <CircularProgress size={50} sx={{ color: '#c62828' }} />
            <Typography variant="h6" sx={{ marginTop: 2, color: '#555' }}>Loading Videos...</Typography>
          </LoadingContainer>
        </MainContent>
        <Footer />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Header />
        <MainContent>
          <ErrorMessage variant="h5">{error}</ErrorMessage>
        </MainContent>
        <Footer />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header />
      <MainContent>
        <SectionTitleContainer>
          <TitleContentWrapper>
            <SectionTitleIcon />
            <SectionTitleText component="h1">Videos</SectionTitleText>
          </TitleContentWrapper>
        </SectionTitleContainer>
        
        {videos.length === 0 ? (
          <NoItemsContainer>
            <NoItemsIcon />
            <NoItemsText>No videos found at the moment.</NoItemsText>
            <Typography variant="body1" sx={{color: '#666', marginTop: 1}}>Please check back later or explore other sections.</Typography>
          </NoItemsContainer>
        ) : (
          <ItemGrid container spacing={4}>
            {videos.map((video) => {
              console.log('Video data:', video);
              return (
              <Grid item key={video._id} xs={12} sm={6} md={4} lg={3}>
                <VideoItemCard onClick={() => handleVideoClick(video._id)}>
                  <VideoThumbnailContainer>
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt={video.title} />
                    ) : (
                      <ImagePlaceholder>
                        <BrokenImageIcon style={{ fontSize: 40 }} />
                      </ImagePlaceholder>
                    )}
                  </VideoThumbnailContainer>
                  <VideoTitle variant="h6">
                    {video.title}
                  </VideoTitle>
                </VideoItemCard>
              </Grid>
            );
          })}
          </ItemGrid>
        )}
      </MainContent>
      <Footer />
    </PageContainer>
  );
};

export default PublicVideosPage;
