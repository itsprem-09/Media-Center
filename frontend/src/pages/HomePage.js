import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchArticles, fetchGalleries, fetchVideos, searchContent } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import UpdateIcon from '@mui/icons-material/Update';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { format, parseISO, differenceInHours } from 'date-fns';
import {
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Button
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import SearchBar from '../components/SearchBar';

const HomeContainer = styled.div`
  background-color: #f9f9f9;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 25px 20px;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 25px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 30px;
  }
`;

const MainArticle = styled.div`
  grid-column: 1;
  
  .main-article-card {
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    background: #fff;
    height: 100%;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    }
  }
  
  .main-article-image {
    width: 100%;
    height: 380px;
    object-fit: cover;
  }
  
  .main-article-content {
    padding: 20px;
  }
  
  .main-article-title {
    font-family: 'Noto Serif', serif;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.3;
    margin-bottom: 10px;
    color: #222;
  }
  
  .main-article-excerpt {
    color: #444;
    margin-bottom: 15px;
    line-height: 1.6;
    font-size: 16px;
  }
  
  .main-article-meta {
    color: #666;
    font-size: 14px;
  }
  
  @media (max-width: 768px) {
    .main-article-image {
      height: 250px;
    }
    
    .main-article-title {
      font-size: 20px;
    }
  }
`;

const SideArticles = styled.div`
  grid-column: 2;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    grid-column: 1;
  }
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  margin: 35px 0 18px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e6e6e6;
  color: #222;
  font-family: 'Noto Serif', serif;
  position: relative;
  display: flex;
  align-items: center;
  
  .title-icon {
    margin-right: 10px;
    color: #2b6da8;
  }
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 60px;
    height: 2px;
    background-color: #2b6da8;
  }
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-bottom: 40px;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 25px;
  }
  
  article {
    background: white;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    }
    
    .article-image {
      width: 100%;
      height: 190px;
      object-fit: cover;
    }
    
    .article-content {
      padding: 16px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    
    .article-title {
      font-family: 'Noto Serif', serif;
      font-size: 18px;
      font-weight: 600;
      line-height: 1.4;
      margin-bottom: 8px;
      color: #222;
    }
    
    .article-excerpt {
      color: #444;
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 10px;
      flex-grow: 1;
    }
    
    .article-meta {
      font-size: 13px;
      color: #666;
      display: flex;
      align-items: center;
    }
    
    .new-indicator {
      display: inline-flex;
      align-items: center;
      background-color: #e53935;
      color: white;
      border-radius: 12px;
      padding: 2px 8px;
      font-size: 11px;
      font-weight: 600;
      margin-left: 8px;
    }
    
    .updated-indicator {
      display: inline-flex;
      align-items: center;
      background-color: #2b6da8;
      color: white;
      border-radius: 12px;
      padding: 2px 8px;
      font-size: 11px;
      font-weight: 600;
      margin-left: 8px;
    }
  }
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div``;

const GalleryPreview = styled.div`
  margin-bottom: 30px;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  @media (max-width: 576px) {
    gap: 15px;
  }
`;

const GalleryItem = styled.div`
  position: relative;
  height: 180px;
  background-image: url(${props => props.image || '/placeholder-image.jpg'});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70%;
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    height: 160px;
  }
  
  @media (max-width: 576px) {
    height: 140px;
  }
`;

const GalleryTitle = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: white;
  padding: 12px;
  font-size: 15px;
  font-weight: 500;
  z-index: 2;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  font-family: 'Noto Serif', serif;
`;

const VideoPreview = styled.div`
  margin-bottom: 30px;
`;

