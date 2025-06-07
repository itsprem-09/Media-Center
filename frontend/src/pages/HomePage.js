import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchArticles, fetchGalleries, fetchVideos, searchContent } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import UpdateIcon from '@mui/icons-material/Update';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import PersonIcon from '@mui/icons-material/Person';
import { format, parseISO, differenceInHours, formatDistanceToNow } from 'date-fns';
import {
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Button
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import SearchBar from '../components/SearchBar';
import AdBanner from '../components/AdBanner';
import TopPicksCarousel from '../components/TopPicksCarousel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';

const HomeContainer = styled.div`
  background-color: #f9f9f9;
`;

// Styled components for Shorts Section
const ShortsWrapper = styled.section`
  padding: 30px 0;
  border-bottom: 1px solid #e0e0e0; /* Optional: if you want a separator */
`;

const ShortsHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ShortsTitleLogo = styled.div`
  background-color: #000;
  color: #fff;
  font-weight: bold;
  font-size: 20px; /* Adjust as needed */
  border-radius: 50%;
  width: 40px; /* Adjust as needed */
  height: 40px; /* Adjust as needed */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; /* A common sans-serif for logos */
`;

const ShortsTitleText = styled.h2`
  font-size: 24px; /* Adjust as needed */
  font-weight: bold;
  color: #B71C1C; /* Media Center Red */
  margin: 0;
  font-family: 'Didot', 'GFS Didot', serif; /* Consistent with other titles */
`;

const ShortsGrid = styled.div`
  display: flex;
  gap: 15px;
  overflow-x: auto; /* Allows horizontal scrolling if items exceed width */
  padding-bottom: 15px; /* Space for scrollbar if it appears */
  /* To hide scrollbar visually if desired, platform-dependent CSS might be needed */
  &::-webkit-scrollbar {
    display: none; /* Hide scrollbar for WebKit browsers */
  }
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`;

const ShortCard = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;
  min-width: 180px; /* Adjust as needed, approx 1/5 of typical container width minus gaps */
  max-width: 180px;
  flex: 0 0 auto;
`;

const ShortCardImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 160%; /* For an aspect ratio of 10:16 (200x320) */
  background-color: #f0f0f0; /* Placeholder color */
  border-radius: 8px;
  overflow: hidden;
`;

const ShortCardImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ShortCardReelIcon = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  padding: 2px 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    font-size: 20px; /* Adjust icon size */
  }
`;

const ShortCardCaption = styled.p`
  font-size: 13px;
  line-height: 1.4;
  color: #333;
  margin-top: 8px;
  font-family: 'Open Sans', sans-serif;
`;

const ShortsSeeMoreLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  text-transform: uppercase;
  margin-top: 25px;
  padding: 10px 0;
  font-family: 'Open Sans', sans-serif;
  svg {
    margin-left: 5px;
    font-size: 16px;
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px 25px;
  
  @media (max-width: 768px) {
    padding: 10px 15px;
  }
`;

const TopAdContainer = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const ThreeColumnHeroLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 15px;
  margin-bottom: 25px;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const HeroColumn = styled.div`
  background-color: #fff;
  border: 1px solid #e0e0e0;
  
  &:nth-child(2) {
    border-top: 3px solid #d32f2f;
  }
`;

const ColumnTitle = styled.h2`
  font-size: 22px;
  font-weight: bold;
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #d32f2f;
  /* font-family removed to inherit GFS Didot from h2 global style */
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 50px;
    height: 2px;
    background-color: #d32f2f;
  }
`;

const MainArticleWrapper = styled.div`
  /* Styles for the main article in the middle column if needed */
  .article-card-topPick {
    /* Custom styles for topPick in this specific context if ArticleCard's own aren't enough */
  }
`;

const SideArticleList = styled.ul` // Changed to ul for semantic list items
  padding-left: 0; /* Remove default ul padding */
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  .article-card-listItem {
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
  }
`;

// Styled components for the new "Latest News" design in the hero section
const LatestNewsItem = styled.li`
  list-style: none;
  position: relative;
  padding-left: 30px; /* Space for icon (12px) and line (2px), and ~16px text margin */
  margin-bottom: 20px; /* Spacing between items, affects line length */

  &:before { /* Red circle */
    content: '';
    position: absolute;
    left: 0;
    top: 5px; /* Adjust if meta text is taller/shorter */
    width: 12px;
    height: 12px;
    background-color: #D32F2F; /* Theme red color */
    border-radius: 50%;
    z-index: 1;
  }

  &:after { /* Vertical line */
    content: '';
    position: absolute;
    left: 5px; /* Aligns with center of 12px circle at left:0 */
    top: 17px; /* Start below the circle (5px top + 12px height) */
    width: 2px;
    background-color: #e0e0e0; /* Light grey line */
    bottom: -20px; /* Extends to the next item's circle top based on margin-bottom */
  }

  &:last-child {
    margin-bottom: 0; /* No extra space after the last item */
  }

  &:last-child:after {
    display: none; /* No line after the last item */
  }
`;

const NewsMeta = styled.div`
  font-size: 0.8rem; /* approx 12.8px */
  color: #757575;
  margin-bottom: 5px; /* Space between meta and title */

  .category {
    color: #D32F2F; /* Theme red for category */
    font-weight: 500; 
  }
`;

const NewsTitle = styled.h4`
  font-size: 1rem; /* approx 16px */
  font-weight: 500;
  color: #333;
  margin: 0 0 5px 0; /* Small bottom margin for spacing */
  line-height: 1.4;
  
  a {
    text-decoration: none;
    color: inherit;
    &:hover {
      color: #D32F2F; /* Theme red on hover */
    }
  }
`;

