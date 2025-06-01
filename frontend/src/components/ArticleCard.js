import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const CardContainer = styled.div`
  margin-bottom: 20px;
  border-bottom: ${props => props.border ? '1px solid #e1e1e1' : 'none'};
  padding-bottom: ${props => props.border ? '20px' : '0'};
`;

const CardImage = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  background-image: url(${props => props.image || '/placeholder-image.jpg'});
  background-size: cover;
  background-position: center;
  margin-bottom: 10px;
`;

const CardCategory = styled.div`
  font-size: 12px;
  color: #0087a8;
  text-transform: uppercase;
  margin-bottom: 5px;
  font-weight: 600;
`;

const CardTitle = styled.h3`
  font-size: ${props => props.size === 'large' ? '24px' : props.size === 'medium' ? '18px' : '16px'};
  margin-bottom: 8px;
  line-height: 1.3;
  font-weight: 600;
  
  a {
    color: #333;
    text-decoration: none;
    
    &:hover {
      color: #0087a8;
    }
  }
`;

const CardMeta = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
`;

const ArticleCard = ({ article, size = 'medium', border = true }) => {
  return (
    <CardContainer border={border}>
      {article.image && (
        <Link to={`/article/${article.slug}`}>
          <CardImage image={article.image} />
        </Link>
      )}
      
      <CardCategory>
        <Link to={`/category/${article.category}`}>{article.category}</Link>
      </CardCategory>
      
      <CardTitle size={size}>
        <Link to={`/article/${article.slug}`}>{article.title}</Link>
      </CardTitle>
      
      <CardMeta>
        By {article.author} | {new Date(article.createdAt).toLocaleDateString()}
        {article.metadataExtra && article.metadataExtra}
      </CardMeta>
    </CardContainer>
  );
};

export default ArticleCard;
