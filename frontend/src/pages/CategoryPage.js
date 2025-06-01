import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { fetchArticles } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import CategoryIcon from '@mui/icons-material/Category';
import LocalNewsIcon from '@mui/icons-material/Newspaper';
import BusinessIcon from '@mui/icons-material/Business';
import SportsIcon from '@mui/icons-material/Sports';
import EntertainmentIcon from '@mui/icons-material/TheaterComedy';
import TechIcon from '@mui/icons-material/Devices';
import LifestyleIcon from '@mui/icons-material/Spa';
import OpinionIcon from '@mui/icons-material/Comment';

const CategoryContainer = styled.div`
  background-color: #f9f9f9;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const CategoryHeader = styled.div`
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

const CategoryTitle = styled.h1`
  font-size: 32px;
  color: #222;
  text-transform: capitalize;
  font-family: 'Noto Serif', serif;
  display: flex;
  align-items: center;
  
  .category-icon {
    margin-right: 12px;
    color: #2b6da8;
  }
`;

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

const PageButton = styled.button`
  background-color: ${props => props.active ? '#2b6da8' : '#ffffff'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 1px solid #e0e0e0;
  padding: 8px 15px;
  margin: 0 5px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  font-family: 'Open Sans', sans-serif;
  transition: all 0.2s ease;
  border-radius: 4px;
  
  &:hover {
    background-color: ${props => props.active ? '#2b6da8' : '#f5f5f5'};
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
`;

const NoArticles = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #666;
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

const CategoryPage = () => {
  const getCategoryIcon = (category) => {
    switch(category.toLowerCase()) {
      case 'news':
        return <LocalNewsIcon className="category-icon" />;
      case 'business':
        return <BusinessIcon className="category-icon" />;
      case 'sport':
        return <SportsIcon className="category-icon" />;
      case 'entertainment':
        return <EntertainmentIcon className="category-icon" />;
      case 'technology':
        return <TechIcon className="category-icon" />;
      case 'lifestyle':
        return <LifestyleIcon className="category-icon" />;
      case 'opinion':
        return <OpinionIcon className="category-icon" />;
      default:
        return <CategoryIcon className="category-icon" />;
    }
  };
  
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchCategoryArticles = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetchArticles({ 
        category, 
        page,
        limit: 9
      });
      
      setArticles(res.data.articles);
      setPagination(res.data.pagination);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching category articles:', err);
      setError('Failed to load articles. Please try again later.');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCategoryArticles();
  }, [category]);
  
  const handlePageChange = (page) => {
    fetchCategoryArticles(page);
  };
  
  if (loading) {
    return (
      <CategoryContainer>
        <Header />
        <Loading>Loading articles...</Loading>
        <Footer />
      </CategoryContainer>
    );
  }
  
  if (error) {
    return (
      <CategoryContainer>
        <Header />
        <ErrorMessage>{error}</ErrorMessage>
        <Footer />
      </CategoryContainer>
    );
  }
  
  return (
    <CategoryContainer>
      <Header />
      <MainContent>
        <CategoryHeader>
          <CategoryTitle>
            {getCategoryIcon(category)}
            {category}
          </CategoryTitle>
        </CategoryHeader>
        
        {articles.length > 0 ? (
          <ArticlesGrid>
            {articles.map(article => (
              <ArticleCard 
                key={article._id} 
                article={article}
              />
            ))}
          </ArticlesGrid>
        ) : (
          <NoArticles>No articles found in this category.</NoArticles>
        )}
        
        {pagination.pages > 1 && (
          <Pagination>
            <PageButton 
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </PageButton>
            
            {[...Array(pagination.pages)].map((_, i) => (
              <PageButton 
                key={i + 1}
                active={pagination.page === i + 1}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </PageButton>
            ))}
            
            <PageButton 
              disabled={pagination.page === pagination.pages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </PageButton>
          </Pagination>
        )}
      </MainContent>
      <Footer />
    </CategoryContainer>
  );
};

export default CategoryPage;