const PremiumArticleItem = styled.div`
  padding: 15px 0;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: background-color 0.2s ease;
  padding-left: 10px;
  padding-right: 10px;
  border-left: 3px solid transparent;
  
  &:hover {
    background-color: #f9f9f9;
    border-left: 3px solid #D32F2F;
  }

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .content {
    flex-grow: 1;
  }

  .title {
    font-family: 'Georgia', 'Times New Roman', Times, serif;
    font-size: 16px;
    font-weight: 500;
    color: #333;
    line-height: 1.4;
    margin-bottom: 8px;
    text-decoration: none;
    display: block;
    
    &:hover {
      color: #D32F2F;
    }
    
    &::before {
      content: '★';
      color: #D32F2F;
      margin-right: 6px;
      font-size: 12px;
    }
  }

  .author {
    font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 11px;
    font-weight: 700;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
  }
  
  .author-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-left: 15px; 
    flex-shrink: 0;
    object-fit: cover;
    border: 1px solid #e0e0e0;
  }
`;

const HeroPremiumItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 22px;
  font-weight: bold;
  margin: 30px 0 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #d32f2f;
  
  .title-icon {
    margin-right: 8px;
    color: #d32f2f;
  }
  
  .see-more-link {
    margin-left: auto;
    font-size: 14px;
    font-weight: normal;
    color: #666;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
      color: #d32f2f;
    }
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

const SectionContainer = styled.section`
  margin-bottom: 40px;
`;

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

// Styled Components for "Media Center Explains" Section
const ExplainsWrapper = styled.section`
  margin: 40px 0;
  font-family: 'Didot', 'GFS Didot', serif; /* Consistent serif font */
`;

const ExplainsHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
`;

const ExplainsTitle = styled.h2`
  font-size: 28px;
  font-weight: bold;
  color: #B71C1C; /* Dark red color from image */
  margin: 0;
  font-family: 'Didot', 'GFS Didot', serif;
`;

const ExplainsPremiumBadge = styled.span`
  background-color: #FFD700; /* Gold-ish yellow */
  color: #000;
  font-size: 10px;
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 4px;
  margin-left: 12px;
  text-transform: uppercase;
  font-family: 'Open Sans', sans-serif; /* Sans-serif for badge */
`;

const ExplainsContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr;
  gap: 25px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr 1fr;
    /* Main article could span full width or we adjust */
    & > :first-child {
      grid-column: span 2; /* Main article spans both columns */
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    & > :first-child,
    & > :nth-child(2),
    & > :nth-child(3) {
      grid-column: span 1;
    }
  }
`;

const ExplainsArticleBase = styled.div`
  display: flex;
  flex-direction: column;
  color: #333;
  text-decoration: none;
  
  &:hover {
    /* Optional: add hover effect if these are links */
  }
`;

const ExplainsMainArticle = styled(ExplainsArticleBase)`
  /* Styles for the large article on the left */
`;

const ExplainsArticleImage = styled.img`
  display: block; /* Ensure image takes its own line */
  width: 100%;
  height: auto;
  object-fit: cover;
  margin-bottom: 12px;
  border-radius: 2px;
`;

const ExplainsArticleTitle = styled.h3`
  font-family: 'Didot', 'GFS Didot', serif;
  font-size: ${props => props.size === 'sub' ? '18px' : '22px'}; 
  font-weight: bold;
  color: #222; /* Darker than default body text */
  margin: 0 0 8px 0;
  line-height: 1.2;
`;

const ExplainsArticleAuthor = styled.p`
  font-size: 11px;
  color: #555;
  margin: 0 0 15px 0; /* Increased bottom margin */
  text-transform: uppercase;
  font-family: 'Open Sans', sans-serif; /* Sans-serif for author */
  text-decoration: underline;
  text-decoration-color: #555; /* Underline color matches text */
  display: inline-block; /* To make underline only span text width */
`;

const ExplainsMiddleColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ExplainsMiddleArticle = styled(ExplainsArticleBase)`
  padding-bottom: 15px;
  &:not(:last-child) {
    border-bottom: 1px solid #e0e0e0;
  }
  /* No specific author style override needed here anymore */
`;

const ExplainsRightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ExplainsRightArticle = styled(ExplainsArticleBase)`
  &:not(:last-child) {
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 15px; /* Keep padding to space content from border */
    /* margin-bottom removed as ExplainsRightColumn uses gap */
  }
`;

const ExplainsSeeMoreLink = styled(Link)`
  display: flex; /* Use flex for centering */
  justify-content: center; /* Center horizontally */
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  text-transform: uppercase;
  margin-top: 25px;
  padding: 10px 0; /* Add some padding */
  font-family: 'Open Sans', sans-serif;

  svg {
    margin-left: 8px;
    font-size: 18px;
  }

  &:hover {
    color: #B71C1C;
  }
`;


const TopVideosContainer = styled.section`
  background-color: #1A1A1A; /* Dark background */
  padding: 20px;
  margin-bottom: 40px;
  /* Removed border-radius and box-shadow for a flatter look like the reference */

  .section-title-videos {
    color: #FFFFFF; /* White text for title */
    border-bottom: none; /* Remove bottom border, title style is different */
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px; /* Add some padding if needed */
    padding-left: 0; /* Align with the content */
    font-family: 'GFS Didot', serif; /* Changed to GFS Didot */
    font-size: 20px; /* Slightly larger title */
    font-weight: bold;
    text-transform: uppercase;

    span {
      display: flex;
      align-items: center;
      /* Red accent for TH-style icon */
      &::before {
        content: 'TH'; /* Or use an SVG/icon component */
        background-color: #D32F2F;
        color: white;
        padding: 4px 8px;
        font-size: 12px;
        font-weight: bold;
        border-radius: 3px;
        margin-right: 10px;
        line-height: 1;
      }
    }
  }

  .view-all-videos-link {
    color: #BBBBBB; /* Light grey for less emphasis */
    text-decoration: none;
    font-size: 13px;
    font-weight: normal;
    text-transform: uppercase;
    &:hover {
      color: #FFFFFF;
      text-decoration: underline;
    }
  }
`

