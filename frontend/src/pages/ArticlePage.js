import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { fetchArticleBySlug, fetchArticles } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';

const ArticleContainer = styled.div`
  background-color: #FFFFF0;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ArticleContent = styled.div``;

const ArticleHeader = styled.div`
  margin-bottom: 30px;
`;

const ArticleCategory = styled.div`
  font-size: 14px;
  color: #0087a8;
  text-transform: uppercase;
  margin-bottom: 10px;
  font-weight: 600;
`;

const ArticleTitle = styled.h1`
  font-size: 32px;
  line-height: 1.2;
  margin-bottom: 15px;
  font-weight: 700;
  color: #333;
`;

const ArticleMeta = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const ArticleImage = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  background-image: url(${props => props.image || '/placeholder-image.jpg'});
  background-size: cover;
  background-position: center;
  margin-bottom: 20px;
`;

const ArticleBody = styled.div`
  font-size: 18px;
  line-height: 1.8;
  color: #333;
  
  p {
    margin-bottom: 20px;
  }
  
  h2, h3 {
    margin: 30px 0 15px;
    font-weight: 600;
  }
  
  blockquote {
    border-left: 4px solid #0087a8;
    padding-left: 20px;
    margin: 30px 0;
    font-style: italic;
    color: #555;
  }
  
  img {
    max-width: 100%;
    height: auto;
    margin: 20px 0;
  }
`;

const Sidebar = styled.aside``;

const SidebarSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e1e1e1;
  color: #333;
`;

const RelatedArticles = styled.div``;

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

const ArticlePage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch article by slug
        const articleRes = await fetchArticleBySlug(slug);
        setArticle(articleRes.data);
        
        // Fetch related articles from same category
        if (articleRes.data?.category) {
          const relatedRes = await fetchArticles({ 
            category: articleRes.data.category,
            limit: 5
          });
          
          // Filter out the current article from related articles
          const filtered = relatedRes.data.articles.filter(
            a => a._id !== articleRes.data._id
          );
          
          setRelatedArticles(filtered);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug]);
  
  if (loading) {
    return (
      <ArticleContainer>
        <Header />
        <Loading>Loading article...</Loading>
        <Footer />
      </ArticleContainer>
    );
  }
  
  if (error || !article) {
    return (
      <ArticleContainer>
        <Header />
        <ErrorMessage>{error || 'Article not found'}</ErrorMessage>
        <Footer />
      </ArticleContainer>
    );
  }
  
  return (
    <ArticleContainer>
      <Header />
      <MainContent>
        <ArticleContent>
          <ArticleHeader>
            <ArticleCategory>{article.category}</ArticleCategory>
            <ArticleTitle>{article.title}</ArticleTitle>
            <ArticleMeta>
              By {article.author} | Published {new Date(article.createdAt).toLocaleDateString()} | 
              Updated {new Date(article.updatedAt).toLocaleDateString()}
            </ArticleMeta>
            
            {article.image && (
              <ArticleImage image={article.image} />
            )}
          </ArticleHeader>
          
          <ArticleBody dangerouslySetInnerHTML={{ __html: article.content }} />
        </ArticleContent>
        
        <Sidebar>
          <SidebarSection>
            <SectionTitle>Related Articles</SectionTitle>
            <RelatedArticles>
              {relatedArticles.slice(0, 4).map(relatedArticle => (
                <ArticleCard 
                  key={relatedArticle._id} 
                  article={relatedArticle}
                  size="small"
                />
              ))}
            </RelatedArticles>
          </SidebarSection>
        </Sidebar>
      </MainContent>
      <Footer />
    </ArticleContainer>
  );
};

export default ArticlePage;
