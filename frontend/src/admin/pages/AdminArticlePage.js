import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as api from '../../utils/api';
import ArticleForm from '../components/ArticleForm';
import { CircularProgress } from '@mui/material';
import AdminLayout from '../components/AdminLayout';

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

const AdminArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        if (id === 'new') return;
        setLoading(true);
        const response = await api.fetchArticleById(id);
        setArticle(response.data);
      } catch (error) {
        setError('Failed to load article data.');
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [id]);
  
  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      </Container>
    );
  }
  
  if (isEditing && !article) {
    return (
      <Container>
        <ErrorMessage>
          {error || 'Article not found. It may have been deleted or you may not have permission to view it.'}
        </ErrorMessage>
        <button onClick={() => navigate('/admin/articles')}>
          Back to Articles
        </button>
      </Container>
    );
  }
  
  return (
    <Container>
      <ArticleForm 
        initialData={article} 
        isEditing={isEditing}
      />
    </Container>
  );
};

export default AdminArticlePage;