const TopVideosLayout = styled.div`
  display: grid;
  grid-template-columns: 2.2fr 1fr; /* Main video takes more space, adjusted ratio */
  gap: 20px; /* Gap like in the reference */

  @media (max-width: 992px) {
    grid-template-columns: 1.8fr 1fr;
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const MainVideoWrapper = styled.div`
  cursor: pointer;
  position: relative;
  overflow: hidden;
  /* Removed border-radius and box-shadow */
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
  
  .video-thumbnail-main {
    height: 400px; /* Adjusted height for prominence */
    border-radius: 0; /* No border radius for sharp edges */
    margin-bottom: 0;
    background-color: #333; /* Placeholder if image fails */
    position: relative; /* For positioning pseudo-elements like the TH logo */
    overflow: hidden; /* Ensure pseudo-elements are contained */

    /* TH Logo for Main Video Thumbnail */
    &::after {
      content: 'TH';
      position: absolute;
      top: 15px;
      right: 15px;
      background-color: rgba(255, 255, 255, 0.9);
      color: #1A1A1A; /* Dark text on light background */
      padding: 0;
      width: 36px;
      height: 36px;
      font-size: 16px;
      font-weight: bold;
      border-radius: 50%; /* Circular logo */
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      z-index: 2;
    }
  }
  
  .video-title-main {
    font-size: 20px; /* Larger title */
    font-weight: bold;
    color: #FFFFFF; /* White text */
    line-height: 1.4;
    padding: 12px 0 0 0; /* Padding top, no horizontal/bottom padding */
    background: transparent; /* No background color */
    font-family: 'GFS Didot', serif; /* Changed to GFS Didot */
    /* text-shadow: 1px 1px 2px rgba(0,0,0,0.7); */ /* Optional text shadow for readability */
  }
  
  /* Play icon overlay for Main Video */
  .play-icon-overlay {
    position: absolute;
    /* Center on the thumbnail area (400px height), not the entire wrapper */
    top: calc(400px / 2); /* Half of thumbnail height */
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70px;
    height: 70px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none; /* Click is on MainVideoWrapper */
    z-index: 1;
    transition: background-color 0.2s ease, transform 0.2s ease;

    /* Triangle (play symbol) */
    &::before {
      content: '';
      width: 0;
      height: 0;
      border-top: 12px solid transparent;
      border-bottom: 12px solid transparent;
      border-left: 20px solid rgba(255, 255, 255, 0.9);
      margin-left: 5px; /* Adjust to center triangle in circle */
    }
  }

  &:hover .play-icon-overlay {
    background-color: rgba(200, 0, 0, 0.7); /* More prominent on hover */
    transform: translate(-50%, -50%) scale(1.1);
  }
`

const VideoListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0; /* No gap, borders will separate */
  background: #000000; /* Black background for the list */
  /* Removed border-radius and box-shadow */
  padding: 0; /* Padding will be on items if needed */
`

const VideoListItemStyled = styled.div`
  display: flex;
  cursor: pointer;
  align-items: flex-start; /* Align items to the top */
  gap: 12px; /* Space between thumbnail and title */
  padding: 12px; /* Padding around each item */
  border-bottom: 1px solid #2A2A2A; /* Darker border */
  transition: background-color 0.2s ease;
  background-color: #000000; /* Black background for each item */
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #111111; /* Slight hover effect */
  }

  .video-thumbnail-list {
    width: 120px; /* Adjusted width */
    height: 68px;  /* Adjusted height (16:9 ratio for 120px width) */
    flex-shrink: 0;
    border-radius: 0; /* No border radius */
    position: relative;
    background-color: #222; /* Placeholder if image fails */
    overflow: hidden; /* Ensure play icon is contained if added */

    /* Small play icon for list items, similar to reference */
    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 0;
        height: 0;
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
        border-left: 10px solid rgba(255, 255, 255, 0.7);
        opacity: 0.8;
    }
    /* TH logo overlay on list items */
    &::after {
        content: 'TH';
        position: absolute;
        top: 4px;
        left: 4px;
        background-color: rgba(0,0,0,0.5);
        color: white;
        padding: 2px 4px;
        font-size: 9px;
        font-weight: bold;
        border-radius: 2px;
        line-height: 1;
    }
  }
  
  .video-title-list {
    flex: 1;
    min-width: 0;
    font-size: 14px;
    font-weight: 500; /* Or 'normal' if too bold */
    color: #E0E0E0; /* Light grey text */
    line-height: 1.3;
    font-family: 'GFS Didot', serif; /* Changed to GFS Didot */
    max-height: 54px; /* Approx 3 lines with 1.3 line height */
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* Limit to 3 lines */
    -webkit-box-orient: vertical;
  }
  
  &:hover .video-title-list {
    color: #FFFFFF; /* Brighter white on hover */
  }
`

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
  height: 100%; /* Make it fill the container (.video-thumbnail-main or .video-thumbnail-list) */
  width: 100%;
  background-image: url(${props => props.image || getCloudinaryVideoThumbnail(props.videoUrl) || '/placeholder-image.jpg'});
  background-size: cover;
  background-position: center;
  /* margin-bottom removed as it's handled by parent or specific classes */
  /* border-radius removed, handled by specific classes if needed */
  overflow: hidden;
  /* box-shadow removed, handled by specific classes if needed */
  /* transition removed, handled by specific classes if needed */
  
  /* The general play icon (::after) might conflict with more specific ones, 
     so it's better to style play icons within .video-thumbnail-main and .video-thumbnail-list directly if needed,
     or ensure this one is generic enough or removed if not used. */
  /* For example, if .play-icon-overlay is used for main video, this general one might not be needed */
  /* &::after { ... } */ 

  /* Ensure specific class styles for height/width override this if needed */
  &.video-thumbnail-main {
    height: 400px; /* Ensure this matches MainVideoWrapper's expectation */
    border-radius: 0;
  }

  &.video-thumbnail-list {
    width: 120px;
    height: 68px;
    border-radius: 0;
  }
