import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Material UI imports
import { 
  Typography, 
  Box, 
  Container, 
  Grid, 
  Divider,
  IconButton
} from '@mui/material';

// Icons
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import RssFeedIcon from '@mui/icons-material/RssFeed';

const FooterContainer = styled.footer`
  background-color: #0f2b48;
  color: white;
  padding: 0 0 40px; // Adjusted top padding to 0
  margin-top: 60px;
  position: relative; // Keep for other potential uses
`;

const FooterContent = styled(Container)`
  && {
    padding-top: 30px; 
    padding-bottom: 20px;
  }
`;

const FooterSection = styled(Box)`
  margin-bottom: 30px;
`;

const SectionTitle = styled(Typography)`
  font-family: 'Noto Serif', serif;
  font-size: 18px;
  margin-bottom: 20px;
  font-weight: 600;
  color: white;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 50px;
    height: 3px;
    background-color: var(--primary-color);
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    margin-bottom: 12px;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: translateX(5px);
    }
    
    a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-size: 15px;
      font-family: 'Open Sans', sans-serif;
      font-weight: 400;
      transition: all 0.3s ease;
      display: block;
      position: relative;
      padding-left: 15px;
      
      &:before {
        content: '›';
        position: absolute;
        left: 0;
        top: 0;
        color: var(--primary-light);
        font-size: 18px;
        line-height: 1;
      }
      
      &:hover {
        color: white;
      }
    }
  }
`;

const FooterBottom = styled(Box)`
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Open Sans', sans-serif;
`;

const SocialIconsContainer = styled(Box)`
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
`;

const SocialIcon = styled(IconButton)`
  &.MuiIconButton-root {
    color: rgba(255, 255, 255, 0.7);
    margin: 5px 8px;
    transition: all 0.3s ease;
    
    &:hover {
      color: white;
      background-color: var(--primary-color);
      transform: translateY(-3px);
    }
  }
`;

const FooterLogo = styled(Typography)`
  font-family: 'Noto Serif', serif;
  font-size: 76px !important; /* Increased font size with !important */
  font-weight: 700;
  line-height: 1.2 !important; /* Explicit line-height */
  margin-bottom: 20px;
  color: white;
  text-align: center;
  
  /* Comprehensive Resets */
  border: none !important;
  border-image: none !important;
  outline: none !important;
  text-decoration: none !important;
  text-decoration-line: none !important;
  text-decoration-style: solid !important;
  text-decoration-color: transparent !important;
  box-shadow: none !important;
  background: none !important;
  text-shadow: none !important;
  
  display: block !important;
  position: relative; 

  &::before,
  &::after {
    content: '' !important;
    display: none !important;
    background: none !important;
    border: none !important;
  }
  
  span.logo-highlight { /* "Center" text */
    color: var(--primary-light);
    display: inline-block; 
    position: relative;
    vertical-align: baseline !important; /* Added */
    text-decoration: none !important;
    text-decoration-line: none !important;
    text-decoration-color: transparent !important;
    border: none !important;
    border-image: none !important; /* Added explicitly */
    outline: none !important;
    box-shadow: none !important;
    background: none !important;
    text-shadow: none !important;

    &::before,
    &::after {
      content: '' !important;
      display: none !important;
      background: none !important;
      border: none !important;
    }
  }
`;

const FooterTagline = styled(Typography)`
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  margin-bottom: 25px;
  color: rgba(255, 255, 255, 0.8);
  max-width: 70%;
  line-height: 1.6;
  text-align: center;
  border-top: none !important; // Ensure no top border
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <Box 
        sx={{
          width: '100%',
          height: '5px',
          background: 'linear-gradient(to right, var(--primary-dark), var(--primary-color), var(--primary-light))',
          marginBottom: '15px', // Create space below the line
        }}
      />
      <FooterContent maxWidth="lg">
        <Box mb={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FooterLogo> {/* variant="h1" removed */}
            Media <span className="logo-highlight">Center</span>
          </FooterLogo>
          <FooterTagline>
            Your trusted source for news, analysis, and multimedia content. Delivering quality journalism with integrity and accuracy.
          </FooterTagline>
          <SocialIconsContainer>
            <SocialIcon aria-label="Facebook">
              <FacebookIcon />
            </SocialIcon>
            <SocialIcon aria-label="Twitter">
              <TwitterIcon />
            </SocialIcon>
            <SocialIcon aria-label="Instagram">
              <InstagramIcon />
            </SocialIcon>
            <SocialIcon aria-label="YouTube">
              <YouTubeIcon />
            </SocialIcon>
            <SocialIcon aria-label="LinkedIn">
              <LinkedInIcon />
            </SocialIcon>
            <SocialIcon aria-label="RSS Feed">
              <RssFeedIcon />
            </SocialIcon>
          </SocialIconsContainer>
        </Box>
        
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <FooterSection>
              <SectionTitle variant="h6">About Us</SectionTitle>
              <FooterLinks>
                <li><Link to="/about">About Media Center</Link></li>
                <li><Link to="/terms">Terms of Use</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </FooterLinks>
            </FooterSection>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FooterSection>
              <SectionTitle variant="h6">Categories</SectionTitle>
              <FooterLinks>
                <li><Link to="/category/news">News</Link></li>
                <li><Link to="/category/opinion">Opinion</Link></li>
                <li><Link to="/category/business">Business</Link></li>
                <li><Link to="/category/sport">Sport</Link></li>
                <li><Link to="/category/entertainment">Entertainment</Link></li>
              </FooterLinks>
            </FooterSection>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FooterSection>
              <SectionTitle variant="h6">More Categories</SectionTitle>
              <FooterLinks>
                <li><Link to="/category/technology">Technology</Link></li>
                <li><Link to="/category/lifestyle">Lifestyle</Link></li>
                <li><Link to="/category/science">Science</Link></li>
                <li><Link to="/category/health">Health</Link></li>
              </FooterLinks>
            </FooterSection>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FooterSection>
              <SectionTitle variant="h6">Media</SectionTitle>
              <FooterLinks>
                <li><Link to="/galleries">Photo Galleries</Link></li>
                <li><Link to="/videos">Videos</Link></li>
                <li><Link to="/podcasts">Podcasts</Link></li>
                <li><Link to="/subscribe">Subscribe</Link></li>
              </FooterLinks>
            </FooterSection>
          </Grid>
        </Grid>
      </FooterContent>
      
      <FooterBottom>
        <Typography variant="body2" component="p" gutterBottom>
          &copy; {currentYear} Media Center. All Rights Reserved.
        </Typography>
        <Typography variant="caption" component="p" sx={{ mt: 1, opacity: 0.7 }}>
          Designed with TheHindu.com aesthetic
        </Typography>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
