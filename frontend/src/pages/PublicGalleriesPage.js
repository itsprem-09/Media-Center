import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { fetchGalleries } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CircularProgress, Typography, Container, Grid, Box } from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
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
  background-color: #f4f6f8; // Slightly lighter background
`;

const MainContent = styled(Container)`
  flex-grow: 1;
  padding-top: 40px; // Increased padding
  padding-bottom: 50px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const SectionTitleContainer = styled.div` // Changed from styled(Box) and removed flex properties
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
    background-color: #2b6da8; // Blue accent from CategoryPage
  }
`;

const TitleContentWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const SectionTitleIcon = styled(PhotoLibraryIcon)`
  font-size: 32px; // Adjusted to match text size, similar to CategoryPage icon sizing
  color: #2b6da8; // Blue icon color from CategoryPage
  margin-right: 12px;
`;

const SectionTitleText = styled(Typography)`
  font-family: 'Noto Serif', serif; // Font from CategoryPage
  font-size: 32px !important; // Added !important to enforce size
  font-weight: bold; // Explicitly set to bold
  color: #222; // Text color from CategoryPage
  text-transform: capitalize; // From CategoryPage
`;

const GalleryGrid = styled(Grid)`
  margin-top: 25px;
`;

const GalleryItemCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px; // More rounded corners
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); // Softer shadow
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0; // Subtle border

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12); // Enhanced hover shadow
  }

  &:hover img {
    transform: scale(1.08);
  }
`;

const GalleryImageContainer = styled.div`
  width: 100%;
  padding-top: 60%; // Adjusted aspect ratio (e.g., 5:3)
  position: relative;
  background-color: #f0f0f0; // Light placeholder background
  overflow: hidden; // Crucial for image zoom effect

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease; // Smooth zoom transition
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

const GalleryTitle = styled(Typography)`
  padding: 18px 20px; // Increased padding
  font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif; // Modern sans-serif
  font-weight: 500; // Medium weight
  font-size: 1.15rem; // Slightly larger
  color: #333;
  text-align: left;
  line-height: 1.4;
  margin-top: auto;
  min-height: 70px; // Ensure consistent card height with varying title lengths
  display: flex;
  align-items: center; // Vertically center if title is short
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

const NoGalleriesContainer = styled(Box)`
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

const NoGalleriesIcon = styled(PhotoLibraryIcon)`
  font-size: 60px;
  color: #bdbdbd; // Lighter icon color
  margin-bottom: 20px;
`;

const NoGalleriesText = styled(Typography)`
  color: #424242; // Darker text
  font-size: 1.25rem;
  font-weight: 500;
`;

const PublicGalleriesPage = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGalleries = async () => {
      try {
        setLoading(true);
        // Assuming fetchGalleries() without params or with { limit: 0 } fetches all
        const response = await fetchGalleries({ limit: 0 }); 
        if (response && response.data && Array.isArray(response.data.galleries)) {
          setGalleries(response.data.galleries);
        } else if (response && Array.isArray(response.data)) { // Fallback if API returns array directly
            setGalleries(response.data);
        } else {
          console.warn('Galleries data not found in expected structure (response.data.galleries or response.data as array):', response ? response.data : 'No response data');
          setGalleries([]); 
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching galleries:', err);
        setError('Failed to load galleries. Please check your connection or try again later.');
        setGalleries([]); // Ensure galleries is empty on error
      } finally {
        setLoading(false);
      }
    };

    loadGalleries();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <Header />
        <MainContent>
          <LoadingContainer>
            <CircularProgress size={50} sx={{ color: '#c62828' }} />
            <Typography variant="h6" sx={{ marginTop: 2, color: '#555' }}>Loading Galleries...</Typography>
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
            <SectionTitleText component="h1">Photo Galleries</SectionTitleText>
          </TitleContentWrapper>
        </SectionTitleContainer>
        
        {galleries.length === 0 ? (
          <NoGalleriesContainer>
            <NoGalleriesIcon />
            <NoGalleriesText>No photo galleries have been added yet.</NoGalleriesText>
            <Typography variant="body1" sx={{color: '#757575', marginTop: 1}}>
              Please check back later or contact support if you believe this is an error.
            </Typography>
          </NoGalleriesContainer>
        ) : (
          <GalleryGrid container spacing={4}> {/* Increased spacing */} 
            {galleries.map((gallery) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={gallery._id}> {/* Added lg for 4 columns on large screens */} 
                <GalleryItemCard onClick={() => navigate(`/gallery/${gallery._id}`)}>
                  <GalleryImageContainer>
                    {gallery.images && gallery.images.length > 0 && gallery.images[0].url ? (
                      <img src={gallery.images[0].url} alt={gallery.title} />
                    ) : (
                      <ImagePlaceholder>
                        <BrokenImageIcon style={{ fontSize: 50 }} />
                      </ImagePlaceholder>
                    )}
                  </GalleryImageContainer>
                  <GalleryTitle>{gallery.title}</GalleryTitle>
                </GalleryItemCard>
              </Grid>
            ))}
          </GalleryGrid>
        )}
      </MainContent>
      <Footer />
    </PageContainer>
  );
};

export default PublicGalleriesPage;