`;

// Add a wrapper for the play icon on the main video if not already present in JSX
// This is an alternative to the .play-icon-overlay class if you prefer a component approach
// const MainVideoPlayIcon = styled(PlayCircleOutlineIcon)`
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   font-size: 70px !important; /* Use !important if MUI styles are too strong */
//   color: rgba(255, 255, 255, 0.85);
//   text-shadow: 0 0 15px rgba(0,0,0,0.5);
//   pointer-events: none;
// `;



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

// Add search-related styled components
const SearchContainer = styled(Box)`
  padding: 20px 0;
  animation: fadeIn 0.5s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const SearchHeader = styled(Box)`
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SearchResultsContainer = styled(Box)`
  margin-top: 24px;
`;

const NoResultsContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  margin-top: 24px;
  background-color: #f9f9f9;
  border-radius: 12px;
  
  svg {
    font-size: 48px;
    color: #2b6da8;
    opacity: 0.7;
    margin-bottom: 16px;
  }
`;

const ResultCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.12);
  }
`;

const ResultMedia = styled(CardMedia)`
  height: 180px;
  background-size: cover;
  background-position: center;
`;

const ResultContent = styled(CardContent)`
  flex-grow: 1;
  padding: 16px;
  
  h2 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #2b6da8;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .date {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 4px;
  }
  
  .category {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 10px;
  }
`;

const ContentTypeChip = styled(Chip)`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 0.75rem;
  font-weight: 500;
`;


const HeroLatestNewsItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Dummy data embedded due to directory creation issues
const dummyPremiumArticles = [
  {
    _id: 'prem1',
    title: 'As U.S. pauses new visa interviews, why international students matter | Data',
    author: 'SAMBAVI PARTHASARATHY',
    category: 'Premium',
    authorImage: null,
  },
  {
    _id: 'prem2',
    title: 'Has the environmental crisis in India exacerbated? | Explained',
    author: 'TIKENDER SINGH PANWAR',
    category: 'Premium',
    authorImage: null,
  },
  {
    _id: 'prem3',
    title: 'The unsung heroes in RCB’s rise to the summit',
    author: 'R. KAUSHIK',
    category: 'Premium',
    authorImage: null,
  },
  {
    _id: 'prem4',
    title: 'Circling back to Rajiv Gandhi’s assassination, a traumatic moment in Madras’ history',
    author: 'K.C. VIJAYA KUMAR',
    category: 'Premium',
    authorImage: 'https://via.placeholder.com/32/007bff/ffffff?Text=KC', // Placeholder author image (32x32)
  },
  {
    _id: 'prem5',
    title: 'News Analysis: Modi likely to attend BRICS summit in Brazil; meet closely watched by U.S.',
    author: 'SUHASINI HAIDAR',
    category: 'Premium',
    authorImage: 'https://via.placeholder.com/32/d32f2f/ffffff?Text=SH', // Placeholder author image (32x32)
  },
];

const shortsData = [
  {
    id: 's1',
    image: 'https://picsum.photos/seed/short1/200/320',
    caption: 'Watch: Was the Karnataka government not aware that lakhs of people would come?: State BJP chief',
  },
  {
    id: 's2',
    image: 'https://picsum.photos/seed/short2/200/320',
    caption: 'Watch: We did not expect a crowd of 3-4 lakh: Siddaramaiah on Bengaluru stampede',
  },
  {
    id: 's3',
    image: 'https://picsum.photos/seed/short3/200/320',
    caption: 'Watch: ‘The crowd was uncontrollable’: D.K. Shivakumar on Bengaluru stampede',
  },
  {
    id: 's4',
    image: 'https://picsum.photos/seed/short4/200/320',
    caption: 'Watch: Sicily’s Mount Etna erupts',
  },
  {
    id: 's5',
    image: 'https://picsum.photos/seed/short5/200/320',
    caption: 'Watch: Sloth bear falls into 40 feet well, rescued',
  },
  {
    id: 's6',
    image: 'https://picsum.photos/seed/newshort6/200/320',
    caption: 'Watch: New advancements in renewable energy sources',
  },
];

