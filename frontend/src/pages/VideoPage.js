import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { fetchVideoById, fetchVideos } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const VideoContainer = styled.div`
  background-color: #FFFFF0;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const VideoHeader = styled.div`
  margin-bottom: 30px;
`;

const VideoTitle = styled.h1`
  font-size: 32px;
  margin-bottom: 15px;
  font-weight: 700;
  color: #333;
`;

const VideoDate = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const VideoPlayer = styled.div`
  margin-bottom: 30px;
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  
  iframe,
  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const VideoDescription = styled.div`
  font-size: 18px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 40px;
`;

const RelatedVideosSection = styled.div`
  margin-top: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e1e1e1;
  color: #333;
`;

const RelatedVideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const RelatedVideoCard = styled.div`
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const VideoThumbnail = styled.div`
  position: relative;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  background-image: url(${props => props.image || '/placeholder-image.jpg'});
  background-size: cover;
  background-position: center;
  margin-bottom: 10px;
  
  &::after {
    content: '▶';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
`;

const RelatedVideoTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 5px;
  font-weight: 500;
`;

const Loading = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 50px;
  color: red;
`;

// Helper function to extract YouTube video ID from URL
const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch video by id
        const videoRes = await fetchVideoById(id);
        setVideo(videoRes.data);
        
        // Fetch related videos
        const relatedRes = await fetchVideos({ limit: 6 });
        
        // Filter out the current video from related videos
        const filtered = relatedRes.data.videos.filter(
          v => v._id !== videoRes.data._id
        );
        
        setRelatedVideos(filtered);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching video:', err);
        setError('Failed to load video. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  if (loading) {
    return (
      <VideoContainer>
        <Header />
        <Loading>Loading video...</Loading>
        <Footer />
      </VideoContainer>
    );
  }
  
  if (error || !video) {
    return (
      <VideoContainer>
        <Header />
        <ErrorMessage>{error || 'Video not found'}</ErrorMessage>
        <Footer />
      </VideoContainer>
    );
  }
  
  // Get YouTube video ID
  const youtubeId = getYouTubeId(video.videoUrl);
  
  return (
    <VideoContainer>
      <Header />
      <MainContent>
        <VideoHeader>
          <VideoTitle>{video.title}</VideoTitle>
          <VideoDate>
            Published {new Date(video.createdAt).toLocaleDateString()}
          </VideoDate>
        </VideoHeader>
        
        <VideoPlayer>
          {youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={video.title}
              allowFullScreen
            ></iframe>
          ) : video.videoUrl ? (
            <video controls>
              <source src={video.videoUrl} type={`video/${video.format || 'mp4'}`} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div style={{ padding: '20px', background: '#f0f0f0', textAlign: 'center' }}>
              Video not available
            </div>
          )}
        </VideoPlayer>
        
        <VideoDescription>
          {video.description}
        </VideoDescription>
        
        <RelatedVideosSection>
          <SectionTitle>Related Videos</SectionTitle>
          <RelatedVideosGrid>
            {relatedVideos.map(relatedVideo => (
              <RelatedVideoCard 
                key={relatedVideo._id}
                onClick={() => window.location.href = `/video/${relatedVideo._id}`}
              >
                <VideoThumbnail image={relatedVideo.thumbnail} />
                <RelatedVideoTitle>{relatedVideo.title}</RelatedVideoTitle>
              </RelatedVideoCard>
            ))}
          </RelatedVideosGrid>
        </RelatedVideosSection>
      </MainContent>
      <Footer />
    </VideoContainer>
  );
};

export default VideoPage;
