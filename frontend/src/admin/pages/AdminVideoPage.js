import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as api from '../../utils/api';
import VideoForm from '../components/VideoForm';
import { CircularProgress } from '@mui/material';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const AdminVideoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // If editing, fetch the video data
    if (isEditing) {
      const fetchVideo = async () => {
        try {
          setLoading(true);
          const response = await api.fetchVideoById(id);
          setVideo(response.data);
        } catch (error) {
          console.error('Error fetching video:', error);
          setError('Failed to load video. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchVideo();
    }
  }, [id, isEditing]);
  
  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      </Container>
    );
  }
  
  if (isEditing && !video) {
    return (
      <Container>
        <ErrorMessage>
          {error || 'Video not found. It may have been deleted or you may not have permission to view it.'}
        </ErrorMessage>
        <button onClick={() => navigate('/admin/videos')}>
          Back to Videos
        </button>
      </Container>
    );
  }
  
  return (
    <Container>
      <VideoForm 
        initialData={video} 
        isEditing={isEditing}
      />
    </Container>
  );
};

export default AdminVideoPage;