const HomePage = () => {
  const explainsSectionData = {
    mainArticle: { id: 'e1', image: 'https://picsum.photos/seed/envCrisis/500/350', title: 'Has the environmental crisis in India exacerbated? | Explained', author: 'TIKENDER SINGH PANWAR' },
    middleArticles: [
      { id: 'e2', title: 'What would a French nuclear umbrella mean for Europe? | Explained', author: 'FRANCISZEK SNARSKI' },
      { id: 'e3', title: 'How do military standoffs affect aviation? | Explained', author: 'MURALI N. KRISHNASWAMY' },
    ],
    rightArticles: [
      { id: 'e4', image: 'https://picsum.photos/seed/rbiGold/300/200', title: 'Why is the RBI changing gold loan rules? | Explained', author: 'LALATENDU MISHRA' },
      { id: 'e5', image: 'https://picsum.photos/seed/gazaCeasefire/300/200', title: 'Will there be a lasting ceasefire in Gaza? | Explained', author: 'STANLY JOHNY' },
    ],
  };
  const query = useQuery();
  const searchQuery = query.get('search') || '';
  const navigate = useNavigate();
  
  const [topPicksArticles, setTopPicksArticles] = useState([]);
  const [premiumArticles, setPremiumArticles] = useState([]); // This will be populated by API, dummy data used for now for styling
  const [mainHeroArticle, setMainHeroArticle] = useState(null);
  const [latestNewsArticlesColumn, setLatestNewsArticlesColumn] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search related states
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState({ articles: [], galleries: [], videos: [] });
  const [searchCounts, setSearchCounts] = useState({ articles: 0, galleries: 0, videos: 0, total: 0 });
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  const fetchSearchResults = useCallback(async (query) => {
    if (!query.trim()) {
      setIsSearching(false);
      return;
    }
    
    setSearchLoading(true);
    setSearchError(null);
    setIsSearching(true);
    
    try {
      const response = await searchContent(query);
      setSearchResults(response.data.results);
      setSearchCounts(response.data.counts);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('An error occurred while searching. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  }, []);
  
  // Handle URL search parameter
  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery, fetchSearchResults]);
  
  // Listen for custom search event from Header
  useEffect(() => {
    const handlePerformSearch = (event) => {
      fetchSearchResults(event.detail.query);
    };
    
    window.addEventListener('performSearch', handlePerformSearch);
    
    return () => {
      window.removeEventListener('performSearch', handlePerformSearch);
    };
  }, [fetchSearchResults]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch latest articles - sorted by most recently updated/created
        const articlesRes = await fetchArticles({ limit: 15, sort: '-updatedAt' });
        const articlesData = articlesRes.data.articles;
        
        // Fetch galleries
        const galleriesRes = await fetchGalleries({ limit: 4 });
        const galleriesData = galleriesRes.data.galleries;
        
        // Fetch videos
        const videosRes = await fetchVideos({ limit: 3 });
        const videosData = videosRes.data.videos;
        
        setTopPicksArticles(articlesData.filter(a => a.tags?.includes('top pick') || a.isTopPick).slice(0, 5));
        setGalleries(galleriesData.slice(0, 6));
        setVideos(videosData.slice(0, 4));

        // Prepare data for the new three-column hero
        const mainArticle = articlesData.find(a => a.isFeaturedHero) || articlesData[0];
        setMainHeroArticle(mainArticle);

        const premium = articlesData.filter(a => (a.category?.toLowerCase() === 'premium' || a.tags?.includes('premium')) && a._id !== mainArticle?._id).slice(0, 5);
        setPremiumArticles(premium);

        const latestNews = articlesData.filter(a => a._id !== mainArticle?._id && !premium.find(p => p._id === a._id)).slice(0, 6);
        setLatestNewsArticlesColumn(latestNews);
        
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
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleSearch = (newQuery) => {
    fetchSearchResults(newQuery);
  };
  
  const clearSearch = () => {
    setIsSearching(false);
    // Update URL without search parameter without page reload
    const newUrl = window.location.pathname;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  // Search result rendering functions
  const renderArticles = () => {
    if (searchResults.articles.length === 0) {
      return (
        <NoResultsContainer>
          <SearchOffIcon />
          <Typography variant="h6" color="primary">No articles found</Typography>
          <Typography variant="body2" color="textSecondary">
            We couldn't find any articles matching "{searchQuery}"
          </Typography>
        </NoResultsContainer>
      );
    }

    return (
      <Grid container spacing={3}>
        {searchResults.articles.map((article) => (
          <Grid item xs={12} sm={6} md={4} key={article._id}>
            <ResultCard>
              <CardActionArea onClick={() => navigate(`/article/${article.slug}`)}>
                {article.image && (
                  <ResultMedia
                    image={article.image}
                    title={article.title}
                  />
                )}
                <ContentTypeChip
                  label="Article"
                  size="small"
                  color="primary"
                  icon={<ArticleIcon fontSize="small" />}
                />
                <ResultContent>
                  <Typography variant="h6" component="h2">{article.title}</Typography>
                  <div className="category">
                    <CategoryIcon fontSize="small" />
                    {article.category}
                  </div>
                  <div className="date">
                    <CalendarTodayIcon fontSize="small" />
                    {new Date(article.createdAt).toLocaleDateString()}
                  </div>
                  {article.tags && article.tags.length > 0 && (
                    <Box mt={1} display="flex" gap={0.5} flexWrap="wrap">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          size="small" 
                          variant="outlined" 
                          sx={{ marginRight: 0.5, marginBottom: 0.5 }}
                        />
                      ))}
                    </Box>
                  )}
                </ResultContent>
              </CardActionArea>
            </ResultCard>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderGalleries = () => {
    if (searchResults.galleries.length === 0) {
      return (
        <NoResultsContainer>
          <SearchOffIcon />
          <Typography variant="h6" color="primary">No galleries found</Typography>
          <Typography variant="body2" color="textSecondary">
            We couldn't find any galleries matching "{searchQuery}"
          </Typography>
        </NoResultsContainer>
      );
    }

    return (
      <Grid container spacing={3}>
        {searchResults.galleries.map((gallery) => (
          <Grid item xs={12} sm={6} md={4} key={gallery._id}>
            <ResultCard>
              <CardActionArea onClick={() => navigate(`/gallery/${gallery._id}`)}>
                {gallery.images && gallery.images.length > 0 && (
                  <ResultMedia
                    image={gallery.images[0].url}
                    title={gallery.title}
                  />
                )}
                <ContentTypeChip
                  label="Gallery"
                  size="small"
                  color="success"
                  icon={<PhotoLibraryIcon fontSize="small" />}
                />
                <ResultContent>
                  <Typography variant="h6" component="h2">{gallery.title}</Typography>
                  <div className="date">
                    <CalendarTodayIcon fontSize="small" />
                    {new Date(gallery.createdAt).toLocaleDateString()}
                  </div>
                  <Box mt={1}>
                    <Chip 
                      label={`${gallery.images.length} images`} 
                      size="small" 
                      variant="outlined" 
                      icon={<PhotoLibraryIcon fontSize="small" />}
                    />
                  </Box>
                </ResultContent>
              </CardActionArea>
            </ResultCard>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderVideos = () => {
    if (searchResults.videos.length === 0) {
      return (
        <NoResultsContainer>
          <SearchOffIcon />
          <Typography variant="h6" color="primary">No videos found</Typography>
          <Typography variant="body2" color="textSecondary">
            We couldn't find any videos matching "{searchQuery}"
          </Typography>
        </NoResultsContainer>
      );
    }

    return (
      <Grid container spacing={3}>
        {searchResults.videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video._id}>
            <ResultCard>
              <CardActionArea onClick={() => navigate(`/video/${video._id}`)}>
                {video.thumbnail && (
                  <ResultMedia
                    image={video.thumbnail}
                    title={video.title}
                  />
                )}
                <ContentTypeChip
                  label="Video"
                  size="small"
                  color="error"
                  icon={<VideoLibraryIcon fontSize="small" />}
                />
                <ResultContent>
                  <Typography variant="h6" component="h2">{video.title}</Typography>
                  <div className="date">
                    <CalendarTodayIcon fontSize="small" />
                    {new Date(video.createdAt).toLocaleDateString()}
                  </div>
                  <Typography variant="body2" color="textSecondary" sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mt: 1
                  }}>
                    {video.description}
                  </Typography>
                </ResultContent>
              </CardActionArea>
            </ResultCard>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderAll = () => {
    if (searchCounts.total === 0 && !searchLoading) {
      return (
        <NoResultsContainer>
          <SearchOffIcon />
          <Typography variant="h6" color="primary">No results found</Typography>
          <Typography variant="body2" color="textSecondary">
            We couldn't find any content matching "{searchQuery}"
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={clearSearch}
          >
            Show All Content
          </Button>
        </NoResultsContainer>
      );
    }

    // Combine all results
    const allResults = [
      ...searchResults.articles.map(item => ({ ...item, type: 'article' })),
      ...searchResults.galleries.map(item => ({ ...item, type: 'gallery' })),
      ...searchResults.videos.map(item => ({ ...item, type: 'video' }))
    ];

    // Sort by creation date (newest first)
    allResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
      <Grid container spacing={3}>
        {allResults.map((item) => {
          let mediaUrl = '';
          let chipColor = 'primary';
          let chipIcon = <ArticleIcon fontSize="small" />;
          let chipLabel = 'Article';
          let linkUrl = '';

          if (item.type === 'article') {
            mediaUrl = item.image || '';
            chipColor = 'primary';
            chipIcon = <ArticleIcon fontSize="small" />;
            chipLabel = 'Article';
            linkUrl = `/article/${item.slug}`;
          } else if (item.type === 'gallery') {
            mediaUrl = item.images && item.images.length > 0 ? item.images[0].url : '';
            chipColor = 'success';
            chipIcon = <PhotoLibraryIcon fontSize="small" />;
            chipLabel = 'Gallery';
            linkUrl = `/gallery/${item._id}`;
          } else if (item.type === 'video') {
            mediaUrl = item.thumbnail || '';
            chipColor = 'error';
            chipIcon = <VideoLibraryIcon fontSize="small" />;
            chipLabel = 'Video';
            linkUrl = `/video/${item._id}`;
          }

          return (
            <Grid item xs={12} sm={6} md={4} key={`${item.type}-${item._id}`}>
              <ResultCard>
                <CardActionArea onClick={() => navigate(linkUrl)}>
                  {mediaUrl && (
                    <ResultMedia
                      image={mediaUrl}
                      title={item.title}
                    />
                  )}
                  <ContentTypeChip
                    label={chipLabel}
                    size="small"
                    color={chipColor}
                    icon={chipIcon}
                  />
                  <ResultContent>
                    <Typography variant="h6" component="h2">{item.title}</Typography>
                    {item.category && (
                      <div className="category">
                        <CategoryIcon fontSize="small" />
                        {item.category}
                      </div>
                    )}
                    <div className="date">
                      <CalendarTodayIcon fontSize="small" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </ResultContent>
                </CardActionArea>
              </ResultCard>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <HomeContainer>
      <Header />
      <MainContent>
        {isSearching ? (
          <SearchContainer>
            <SearchHeader>
              <Typography variant="h4" component="h1" gutterBottom>
                Search Results
              </Typography>
              <SearchBar 
                initialQuery={searchQuery} 
                onSearch={handleSearch}
              />
              {!searchLoading && searchCounts.total > 0 && (
                <Typography variant="body2" color="textSecondary">
                  Found {searchCounts.total} results for "{searchQuery}"
                </Typography>
              )}
              <Button 
                variant="outlined" 
                color="primary"
                onClick={clearSearch}
                sx={{ alignSelf: 'flex-start' }}
              >
                Show All Content
              </Button>
            </SearchHeader>
            
            <Divider />
            
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="search results tabs"
            >
              <Tab 
                label={`All (${searchCounts.total})`} 
                icon={<SearchIcon />} 
                iconPosition="start"
              />
              <Tab 
                label={`Articles (${searchCounts.articles})`} 
                icon={<ArticleIcon />} 
                iconPosition="start"
              />
              <Tab 
                label={`Galleries (${searchCounts.galleries})`} 
                icon={<PhotoLibraryIcon />} 
                iconPosition="start"
              />
              <Tab 
                label={`Videos (${searchCounts.videos})`} 
                icon={<VideoLibraryIcon />} 
                iconPosition="start"
              />
            </Tabs>
            
            <SearchResultsContainer>
              {searchLoading ? (
                <Box display="flex" justifyContent="center" p={4}>
                  <CircularProgress />
                </Box>
              ) : searchError ? (
                <Box textAlign="center" p={4}>
                  <Typography color="error">{searchError}</Typography>
                </Box>
              ) : (
                <>
                  {activeTab === 0 && renderAll()}
                  {activeTab === 1 && renderArticles()}
                  {activeTab === 2 && renderGalleries()}
                  {activeTab === 3 && renderVideos()}
                </>
              )}
            </SearchResultsContainer>
          </SearchContainer>
        ) : (
          <>
            {/* New Top Advertisement Banner */}
            <TopAdContainer>
              <AdBanner variant="leaderboard" />
            </TopAdContainer>

            {/* New Three-Column Hero Section */}
            <ThreeColumnHeroLayout>
              {/* Premium Column (Left) */}
              <HeroColumn>
                <ColumnTitle>Premium</ColumnTitle>
                <SideArticleList>
                  {dummyPremiumArticles.length > 0 ? dummyPremiumArticles.slice(0, 5).map((article, index) => (
                    <PremiumArticleItem key={article._id}>
                      <div className="content">
                        <Link to={`/article/${article._id}`} className="title">{article.title}</Link>
                        {article.author && <p className="author">
                          <PersonIcon style={{ fontSize: 14, marginRight: 5 }} />
                          {article.author}
                        </p>}
                      </div>
                      {article.authorImage && index < 3 && <img src={article.authorImage} alt={article.author} className="author-image" />}
                    </PremiumArticleItem>
                  )) : <p>No premium articles available.</p>}
                </SideArticleList>
              </HeroColumn>

              {/* Main Article Column (Middle) */}
              <HeroColumn>
                {mainHeroArticle && (
                  <MainArticleWrapper>
                    {/* This is where the main hero article card should be */}
                    <ArticleCard article={mainHeroArticle} variant="topPick" showImage={true} showExcerpt={true} />
                  </MainArticleWrapper>
                )}
              </HeroColumn>

              {/* Right Column: Latest News (Timeline Design) */}
              <HeroColumn>
                <ColumnTitle>LATEST NEWS</ColumnTitle>
                <SideArticleList>
                  {latestNewsArticlesColumn && latestNewsArticlesColumn.length > 0 ? latestNewsArticlesColumn.slice(0, 4).map(article => (
                    <LatestNewsItem key={article._id}>
                      <NewsMeta>
                        {article.publishedAt && formatDistanceToNow(parseISO(article.publishedAt), { addSuffix: true })}
                        {article.category && typeof article.category === 'string' && (
                          <> - <span className="category">{article.category}</span></>
                        )}
                        {/* Check if category is an object (like from directus) or string */}
                        {article.category && typeof article.category === 'object' && article.category.name && (
                          <> - <span className="category">{article.category.name}</span></>
                        )}
                      </NewsMeta>
                      <NewsTitle>
                        <Link to={`/article/${article.slug}`}>{article.title}</Link>
                      </NewsTitle>
                    </LatestNewsItem>
                  )) : <p>No latest news available.</p>}
                </SideArticleList>
              </HeroColumn>
            </ThreeColumnHeroLayout>

            {/* The AdBanner previously at line 1399 was part of the broken edit and is now removed. */}
            {/* The main TopAdContainer at line 1372 handles the top leaderboard ad. */}

            {/* Latest News Section */}
            <SectionTitle>
              <UpdateIcon className="title-icon" />
              Latest News
            </SectionTitle>
            <NewsGrid>
              {latestNewsArticlesColumn.slice(0, 6).map(article => {
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
                    variant="default"
                    showExcerpt={true}
                  />
                );
              })}
            </NewsGrid>

            {/* Mid-Page Billboard Ad - Repositioned or adjust as per thehindu.com */}
            <AdBanner variant="billboard" />

            {/* Opinion Section - Full Width */}
            <SectionContainer>
              <SectionTitle>
                <span><ArticleIcon className="title-icon" /> Opinion</span>
                <Link to="/category/opinion" className="see-more-link">See More →</Link>
              </SectionTitle>
              <NewsGrid style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}> {/* Ensure 3 columns */}
                {latestNewsArticlesColumn
                  .filter(article => article.category?.toLowerCase() === 'opinion')
                  .slice(0, 3) // Show 3 articles for this layout
                  .map(article => (
                    <ArticleCard key={article._id} article={article} variant="default" showImage={true} showExcerpt={true} />
                  ))}
              </NewsGrid>
            </SectionContainer>

            {/* Old 'Media Center Explains' section removed. The new one is rendered after TopPicksCarousel. */}

            {/* Ad Banner */}
            <AdBanner variant="mediumRectangle" /> 

            {/* New Top Videos Section */}
            {videos.length > 0 && (
              <TopVideosContainer>
                <SectionTitle className="section-title-videos">
                  {/* The ::before pseudo-element on the span will create the TH-style icon and text will be just 'Top Videos' */}
                  <span>Top Videos</span>
                  <Link to="/videos" className="view-all-videos-link">View All</Link>
                </SectionTitle>
                <TopVideosLayout>
                  <MainVideoWrapper onClick={() => navigate(`/video/${videos[0]._id}`)}>
                    <VideoThumbnail 
                      className="video-thumbnail-main" 
                      image={videos[0].thumbnail} 
                      videoUrl={videos[0].videoUrl}
                    />
                    <div className="play-icon-overlay"></div> {/* Added play icon overlay div */}
                    <VideoTitle className="video-title-main">{videos[0].title}</VideoTitle>
                  </MainVideoWrapper>
                  <VideoListWrapper>
                    {videos.slice(1, 4).map(video => (
                      <VideoListItemStyled key={video._id} onClick={() => navigate(`/video/${video._id}`)}>
                        <VideoThumbnail 
                          className="video-thumbnail-list" 
                          image={video.thumbnail} 
                          videoUrl={video.videoUrl} 
                        />
                        <VideoTitle className="video-title-list">{video.title}</VideoTitle>
                      </VideoListItemStyled>
                    ))}
                  </VideoListWrapper>
                </TopVideosLayout>
              </TopVideosContainer>
            )}

            {/* Old Video Section has been removed and replaced by the new TopVideosContainer. */}

            {/* Top Picks Carousel Section */}
            <TopPicksCarousel />

            {/* Media Center Explains Section */}
            <ExplainsWrapper>
              <ExplainsHeader>
                <ExplainsTitle>The Media Center Explains</ExplainsTitle>
                <ExplainsPremiumBadge>MC PREMIUM</ExplainsPremiumBadge>
              </ExplainsHeader>
              <ExplainsContentGrid>
                {/* Main Article (Left) */}
                <ExplainsMainArticle as={Link} to={`/article/${explainsSectionData.mainArticle.id}`}>
                  <ExplainsArticleImage src={explainsSectionData.mainArticle.image} alt={explainsSectionData.mainArticle.title} />
                  <ExplainsArticleTitle size="main">
                    {explainsSectionData.mainArticle.title}
                  </ExplainsArticleTitle>
                  <ExplainsArticleAuthor>{explainsSectionData.mainArticle.author}</ExplainsArticleAuthor>
                </ExplainsMainArticle>

                {/* Middle Column (Text Articles) */}
                <ExplainsMiddleColumn>
                  {explainsSectionData.middleArticles.map(article => (
                    <ExplainsMiddleArticle key={article.id} as={Link} to={`/article/${article.id}`}>
                      <ExplainsArticleTitle size="sub">{article.title}</ExplainsArticleTitle>
                      <ExplainsArticleTitle>{article.title}</ExplainsArticleTitle>
                      <ExplainsArticleAuthor>{article.author}</ExplainsArticleAuthor>
                    </ExplainsMiddleArticle>
                  ))}
                </ExplainsMiddleColumn>

                {/* Right Column (Image Articles) */}
                <ExplainsRightColumn>
                  {explainsSectionData.rightArticles.map(article => (
                    <ExplainsRightArticle key={article.id} as={Link} to={`/article/${article.id}`}>
                      <ExplainsArticleImage src={article.image} alt={article.title} />
                      <ExplainsArticleTitle size="sub">{article.title}</ExplainsArticleTitle>
                      <ExplainsArticleAuthor>{article.author}</ExplainsArticleAuthor>
                    </ExplainsRightArticle>
                  ))}
                </ExplainsRightColumn>
              </ExplainsContentGrid>
              <ExplainsSeeMoreLink to="/explains">
                See More <ArrowForwardIcon />
              </ExplainsSeeMoreLink>
            </ExplainsWrapper>

            {/* Shorts Section */}
            <ShortsWrapper>
              <ShortsHeader>
                <ShortsTitleLogo>MC</ShortsTitleLogo>
                <ShortsTitleText>Shorts</ShortsTitleText>
              </ShortsHeader>
              <ShortsGrid>
                {shortsData.map(short => (
                  <ShortCard key={short.id} to={`/short/${short.id}`}>
                    <ShortCardImageContainer>
                      <ShortCardImage src={short.image} alt={short.caption} />
                      <ShortCardReelIcon>
                        <SmartDisplayOutlinedIcon />
                      </ShortCardReelIcon>
                    </ShortCardImageContainer>
                    <ShortCardCaption>{short.caption}</ShortCardCaption>
                  </ShortCard>
                ))}
              </ShortsGrid>
              <ShortsSeeMoreLink to="/shorts">
                SEE MORE <ArrowForwardIcon style={{ marginLeft: '5px', fontSize: '16px' }} />
              </ShortsSeeMoreLink>
            </ShortsWrapper>


            {/* Gallery Section */}
            <SectionContainer>
              <SectionTitle>
                <span><PhotoLibraryIcon className="title-icon" /> Photo Galleries</span>
                <Link to="/galleries" className="see-more-link">View All →</Link>
              </SectionTitle>
              <GalleryGrid style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}> {/* Show 4 galleries per row */}
                {galleries.slice(0, 4).map(gallery => (
                  <GalleryItem 
                    key={gallery._id}
                    image={gallery.images[0]?.url}
                    onClick={() => navigate(`/gallery/${gallery._id}`)}
                  >
                    <GalleryTitle>{gallery.title}</GalleryTitle>
                  </GalleryItem>
                ))}
              </GalleryGrid>
            </SectionContainer>

            {/* Business Section */}
            <SectionContainer>
              <SectionTitle>
                <span><CategoryIcon className="title-icon" /> Business</span>
                <Link to="/category/business" className="see-more-link">See More →</Link>
              </SectionTitle>
              <NewsGrid style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {latestNewsArticlesColumn
                  .filter(article => article.category?.toLowerCase() === 'business')
                  .slice(0, 3)
                  .map(article => (
                    <ArticleCard key={article._id} article={article} variant="default" showImage={true} showExcerpt={true} />
                  ))}
              </NewsGrid>
            </SectionContainer>

            {/* Bottom Leaderboard Ad */}
            <AdBanner variant="leaderboard" />
          </>
        )}
      </MainContent>
      <Footer />
    </HomeContainer>
  );
};

export default HomePage;
