import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as api from '../../utils/api';
import GalleryForm from '../components/GalleryForm';
import { CircularProgress, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CollectionsIcon from '@mui/icons-material/Collections';

const Container = styled.div`
  padding: 30px 20px;
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
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 12px;
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  margin: 0;
  color: #2b6da8;
  font-size: 28px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 12px;
  }
`;

const BackButton = styled(Button)`
  &.MuiButton-root {
    color: #555;
    margin-bottom: 24px;
    text-transform: none;
    font-weight: 500;
  }
`;

const AdminGalleryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // If editing, fetch the gallery data
    if (isEditing) {
      const fetchGallery = async () => {
        try {
          setLoading(true);
          const response = await api.fetchGalleryById(id);
          setGallery(response.data);
        } catch (error) {
          console.error('Error fetching gallery:', error);
          setError('Failed to load gallery. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchGallery();
    }
  }, [id, isEditing]);
  
  if (loading) {
    return (
      <Container>
        <BackButton
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/galleries')}
        >
          Back to Galleries
        </BackButton>
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      </Container>
    );
  }
  
  if (isEditing && !gallery) {
    return (
      <Container>
        <BackButton
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/galleries')}
        >
          Back to Galleries
        </BackButton>
        <ErrorMessage>
          {error || 'Gallery not found. It may have been deleted or you may not have permission to view it.'}
        </ErrorMessage>
      </Container>
    );
  }
  
  return (
    <Container>
      <PageHeader>
        <PageTitle>
          <CollectionsIcon fontSize="large" />
          {isEditing ? 'Edit Gallery' : 'Create Gallery'}
        </PageTitle>
      </PageHeader>
      
      <BackButton
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/admin/galleries')}
      >
        Back to Galleries
      </BackButton>
      
      <GalleryForm 
        initialData={gallery} 
        isEditing={isEditing}
      />
    </Container>
  );
};

export default AdminGalleryPage;
