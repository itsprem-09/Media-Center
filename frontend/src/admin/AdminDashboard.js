import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AdminLayout from './components/AdminLayout';
import { fetchArticles, fetchGalleries, fetchVideos } from '../utils/api';
import ArticleIcon from '@mui/icons-material/Article';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

const DashboardContainer = styled.div`
  padding: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  align-items: center;
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${props => props.color};
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  
  svg {
    font-size: 30px;
  }
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatCount = styled.div`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const RecentContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const RecentContentSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 30px;
`;

const ContentList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ContentItem = styled.li`
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ContentTitle = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
  
  a {
    color: #333;
    text-decoration: none;
    
    &:hover {
      color: #0087a8;
    }
  }
`;

const ContentMeta = styled.div`
  font-size: 12px;
  color: #666;
`;

const ViewAllLink = styled(Link)`
  display: block;
  text-align: right;
  margin-top: 15px;
  font-size: 14px;
  color: #0087a8;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LoadingMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
`;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    articles: 0,
    galleries: 0,
    videos: 0
  });
  
  const [recentArticles, setRecentArticles] = useState([]);
  const [recentGalleries, setRecentGalleries] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch articles
        const articlesRes = await fetchArticles({ limit: 5 });
        setRecentArticles(articlesRes.data.articles);
        setStats(prev => ({ ...prev, articles: articlesRes.data.pagination.total }));
        
        // Fetch galleries
        const galleriesRes = await fetchGalleries({ limit: 5 });
        setRecentGalleries(galleriesRes.data.galleries);
        setStats(prev => ({ ...prev, galleries: galleriesRes.data.pagination.total }));
        
        // Fetch videos
        const videosRes = await fetchVideos({ limit: 5 });
        setRecentVideos(videosRes.data.videos);
        setStats(prev => ({ ...prev, videos: videosRes.data.pagination.total }));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return (
      <AdminLayout>
        <LoadingMessage>Loading dashboard data...</LoadingMessage>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <DashboardContainer>
        <h1>Dashboard</h1>
        
        <StatsGrid>
          <StatCard>
            <StatIcon color="#4caf50">
              <ArticleIcon />
            </StatIcon>
            <StatInfo>
              <StatCount>{stats.articles}</StatCount>
              <StatLabel>Articles</StatLabel>
            </StatInfo>
          </StatCard>
          
          <StatCard>
            <StatIcon color="#2196f3">
              <PhotoLibraryIcon />
            </StatIcon>
            <StatInfo>
              <StatCount>{stats.galleries}</StatCount>
              <StatLabel>Photo Galleries</StatLabel>
            </StatInfo>
          </StatCard>
          
          <StatCard>
            <StatIcon color="#f44336">
              <VideoLibraryIcon />
            </StatIcon>
            <StatInfo>
              <StatCount>{stats.videos}</StatCount>
              <StatLabel>Videos</StatLabel>
            </StatInfo>
          </StatCard>
        </StatsGrid>
        
        <RecentContentGrid>
          <RecentContentSection>
            <SectionTitle>Recent Articles</SectionTitle>
            
            <ContentList>
              {recentArticles.length > 0 ? (
                recentArticles.map(article => (
                  <ContentItem key={article._id}>
                    <ContentTitle>
                      <Link to={`/admin/articles/edit/${article._id}`}>{article.title}</Link>
                    </ContentTitle>
                    <ContentMeta>
                      {article.category} | {new Date(article.createdAt).toLocaleDateString()}
                    </ContentMeta>
                  </ContentItem>
                ))
              ) : (
                <ContentItem>No articles found</ContentItem>
              )}
            </ContentList>
            
            <ViewAllLink to="/admin/articles">View All Articles</ViewAllLink>
          </RecentContentSection>
          
          <RecentContentSection>
            <SectionTitle>Recent Galleries</SectionTitle>
            
            <ContentList>
              {recentGalleries.length > 0 ? (
                recentGalleries.map(gallery => (
                  <ContentItem key={gallery._id}>
                    <ContentTitle>
                      <Link to={`/admin/galleries/edit/${gallery._id}`}>{gallery.title}</Link>
                    </ContentTitle>
                    <ContentMeta>
                      {gallery.images.length} images | {new Date(gallery.createdAt).toLocaleDateString()}
                    </ContentMeta>
                  </ContentItem>
                ))
              ) : (
                <ContentItem>No galleries found</ContentItem>
              )}
            </ContentList>
            
            <ViewAllLink to="/admin/galleries">View All Galleries</ViewAllLink>
          </RecentContentSection>
        </RecentContentGrid>
        
        <RecentContentSection>
          <SectionTitle>Recent Videos</SectionTitle>
          
          <ContentList>
            {recentVideos.length > 0 ? (
              recentVideos.map(video => (
                <ContentItem key={video._id}>
                  <ContentTitle>
                    <Link to={`/admin/videos/edit/${video._id}`}>{video.title}</Link>
                  </ContentTitle>
                  <ContentMeta>
                    {new Date(video.createdAt).toLocaleDateString()}
                  </ContentMeta>
                </ContentItem>
              ))
            ) : (
              <ContentItem>No videos found</ContentItem>
            )}
          </ContentList>
          
          <ViewAllLink to="/admin/videos">View All Videos</ViewAllLink>
        </RecentContentSection>
      </DashboardContainer>
    </AdminLayout>
  );
};

export default AdminDashboard;
