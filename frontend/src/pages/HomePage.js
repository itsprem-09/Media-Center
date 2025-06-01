import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchArticles, fetchGalleries, fetchVideos } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import UpdateIcon from '@mui/icons-material/Update';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import { format, parseISO, differenceInHours } from 'date-fns';

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

const HomePage = () => {
  const [latestArticles, setLatestArticles] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
  
  return (
    <HomeContainer>
      <Header />
      <MainContent>
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
      </MainContent>
      <Footer />
    </HomeContainer>
  );
};

export default HomePage;