const VideoItem = styled.div`
  margin-bottom: 15px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const getCloudinaryVideoThumbnail = (videoUrl) => {
  if (!videoUrl || typeof videoUrl !== 'string') {
    return null;
  }

  if (videoUrl.includes('res.cloudinary.com') && videoUrl.includes('/video/upload/')) {
    const uploadMarker = '/video/upload/';
    const parts = videoUrl.split(uploadMarker);

    if (parts.length === 2) {
      const baseUrl = parts[0] + uploadMarker;
      const versionAndPath = parts[1]; // e.g., v1748523283/media-center/videos/zlgdxcvaf1zgyxzrnqrz.mp4
      
      // Remove original extension for the public_id part
      const pathWithoutExtension = versionAndPath.substring(0, versionAndPath.lastIndexOf('.'));
      
      const transformations = 'w_400,h_225,c_pad,b_auto,f_auto,q_auto';
      
      // Construct the new URL: baseUrl + transformations + / + pathWithoutExtension + .jpg
      const transformedUrl = `${baseUrl}${transformations}/${pathWithoutExtension}.jpg`;
      return transformedUrl;
    }
  }
  return null;
};

const VideoThumbnail = styled.div`
  position: relative;
  height: 180px;
  background-image: url(${props => props.image || getCloudinaryVideoThumbnail(props.videoUrl) || '/placeholder-image.jpg'});
  background-size: cover;
  background-position: center;
  margin-bottom: 10px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
  
  &::after {
    content: '▶';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 54px;
    height: 54px;
    background: rgba(43, 109, 168, 0.85);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
  
  @media (max-width: 768px) {
    height: 160px;
  }
`;

const VideoTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 6px;
  font-family: 'Noto Serif', serif;
  font-weight: 600;
  color: #222;
  line-height: 1.4;
`;

const Loading = styled.div`
  text-align: center;
  padding: 60px 0;
  font-size: 18px;
  color: #555;
  
  &:after {
    content: '';
    display: block;
    width: 40px;
    height: 40px;
    margin: 20px auto 0;
    border-radius: 50%;
    border: 3px solid #f3f3f3;
    border-top-color: #2b6da8;
    animation: spin 1s infinite linear;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Add search-related styled components
const SearchContainer = styled(Box)`
  padding: 20px 0;
  animation: fadeIn 0.5s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const SearchHeader = styled(Box)`
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SearchResultsContainer = styled(Box)`
  margin-top: 24px;
`;

const NoResultsContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  margin-top: 24px;
  background-color: #f9f9f9;
  border-radius: 12px;
  
  svg {
    font-size: 48px;
    color: #2b6da8;
    opacity: 0.7;
    margin-bottom: 16px;
  }
`;

const ResultCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.12);
  }
`;

const ResultMedia = styled(CardMedia)`
  height: 180px;
  background-size: cover;
  background-position: center;
`;

const ResultContent = styled(CardContent)`
  flex-grow: 1;
  padding: 16px;
  
  h2 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #2b6da8;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .date {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 4px;
  }
  
  .category {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 10px;
  }
`;

const ContentTypeChip = styled(Chip)`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 0.75rem;
  font-weight: 500;
