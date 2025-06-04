import React, { useState } from 'react';
import styled from 'styled-components';
import AdminLayout from './components/AdminLayout';
import { 
  Paper, 
  Tabs, 
  Tab, 
  Typography, 
  Divider,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ApiIcon from '@mui/icons-material/Api';
import HelpIcon from '@mui/icons-material/Help';
import CodeIcon from '@mui/icons-material/Code';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ReactMarkdown from 'react-markdown';

// Styled components
const DocsContainer = styled(Paper)`
  padding: 30px;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  margin-bottom: 30px;
  background-color: white;
`;

const TabContainer = styled.div`
  margin-top: 30px;
`;

const DocsTitle = styled(Typography)`
  font-family: 'Noto Serif', serif;
  font-weight: 600;
  margin-bottom: 10px;
  position: relative;
  display: inline-block;
  padding-bottom: 10px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    width: 60px;
    background-color: var(--primary-color);
  }
`;

const DocsSubtitle = styled(Typography)`
  margin-top: 30px;
  margin-bottom: 15px;
  font-weight: 600;
  color: var(--text-dark);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
`;

const MarkdownContainer = styled.div`
  line-height: 1.7;
  font-size: 16px;
  
  h1, h2, h3, h4 {
    margin-top: 25px;
    margin-bottom: 15px;
    font-weight: 600;
  }
  
  h1 {
    font-size: 24px;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 8px;
  }
  
  h2 {
    font-size: 20px;
  }
  
  h3 {
    font-size: 18px;
  }
  
  p {
    margin-bottom: 16px;
  }
  
  pre {
    background-color: #f5f5f5;
    padding: 12px;
    border-radius: 6px;
    overflow: auto;
    margin-bottom: 16px;
  }
  
  code {
    font-family: 'Consolas', monospace;
    background-color: #f5f5f5;
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 0.9em;
  }
  
  ul, ol {
    padding-left: 25px;
    margin-bottom: 16px;
    
    li {
      margin-bottom: 8px;
    }
  }
  
  blockquote {
    border-left: 4px solid var(--primary-color);
    padding-left: 16px;
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 16px;
    color: #555;
    font-style: italic;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 16px;
    
    th, td {
      border: 1px solid #ddd;
      padding: 8px 12px;
      text-align: left;
    }
    
    th {
      background-color: #f5f5f5;
    }
    
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
  }
`;

const EndpointCard = styled(Box)`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid var(--primary-color);
`;

const EndpointTitle = styled(Typography)`
  display: flex;
  align-items: center;
  font-weight: 600;
  margin-bottom: 10px;
  
  .method {
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 14px;
    margin-right: 10px;
    color: white;
    font-weight: 600;
    
    &.get {
      background-color: #2e7d32;
    }
    
    &.post {
      background-color: #0288d1;
    }
    
    &.put, &.patch {
      background-color: #ed6c02;
    }
    
    &.delete {
      background-color: #d32f2f;
    }
  }
`;

const TipCard = styled(Box)`
  background-color: rgba(124, 77, 255, 0.1);
  padding: 20px;
  border-radius: 8px;
  margin: 25px 0;
  display: flex;
  align-items: flex-start;
  
  svg {
    color: #7c4dff;
    margin-right: 15px;
    font-size: 24px;
  }
`;

// Actual API documentation based on codebase analysis
const apiDocsMarkdown = `
# Media Center API Documentation

This document provides details about the Media Center API endpoints, parameters, and response formats based on the actual implementation.

## Authentication

Authentication is handled via JWT tokens. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer <your_token_here>
\`\`\`

## Base URL

All API requests should be prefixed with:

\`\`\`
/api
\`\`\`

## Endpoints

### Articles

#### Get All Articles

\`\`\`
GET /articles
\`\`\`

**Query Parameters:**
- \`page\` (optional): Page number for pagination (default: 1)
- \`limit\` (optional): Number of items per page (default: 10)
- \`category\` (optional): Filter by category
- \`tag\` (optional): Filter by tag

**Response:**
\`\`\`json
{
  "articles": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Article Title",
      "slug": "article-title",
      "content": "HTML content of the article",
      "author": "Author Name",
      "category": "news",
      "tags": ["tag1", "tag2"],
      "image": "https://example.com/image.jpg",
      "image_public_id": "media-center/abc123",
      "video": "https://example.com/video.mp4",
      "video_public_id": "media-center/xyz789",
      "createdAt": "2023-06-22T10:30:00.000Z",
      "updatedAt": "2023-06-22T10:30:00.000Z"
    },
    // More articles...
  ],
  "pagination": {
    "total": 20,
    "page": 1,
    "pages": 2
  }
}
\`\`\`

#### Get Article by ID (Admin Only)

\`\`\`
GET /articles/id/:id
\`\`\`

**Response:**
\`\`\`json
{
  "_id": "60d21b4667d0d8992e610c85",
  "title": "Article Title",
  "slug": "article-title",
  "content": "HTML content of the article",
  "rawContent": "Raw Draft.js content for the editor",
  "author": "Author Name",
  "category": "news",
  "tags": ["tag1", "tag2"],
  "image": "https://example.com/image.jpg",
  "image_public_id": "media-center/abc123",
  "video": "https://example.com/video.mp4",
  "video_public_id": "media-center/xyz789",
  "createdAt": "2023-06-22T10:30:00.000Z",
  "updatedAt": "2023-06-22T10:30:00.000Z"
}
\`\`\`

#### Get Article by Slug (Public)

\`\`\`
GET /articles/:slug
\`\`\`

**Response:**
Similar to Get Article by ID, but accessible publicly

#### Create Article (Admin Only)

\`\`\`
POST /articles
\`\`\`

**Request Body:**
\`\`\`json
{
  "title": "New Article Title",
  "content": "HTML content from rich text editor",
  "rawContent": "Draft.js raw content",
  "author": "Author Name",
  "category": "news",
  "tags": ["tag1", "tag2"],
  "imageData": {
    "url": "https://example.com/image.jpg",
    "public_id": "media-center/abc123"
  },
  "videoData": {
    "url": "https://example.com/video.mp4",
    "public_id": "media-center/xyz789"
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "message": "Article created successfully",
  "article": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "New Article Title",
    "slug": "new-article-title",
    // Other fields...
  }
}
\`\`\`

#### Update Article (Admin Only)

\`\`\`
PUT /articles/:id
\`\`\`

**Request Body:**
Same format as Create Article, with optional additional fields:
\`\`\`json
{
  // Same fields as Create Article, plus:
  "deleteImage": true, // Optional flag to remove existing image
  "deleteVideo": true  // Optional flag to remove existing video
}
\`\`\`

**Response:**
\`\`\`json
{
  "message": "Article updated successfully",
  "article": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "Updated Article Title",
    // Updated fields...
  }
}
\`\`\`

#### Delete Article (Admin Only)

\`\`\`
DELETE /articles/:id
\`\`\`

**Response:**
\`\`\`json
{
  "message": "Article deleted successfully"
}
\`\`\`

### Videos

#### Get All Videos

\`\`\`
GET /videos
\`\`\`

**Query Parameters:**
- \`page\` (optional): Page number for pagination (default: 1)
- \`limit\` (optional): Number of items per page (default: 10)
- \`category\` (optional): Filter by category

**Response:**
\`\`\`json
{
  "videos": [
    {
      "_id": "60d21b4667d0d8992e610c86",
      "title": "Video Title",
      "description": "Video description",
      "category": "tutorial",
      "videoUrl": "https://example.com/video.mp4",
      "thumbnailUrl": "https://example.com/thumbnail.jpg",
      "createdAt": "2023-06-22T10:30:00.000Z",
      "updatedAt": "2023-06-22T10:30:00.000Z"
    },
    // More videos...
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "pages": 2
  }
}
\`\`\`

#### Additional Video Endpoints

- \`GET /videos/:id\`: Get video by ID
- \`POST /videos\`: Create a new video (Admin Only)
- \`PUT /videos/:id\`: Update a video (Admin Only)
- \`DELETE /videos/:id\`: Delete a video (Admin Only)

### Galleries

#### Get All Galleries

\`\`\`
GET /galleries
\`\`\`

**Query Parameters:**
- \`page\` (optional): Page number for pagination (default: 1)
- \`limit\` (optional): Number of items per page (default: 10)
- \`category\` (optional): Filter by category

**Response:**
\`\`\`json
{
  "galleries": [
    {
      "_id": "60d21b4667d0d8992e610c87",
      "title": "Gallery Title",
      "description": "Gallery description",
      "category": "event",
      "coverImage": "https://example.com/cover.jpg",
      "images": [
        {
          "url": "https://example.com/image1.jpg",
          "caption": "Image 1 caption",
          "public_id": "media-center/img123"
        },
        // More images...
      ],
      "createdAt": "2023-06-22T10:30:00.000Z",
      "updatedAt": "2023-06-22T10:30:00.000Z"
    },
    // More galleries...
  ],
  "pagination": {
    "total": 8,
    "page": 1,
    "pages": 1
  }
}
\`\`\`

#### Additional Gallery Endpoints

- \`GET /galleries/:id\`: Get gallery by ID
- \`POST /galleries\`: Create a new gallery (Admin Only)
- \`PUT /galleries/:id\`: Update a gallery (Admin Only)
- \`DELETE /galleries/:id\`: Delete a gallery (Admin Only)
- \`POST /galleries/:id/images\`: Add image to gallery (Admin Only)
- \`DELETE /galleries/:id/images/:imageId\`: Remove image from gallery (Admin Only)

### Search

#### Search Content

\`\`\`
GET /search
\`\`\`

**Query Parameters:**
- \`query\` (required): Search term
- \`type\` (optional): Filter by content type (articles, videos, galleries)

**Response:**
\`\`\`json
{
  "results": {
    "articles": [ /* matching articles */ ],
    "videos": [ /* matching videos */ ],
    "galleries": [ /* matching galleries */ ]
  }
}
\`\`\`

### Media Upload (Admin Only)

#### Upload Image

\`\`\`
POST /upload/image
\`\`\`

**Request Body:**
Form data with file field named 'image'

**Response:**
\`\`\`json
{
  "url": "https://example.com/uploaded-image.jpg",
  "public_id": "media-center/abc123"
}
\`\`\`

#### Upload Video

\`\`\`
POST /upload/video
\`\`\`

**Request Body:**
Form data with file field named 'video'

**Response:**
\`\`\`json
{
  "url": "https://example.com/uploaded-video.mp4",
  "public_id": "media-center/xyz789"
}
\`\`\`

### Authentication

#### Login

\`\`\`
POST /auth/login
\`\`\`

**Request Body:**
\`\`\`json
{
  "email": "admin@mediacenter.com",
  "password": "admin123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d21b4667d0d8992e610c88",
    "name": "Admin User",
    "email": "admin@mediacenter.com",
    "role": "admin"
  }
}
\`\`\`

#### Register

\`\`\`
POST /auth/register
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "New User",
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

**Response:**
Similar to login response

#### Get Current User

\`\`\`
GET /auth/user
\`\`\`

**Response:**
\`\`\`json
{
  "user": {
    "_id": "60d21b4667d0d8992e610c88",
    "name": "Admin User",
    "email": "admin@mediacenter.com",
    "role": "admin"
  }
}
\`\`\`

## Error Handling

All endpoints follow a consistent error format:

\`\`\`json
{
  "message": "Detailed error message"
}
\`\`\`

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
`;

// Customized admin guide content based on actual implementation
const adminGuideMarkdown = `
# Media Center Admin Guide

Welcome to the Media Center Admin Guide. This document helps you navigate and effectively use all features of your Media Center admin panel.

## Getting Started

### Logging In

1. Navigate to the admin login page at \`/login\`
2. Enter your email and password credentials
3. Upon successful login, you'll be redirected to the admin dashboard

## Admin Panel Layout

The admin panel consists of:

- **Top Navigation Bar**: Shows the current page title and user information
- **Sidebar**: Contains links to all admin sections (collapsible on mobile)
- **Main Content Area**: Displays the current section's content

## Managing Articles

### Viewing Articles

1. Click on **Articles** in the sidebar
2. The articles list shows thumbnails, titles, authors, categories, and creation dates
3. Use the search bar at the top to find specific articles
4. Each article has view, edit, and delete action buttons

### Creating Articles

1. From the Articles list, click the **Create New Article** button
2. Fill in the article form:
   - **Title**: The article headline (required)
   - **Content**: Main article body using the rich text editor (required)
   - **Author**: The content creator's name (required)
   - **Category**: Select from predefined categories (required)
   - **Tags**: Add comma-separated tags for better searchability
   - **Featured Image**: Upload an image (optional)
   - **Featured Video**: Add a video (optional)

3. Click **Save Article** to publish

### Using the Rich Text Editor

The recently upgraded rich text editor offers numerous formatting options:

- **Text Styling**: Bold, italic, underline, strikethrough, font size
- **Paragraph Formatting**: Headings, blockquotes, alignment (left, center, right, justify)
- **Lists**: Numbered and bulleted lists with indentation control
- **Media**: Insert images, videos, and links
- **Advanced**: Text color, background color, special characters, emojis

To use the editor effectively:
1. Select text to format it with the toolbar options
2. Use the media buttons to insert images and videos
3. Preview your content regularly to ensure it appears as intended

### Editing Articles

1. From the Articles list, find the article and click the **Edit** button (pencil icon)
2. The form will load with all existing content, including the rich text in the editor
3. Make your changes to any field
4. Click **Update Article** to save changes

### Deleting Articles

1. From the Articles list, find the article and click the **Delete** button (trash icon)
2. A confirmation dialog will appear to prevent accidental deletion
3. Click **Delete Article** in the dialog to confirm

## Managing Videos

### Viewing Videos

1. Click on **Videos** in the sidebar
2. The list displays video thumbnails, titles, descriptions, and categories
3. Use the same action buttons (view, edit, delete) as for articles

### Adding Videos

1. From the Videos list, click **Add New Video**
2. Complete the video form:
   - **Title**: Video title (required)
   - **Description**: Description of the video content (required)
   - **Category**: Select appropriate category (required)
   - **Video File**: Upload your video file
   - **Thumbnail**: Upload a thumbnail image (optional, a frame from the video will be used if not provided)

3. Click **Save Video** to publish

## Managing Photo Galleries

### Creating Galleries

1. Click on **Photo Galleries** in the sidebar
2. Click **Add New Gallery**
3. Complete the gallery form:
   - **Title**: Gallery title (required)
   - **Description**: Gallery description (required)
   - **Category**: Select appropriate category (required)
   - **Cover Image**: Upload a featured image for the gallery
   - **Images**: Upload multiple images using the multi-file uploader

4. Add captions to individual images if needed
5. Click **Create Gallery** to publish

## Working with the Draft.js Rich Text Editor

The Media Center uses the Draft.js rich text editor with the react-draft-wysiwyg enhancement for article content. Key features include:

### Editor Toolbar

The toolbar provides numerous formatting options:

- **Text Formatting**: Bold, italic, underline, strikethrough
- **Text Style**: Font size, headings, block types
- **Alignment**: Left, center, right, justify
- **Lists**: Ordered and unordered lists
- **Indentation**: Indent and outdent options
- **Links**: Insert and edit hyperlinks
- **Media**: Insert images and videos
- **Emojis**: Insert emoji characters
- **Colors**: Text and highlight colors
- **History**: Undo and redo actions

### Images in Content

To add images to your article content:

1. Place your cursor where you want the image to appear
2. Click the image icon in the toolbar
3. Either upload a new image or provide an image URL
4. Adjust alignment and size as needed

### Content Conversion

The system automatically handles:

- Converting Draft.js content to HTML for public display
- Storing raw Draft.js content for future editing
- Preserving formatting when editing existing articles

## Content Management Tips

### Best Practices

- **Titles**: Use clear, concise, engaging titles
- **Content Structure**: Use headings to organize long articles
- **Images**: Include relevant images with proper sizing
- **Mobile Optimization**: Preview content on mobile devices when possible
- **Consistency**: Maintain consistent style and tone across content

### Media Management

- **Image Optimization**: Keep file sizes under 2MB for faster loading
- **Video Format**: Use MP4 format for best compatibility
- **Image Dimensions**:
  - Featured images: 1200×630px (16:9 ratio)
  - Gallery images: 1200×800px
  - Thumbnails: 400×225px

## Troubleshooting

### Common Issues

- **Rich Text Editor Not Loading**: Try refreshing the page or clearing browser cache
- **Upload Failures**: Check if file size exceeds limits or if the file format is supported
- **Content Not Saving**: Ensure all required fields are filled in
- **Formatting Issues**: If text formatting appears incorrect, try removing and reapplying formatting

### Browser Compatibility

For best results, use recent versions of Chrome, Firefox, Safari, or Edge browsers.
`;

const AdminDocs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <AdminLayout>
      <DocsContainer>
        <DocsTitle variant="h4">Documentation & Resources</DocsTitle>
        <Typography variant="body1" color="textSecondary" style={{ marginBottom: '20px' }}>
          Complete documentation for the Media Center admin panel and API.
        </Typography>
        
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<HelpIcon />} label="Admin Guide" />
          <Tab icon={<ApiIcon />} label="API Documentation" />
        </Tabs>
        
        <TabContainer>
          {activeTab === 0 && (
            <div>
              <TipCard>
                <LightbulbIcon />
                <div>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    Pro Tip
                  </Typography>
                  <Typography variant="body2">
                    This guide covers all aspects of managing content in the Media Center. 
                    If you're new to the system, we recommend starting with the "Getting Started" section.
                  </Typography>
                </div>
              </TipCard>
              
              <MarkdownContainer>
                <ReactMarkdown>{adminGuideMarkdown}</ReactMarkdown>
              </MarkdownContainer>
            </div>
          )}
          
          {activeTab === 1 && (
            <div>
              <TipCard>
                <CodeIcon />
                <div>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    Developer Note
                  </Typography>
                  <Typography variant="body2">
                    This API documentation is for developers integrating with the Media Center. 
                    All endpoints require authentication unless specifically noted.
                  </Typography>
                </div>
              </TipCard>
              
              <MarkdownContainer>
                <ReactMarkdown>{apiDocsMarkdown}</ReactMarkdown>
              </MarkdownContainer>
            </div>
          )}
        </TabContainer>
      </DocsContainer>
    </AdminLayout>
  );
};

export default AdminDocs;
