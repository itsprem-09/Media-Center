import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

// Update the CardContainer styling
const CardContainer = styled.div`
  background-color: #fff;
  border-radius: 0;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border-bottom: 1px solid #e0e0e0;
  
  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  ${props => props.variant === 'topPick' && css`
    border-top: 3px solid #d32f2f;
  `}
  
  ${props => props.variant === 'hero' && css`
    border: none;
    box-shadow: none;
    
    .card-title {
      font-size: 24px;
      line-height: 1.3;
    }
  `}
  
  ${props => props.variant === 'listItem' && css`
    flex-direction: row;
    padding: 10px 0;
    border-bottom: 1px solid #e0e0e0;
    
    .card-image-link {
      width: 100px;
      margin-right: 15px;
    }
    
    .card-content {
      flex: 1;
    }
    
    .card-title {
      font-size: 16px;
      margin-bottom: 5px;
    }
  `}
`;

// Update the CardTitle styling
const CardTitleBase = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 10px;
  line-height: 1.4;
  
  a {
    color: #000;
    text-decoration: none;
    
    &:hover {
      color: #d00000;
    }
  }
`;

// Update the CardCategory styling
const CardCategoryBase = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #d00000;
  text-transform: uppercase;
  margin-bottom: 5px;
`;

const CardImageLink = styled(Link)`
  display: block;
  width: 100%;
  ${props => props.variant === 'listItem' && css`
    width: 100px; // Fixed width for list item images
    height: 75px;
    margin-right: 15px;
    flex-shrink: 0;
  `}
`;

const CardImage = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  background-image: url(${props => props.image || '/placeholder-image.jpg'});
  background-size: cover;
  background-position: center;

  ${props => props.variant === 'listItem' && css`
    height: 100%;
    padding-bottom: 0;
  `}
`;

const CardContent = styled.div`
  padding: 15px;
  flex-grow: 1; // Allows content to fill space
  display: flex;
  flex-direction: column;

  ${props => props.variant === 'listItem' && css`
    padding: 0;
  `}
`;

const CardCategory = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  margin-bottom: 8px;
  font-weight: 600;
  
  a {
    color: ${props => props.variant === 'topPick' ? '#fff' : '#d32f2f'}; // The Hindu red or white for topPick
    text-decoration: none;
    ${props => props.variant === 'topPick' && css`
      background-color: #d32f2f; // The Hindu red
      padding: 3px 8px;
      border-radius: 3px;
      display: inline-block;
    `}
    &:hover {
      color: ${props => props.variant === 'topPick' ? '#fff' : '#000'};
      ${props => props.variant === 'topPick' && css`
        background-color: #b71c1c; // Darker red on hover
      `}
    }
  }
`;

const CardTitle = styled.h3`
  font-family: 'Georgia', 'Times New Roman', serif; // Serif font like The Hindu
  font-size: ${props => 
    props.size === 'large' ? '22px' :
    props.size === 'medium' ? '18px' :
    '16px'};
  line-height: 1.4;
  font-weight: ${props => props.variant === 'hero' ? 700 : 500};
  margin-bottom: 10px;
  
  a {
    color: #1a1a1a; // Darker color for titles
    text-decoration: none;
    &:hover {
      color: #d32f2f; // The Hindu red on hover
    }
  }

  ${props => props.variant === 'listItem' && css`
    font-size: 15px;
    margin-bottom: 5px;
  `}
`;

const CardExcerpt = styled.p`
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2; // Limit to 2 lines
  -webkit-box-orient: vertical;  
  overflow: hidden;
`;

const CardMeta = styled.div`
  font-size: 12px;
  color: #777;
  margin-top: auto; // Pushes meta to the bottom if content above allows
  padding-top: 5px;

  ${props => props.variant === 'listItem' && css`
    font-size: 11px;
  `}
`;

// Helper to get category for Top Picks (assuming article.categoryTag is passed from HomePage)
const getCategoryDisplay = (article, variant) => {
  if (variant === 'topPick' && article.categoryTag) {
    return article.categoryTag;
  }
  return article.category;
};

const ArticleCard = ({ article, size = 'medium', variant = 'default', showExcerpt = false }) => {
  if (!article) return null;

  const categoryDisplay = getCategoryDisplay(article, variant);

  return (
    <CardContainer variant={variant}>
      {article.image && variant !== 'listItem' && (
        <CardImageLink to={`/article/${article.slug || article._id}`} variant={variant}>
          <CardImage image={article.image} variant={variant} />
        </CardImageLink>
      )}
      {article.image && variant === 'listItem' && (
         <CardImageLink to={`/article/${article.slug || article._id}`} variant={variant}>
            <CardImage image={article.image} variant={variant}/>
         </CardImageLink>
      )}

      <CardContent variant={variant}>
        {categoryDisplay && (
          <CardCategory variant={variant}>
            <Link to={`/category/${article.category?.toLowerCase()}`}>{categoryDisplay}</Link>
          </CardCategory>
        )}
        
        <CardTitle size={size} variant={variant}>
          <Link to={`/article/${article.slug || article._id}`}>{article.title}</Link>
        </CardTitle>

        {showExcerpt && article.excerpt && variant !== 'listItem' && (
          <CardExcerpt>{article.excerpt}</CardExcerpt>
        )}
        
        <CardMeta variant={variant}>
          {article.author && `By ${article.author} | `}
          {article.createdAt && new Date(article.createdAt).toLocaleDateString()}
          {article.metadataExtra && <span> {article.metadataExtra}</span>}
        </CardMeta>
      </CardContent>
    </CardContainer>
  );
};

export default ArticleCard;