`;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const HomePage = () => {
  const query = useQuery();
  const searchQuery = query.get('search') || '';
  const navigate = useNavigate();
  
  const [latestArticles, setLatestArticles] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search related states
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState({ articles: [], galleries: [], videos: [] });
  const [searchCounts, setSearchCounts] = useState({ articles: 0, galleries: 0, videos: 0, total: 0 });
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  const fetchSearchResults = useCallback(async (query) => {
    if (!query.trim()) {
      setIsSearching(false);
      return;
    }
    
    setSearchLoading(true);
    setSearchError(null);
    setIsSearching(true);
    
    try {
      const response = await searchContent(query);
      setSearchResults(response.data.results);
      setSearchCounts(response.data.counts);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('An error occurred while searching. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  }, []);
  
  // Handle URL search parameter
  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery, fetchSearchResults]);
  
  // Listen for custom search event from Header
  useEffect(() => {
    const handlePerformSearch = (event) => {
      fetchSearchResults(event.detail.query);
    };
    
    window.addEventListener('performSearch', handlePerformSearch);
    
    return () => {
      window.removeEventListener('performSearch', handlePerformSearch);
    };
  }, [fetchSearchResults]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch latest articles - sorted by most recently updated/created
        const articlesRes = await fetchArticles({ limit: 15, sort: '-updatedAt' });
        setLatestArticles(articlesRes.data.articles);
        
        // Fetch galleries
        const galleriesRes = await fetchGalleries({ limit: 4 });
        setGalleries(galleriesRes.data.galleries);
        
        // Fetch videos
        const videosRes = await fetchVideos({ limit: 3 });
        setVideos(videosRes.data.videos);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError('Failed to load content. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <HomeContainer>
        <Header />
        <MainContent>
          <Loading>Loading content...</Loading>
        </MainContent>
        <Footer />
      </HomeContainer>
    );
  }
  
  if (error) {
    return (
      <HomeContainer>
        <Header />
        <MainContent>
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            {error}
          </div>
        </MainContent>
        <Footer />
      </HomeContainer>
    );
  }
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleSearch = (newQuery) => {
    fetchSearchResults(newQuery);
  };
  
  const clearSearch = () => {
    setIsSearching(false);
    // Update URL without search parameter without page reload
    const newUrl = window.location.pathname;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  // Search result rendering functions
  const renderArticles = () => {
    if (searchResults.articles.length === 0) {
      return (
        <NoResultsContainer>
          <SearchOffIcon />
          <Typography variant="h6" color="primary">No articles found</Typography>
          <Typography variant="body2" color="textSecondary">
            We couldn't find any articles matching "{searchQuery}"
          </Typography>
        </NoResultsContainer>
      );
    }

    return (
      <Grid container spacing={3}>
        {searchResults.articles.map((article) => (
          <Grid item xs={12} sm={6} md={4} key={article._id}>
            <ResultCard>
              <CardActionArea onClick={() => navigate(`/article/${article.slug}`)}>
                {article.image && (
                  <ResultMedia
                    image={article.image}
                    title={article.title}
                  />
                )}
                <ContentTypeChip
                  label="Article"
                  size="small"
                  color="primary"
                  icon={<ArticleIcon fontSize="small" />}
                />
                <ResultContent>
                  <Typography variant="h6" component="h2">{article.title}</Typography>
                  <div className="category">
                    <CategoryIcon fontSize="small" />
                    {article.category}
                  </div>
                  <div className="date">
                    <CalendarTodayIcon fontSize="small" />
                    {new Date(article.createdAt).toLocaleDateString()}
                  </div>
                  {article.tags && article.tags.length > 0 && (
                    <Box mt={1} display="flex" gap={0.5} flexWrap="wrap">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          size="small" 
                          variant="outlined" 
                          sx={{ marginRight: 0.5, marginBottom: 0.5 }}
                        />
                      ))}
                    </Box>
                  )}
                </ResultContent>
              </CardActionArea>
            </ResultCard>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderGalleries = () => {
    if (searchResults.galleries.length === 0) {
      return (
        <NoResultsContainer>
          <SearchOffIcon />
          <Typography variant="h6" color="primary">No galleries found</Typography>
          <Typography variant="body2" color="textSecondary">
            We couldn't find any galleries matching "{searchQuery}"
          </Typography>
        </NoResultsContainer>
      );
    }

    return (
      <Grid container spacing={3}>
        {searchResults.galleries.map((gallery) => (
          <Grid item xs={12} sm={6} md={4} key={gallery._id}>
            <ResultCard>
              <CardActionArea onClick={() => navigate(`/gallery/${gallery._id}`)}>
                {gallery.images && gallery.images.length > 0 && (
                  <ResultMedia
                    image={gallery.images[0].url}
                    title={gallery.title}
                  />
                )}
                <ContentTypeChip
                  label="Gallery"
                  size="small"
                  color="success"
                  icon={<PhotoLibraryIcon fontSize="small" />}
                />
                <ResultContent>
                  <Typography variant="h6" component="h2">{gallery.title}</Typography>
                  <div className="date">
                    <CalendarTodayIcon fontSize="small" />
                    {new Date(gallery.createdAt).toLocaleDateString()}
                  </div>
                  <Box mt={1}>
                    <Chip 
                      label={`${gallery.images.length} images`} 
                      size="small" 
                      variant="outlined" 
                      icon={<PhotoLibraryIcon fontSize="small" />}
                    />
                  </Box>
                </ResultContent>
              </CardActionArea>
            </ResultCard>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderVideos = () => {
    if (searchResults.videos.length === 0) {
      return (
        <NoResultsContainer>
          <SearchOffIcon />
          <Typography variant="h6" color="primary">No videos found</Typography>
          <Typography variant="body2" color="textSecondary">
            We couldn't find any videos matching "{searchQuery}"
          </Typography>
        </NoResultsContainer>
      );
    }

    return (
      <Grid container spacing={3}>
        {searchResults.videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video._id}>
            <ResultCard>
              <CardActionArea onClick={() => navigate(`/video/${video._id}`)}>
                {video.thumbnail && (
                  <ResultMedia
                    image={video.thumbnail}
                    title={video.title}
                  />
                )}
                <ContentTypeChip
                  label="Video"
                  size="small"
                  color="error"
                  icon={<VideoLibraryIcon fontSize="small" />}
                />
                <ResultContent>
                  <Typography variant="h6" component="h2">{video.title}</Typography>
                  <div className="date">
                    <CalendarTodayIcon fontSize="small" />
                    {new Date(video.createdAt).toLocaleDateString()}
                  </div>
                  <Typography variant="body2" color="textSecondary" sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mt: 1
                  }}>
                    {video.description}
                  </Typography>
                </ResultContent>
              </CardActionArea>
            </ResultCard>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderAll = () => {
    if (searchCounts.total === 0 && !searchLoading) {
      return (
        <NoResultsContainer>
          <SearchOffIcon />
          <Typography variant="h6" color="primary">No results found</Typography>
          <Typography variant="body2" color="textSecondary">
            We couldn't find any content matching "{searchQuery}"
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={clearSearch}
          >
            Show All Content
          </Button>
        </NoResultsContainer>
      );
    }

    // Combine all results
    const allResults = [
      ...searchResults.articles.map(item => ({ ...item, type: 'article' })),
      ...searchResults.galleries.map(item => ({ ...item, type: 'gallery' })),
      ...searchResults.videos.map(item => ({ ...item, type: 'video' }))
    ];

    // Sort by creation date (newest first)
    allResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
      <Grid container spacing={3}>
        {allResults.map((item) => {
          let mediaUrl = '';
          let chipColor = 'primary';
          let chipIcon = <ArticleIcon fontSize="small" />;
          let chipLabel = 'Article';
          let linkUrl = '';

          if (item.type === 'article') {
            mediaUrl = item.image || '';
            chipColor = 'primary';
            chipIcon = <ArticleIcon fontSize="small" />;
            chipLabel = 'Article';
            linkUrl = `/article/${item.slug}`;
          } else if (item.type === 'gallery') {
            mediaUrl = item.images && item.images.length > 0 ? item.images[0].url : '';
            chipColor = 'success';
            chipIcon = <PhotoLibraryIcon fontSize="small" />;
            chipLabel = 'Gallery';
            linkUrl = `/gallery/${item._id}`;
          } else if (item.type === 'video') {
            mediaUrl = item.thumbnail || '';
            chipColor = 'error';
            chipIcon = <VideoLibraryIcon fontSize="small" />;
            chipLabel = 'Video';
            linkUrl = `/video/${item._id}`;
          }

          return (
            <Grid item xs={12} sm={6} md={4} key={`${item.type}-${item._id}`}>
              <ResultCard>
                <CardActionArea onClick={() => navigate(linkUrl)}>
                  {mediaUrl && (
                    <ResultMedia
                      image={mediaUrl}
                      title={item.title}
                    />
                  )}
                  <ContentTypeChip
                    label={chipLabel}
                    size="small"
                    color={chipColor}
                    icon={chipIcon}
                  />
                  <ResultContent>
                    <Typography variant="h6" component="h2">{item.title}</Typography>
                    {item.category && (
                      <div className="category">
                        <CategoryIcon fontSize="small" />
                        {item.category}
                      </div>
                    )}
                    <div className="date">
                      <CalendarTodayIcon fontSize="small" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </ResultContent>
                </CardActionArea>
              </ResultCard>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <HomeContainer>
      <Header />
      <MainContent>
        {isSearching ? (
          <SearchContainer>
            <SearchHeader>
              <Typography variant="h4" component="h1" gutterBottom>
                Search Results
              </Typography>
              <SearchBar 
                initialQuery={searchQuery} 
                onSearch={handleSearch}
              />
              {!searchLoading && searchCounts.total > 0 && (
                <Typography variant="body2" color="textSecondary">
                  Found {searchCounts.total} results for "{searchQuery}"
                </Typography>
              )}
              <Button 
                variant="outlined" 
                color="primary"
                onClick={clearSearch}
                sx={{ alignSelf: 'flex-start' }}
              >
                Show All Content
              </Button>
            </SearchHeader>
            
            <Divider />
            
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="search results tabs"
            >
              <Tab 
                label={`All (${searchCounts.total})`} 
                icon={<SearchIcon />} 
                iconPosition="start"
              />
              <Tab 
                label={`Articles (${searchCounts.articles})`} 
                icon={<ArticleIcon />} 
                iconPosition="start"
              />
              <Tab 
                label={`Galleries (${searchCounts.galleries})`} 
                icon={<PhotoLibraryIcon />} 
                iconPosition="start"
              />
              <Tab 
                label={`Videos (${searchCounts.videos})`} 
                icon={<VideoLibraryIcon />} 
                iconPosition="start"
              />
            </Tabs>
            
            <SearchResultsContainer>
              {searchLoading ? (
                <Box display="flex" justifyContent="center" p={4}>
                  <CircularProgress />
                </Box>
              ) : searchError ? (
                <Box textAlign="center" p={4}>
                  <Typography color="error">{searchError}</Typography>
                </Box>
              ) : (
                <>
                  {activeTab === 0 && renderAll()}
                  {activeTab === 1 && renderArticles()}
                  {activeTab === 2 && renderGalleries()}
                  {activeTab === 3 && renderVideos()}
                </>
              )}
            </SearchResultsContainer>
          </SearchContainer>
        ) : (
          <>
            {/* Hero Section */}
            <HeroSection>
              {latestArticles.length > 0 && (
                <MainArticle>
                  <ArticleCard 
                    article={latestArticles[0]} 
                    size="large"
                  />
                </MainArticle>
              )}
              
              <SideArticles>
                {latestArticles.slice(1, 3).map(article => (
                  <ArticleCard 
                    key={article._id} 
                    article={article} 
                    size="small"
                  />
                ))}
              </SideArticles>
            </HeroSection>
        
        {/* Latest News Section */}
        <SectionTitle>
          <UpdateIcon className="title-icon" />
          Latest News
        </SectionTitle>
        <NewsGrid>
          {latestArticles.slice(0, 6).map(article => {
            // Check if article is new (less than 24 hours old)
            const isNew = article.createdAt && 
              differenceInHours(new Date(), parseISO(article.createdAt)) < 24;
            
            // Check if article was recently updated (less than 24 hours ago but not new)
            const wasUpdated = article.updatedAt && article.createdAt &&
              differenceInHours(parseISO(article.updatedAt), parseISO(article.createdAt)) > 1 && 
              differenceInHours(new Date(), parseISO(article.updatedAt)) < 72;
              
            // Add indicator badge to article metadata
            const enhancedArticle = {
              ...article,
              metadataExtra: isNew ? (
                <span className="new-indicator">
                  <NewReleasesIcon style={{ fontSize: 12, marginRight: 4 }} />
                  NEW
                </span>
              ) : wasUpdated ? (
                <span className="updated-indicator">
                  <UpdateIcon style={{ fontSize: 12, marginRight: 4 }} />
                  UPDATED
                </span>
              ) : null
            };
            
            return (
              <ArticleCard 
                key={article._id} 
                article={enhancedArticle}
              />
            );
          })}
        </NewsGrid>
        
        {/* Two Column Layout */}
        <TwoColumnGrid>
          <Column>
            {/* Opinion Section */}
            <SectionTitle>Opinion</SectionTitle>
            {latestArticles
              .filter(article => article.category === 'opinion')
              .slice(0, 3)
              .map(article => (
                <ArticleCard 
                  key={article._id} 
                  article={article}
                />
              ))}
            
            {/* Business Section */}
            <SectionTitle>Business</SectionTitle>
            {latestArticles
              .filter(article => article.category === 'business')
              .slice(0, 3)
              .map(article => (
                <ArticleCard 
                  key={article._id} 
                  article={article}
                />
              ))}
          </Column>
          
          <Column>
            {/* Gallery Section */}
            <GalleryPreview>
              <SectionTitle>Photo Galleries</SectionTitle>
              <GalleryGrid>
                {galleries.slice(0, 4).map(gallery => (
                  <GalleryItem 
                    key={gallery._id}
                    image={gallery.images[0]?.url}
                    onClick={() => window.location.href = `/gallery/${gallery._id}`}
                  >
                    <GalleryTitle>{gallery.title}</GalleryTitle>
                  </GalleryItem>
                ))}
              </GalleryGrid>
            </GalleryPreview>
            
            {/* Video Section */}
            <VideoPreview>
              <SectionTitle>Videos</SectionTitle>
              {videos.slice(0, 3).map(video => (
                <VideoItem 
                  key={video._id}
                  onClick={() => window.location.href = `/video/${video._id}`}
                >
                  <VideoThumbnail image={video.thumbnail} videoUrl={video.videoUrl} />
                  <VideoTitle>{video.title}</VideoTitle>
                </VideoItem>
              ))}
            </VideoPreview>
          </Column>
        </TwoColumnGrid>
        </>
        )}
      </MainContent>
      <Footer />
    </HomeContainer>
  );
};

export default HomePage;
