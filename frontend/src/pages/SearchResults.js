import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  CircularProgress,
  Divider,
  Button
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import * as api from '../utils/api';
import SearchBar from '../components/SearchBar';

const SearchContainer = styled(Box)`
  padding: 30px 0;
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
  padding: 60px 20px;
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

const SearchResults = () => {
  const query = useQuery();
  const searchQuery = query.get('query') || '';
  const navigate = useNavigate();
  const [results, setResults] = useState({ articles: [], galleries: [], videos: [] });
  const [counts, setCounts] = useState({ articles: 0, galleries: 0, videos: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    }
  }, [searchQuery]);

  const fetchSearchResults = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.searchContent(query);
      setResults(response.data.results);
      setCounts(response.data.counts);
    } catch (error) {
      console.error('Search error:', error);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery) => {
    navigate(`/search?query=${encodeURIComponent(newQuery.trim())}`);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderArticles = () => {
    if (results.articles.length === 0) {
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
        {results.articles.map((article) => (
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
    if (results.galleries.length === 0) {
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
        {results.galleries.map((gallery) => (
          <Grid item xs={12} sm={6} md={4} key={gallery._id}>
            <ResultCard>
              <CardActionArea onClick={() => navigate(`/gallery/${gallery._id}`)}>
                {gallery.images && gallery.images.length > 0 && (
                  <ResultMedia
                    image={gallery.coverImage || 'https://via.placeholder.com/300x200?text=Gallery'}
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
    if (results.videos.length === 0) {
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
        {results.videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video._id}>
            <ResultCard>
              <CardActionArea onClick={() => navigate(`/video/${video._id}`)}>
                {video.thumbnail && (
                  <ResultMedia
                    image={video.thumbnail || 'https://via.placeholder.com/300x200?text=Video'}
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
    if (counts.total === 0 && !loading) {
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
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </NoResultsContainer>
      );
    }

    // Combine all results
    const allResults = [
      ...results.articles.map(item => ({ ...item, type: 'article' })),
      ...results.galleries.map(item => ({ ...item, type: 'gallery' })),
      ...results.videos.map(item => ({ ...item, type: 'video' }))
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
                    {item.type === 'article' && item.tags && item.tags.length > 0 && (
                      <Box mt={1} display="flex" gap={0.5} flexWrap="wrap">
                        {item.tags.slice(0, 3).map((tag, index) => (
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
                    {item.type === 'video' && item.description && (
                      <Typography variant="body2" color="textSecondary" sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mt: 1
                      }}>
                        {item.description}
                      </Typography>
                    )}
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
    <>
      <Container maxWidth="lg">
        <SearchContainer>
          <SearchHeader>
            <Typography variant="h4" component="h1" gutterBottom>
              Search Results
            </Typography>
            <SearchBar 
              initialQuery={searchQuery} 
              onSearch={handleSearch} 
            />
            {!loading && counts.total > 0 && (
              <Typography variant="body2" color="textSecondary">
                Found {counts.total} results for "{searchQuery}"
              </Typography>
            )}
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
              label={`All (${counts.total})`} 
              icon={<SearchIcon />} 
              iconPosition="start"
            />
            <Tab 
              label={`Articles (${counts.articles})`} 
              icon={<ArticleIcon />} 
              iconPosition="start"
            />
            <Tab 
              label={`Galleries (${counts.galleries})`} 
              icon={<PhotoLibraryIcon />} 
              iconPosition="start"
            />
            <Tab 
              label={`Videos (${counts.videos})`} 
              icon={<VideoLibraryIcon />} 
              iconPosition="start"
            />
          </Tabs>
          
          <SearchResultsContainer>
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box textAlign="center" p={4}>
                <Typography color="error">{error}</Typography>
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
      </Container>
    </>
  );
};

export default SearchResults;
