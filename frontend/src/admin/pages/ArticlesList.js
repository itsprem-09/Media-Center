import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import * as api from '../../utils/api';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import AdminLayout from '../components/AdminLayout';
import SearchBar from '../../components/SearchBar';

const Container = styled.div`
  padding: 30px 20px;
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 16px;
  
  h1 {
    font-family: 'Noto Serif', serif;
    color: #2b6da8;
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StyledTableCell = styled(TableCell)`
  &.MuiTableCell-head {
    background-color: #f0f4f8;
    font-weight: 600;
    color: #2b6da8;
    font-family: 'Noto Serif', serif;
    border-bottom: 2px solid #2b6da8;
  }
`;

const StyledTableRow = styled(TableRow)`
  transition: all 0.3s ease;
  
  &:nth-of-type(odd) {
    background-color: #f9fbfd;
  }
  
  &:hover {
    background-color: #edf4fa;
    transform: translateY(-1px);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.05);
  }
  
  td {
    padding: 14px 16px;
    vertical-align: middle;
    border-bottom: 1px solid #e0e0e0;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  
  .MuiIconButton-root {
    background-color: #f5f7fa;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: #2b6da8;
      color: white;
      transform: translateY(-2px);
    }
    
    &.delete-btn:hover {
      background-color: #d32f2f;
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  width: 100%;
  
  .MuiCircularProgress-root {
    color: #2b6da8;
  }
`;

const ThumbnailImg = styled.img`
  width: 100px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const NoArticlesMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  color: #666;
  margin-top: 20px;
  border: 1px dashed #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  
  h6 {
    font-family: 'Noto Serif', serif;
    margin-bottom: 8px;
    color: #2b6da8;
  }
  
  svg {
    font-size: 48px;
    color: #2b6da8;
    opacity: 0.7;
    margin-bottom: 16px;
  }
`;

// Helper function to get search params from URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ArticlesList = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const searchQuery = query.get('query') || '';
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  
  useEffect(() => {
    fetchArticles();
  }, [searchQuery]);
  
  const fetchArticles = async () => {
    try {
      setLoading(true);
      let articlesData = [];
      
      if (searchQuery) {
        // If there's a search query, use the search API
        const response = await api.searchContent(searchQuery);
        articlesData = response.data.results.articles || [];
      } else {
        // Otherwise fetch all articles
        const response = await api.fetchArticles();
        articlesData = response.data.articles || [];
      }
      
      setArticles(articlesData);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Failed to load articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteClick = (article) => {
    setArticleToDelete(article);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;
    
    try {
      await api.deleteArticle(articleToDelete._id);
      setArticles(articles.filter(article => article._id !== articleToDelete._id));
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
    } catch (error) {
      console.error('Error deleting article:', error);
      setError('Failed to delete article. Please try again.');
    }
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setArticleToDelete(null);
  };
  
  const handleEditClick = (id) => {
    navigate(`/admin/articles/edit/${id}`);
  };
  
  const handleViewClick = (slug) => {
    // Open the article in a new tab
    window.open(`/article/${slug}`, '_blank');
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <Container>
          <LoadingContainer>
            <CircularProgress />
          </LoadingContainer>
        </Container>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <Container>
        <Header>
          <Typography variant="h4" component="h1">
            <NewspaperIcon sx={{ mr: 1 }} />
            Articles
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/articles/new')}
          >
            Create New Article
          </Button>
        </Header>
        
        {/* Search Bar */}
        <Box mb={3}>
          <SearchBar 
            initialQuery={searchQuery}
            onSearch={(query) => {
              if (query.trim()) {
                navigate(`/admin/articles?query=${encodeURIComponent(query.trim())}`);
              } else {
                navigate('/admin/articles');
              }
            }}
            placeholder="Search articles by title, content, category or tags..."
          />
        </Box>
        
        {/* Show search indicator if searching */}
        {searchQuery && (
          <Box display="flex" alignItems="center" mb={2} p={2} bgcolor="#f5f7fa" borderRadius={1}>
            <SearchIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2">
              Showing results for "{searchQuery}" {' '}
              <Button 
                size="small" 
                variant="text" 
                onClick={() => navigate('/admin/articles')}
              >
                Clear search
              </Button>
            </Typography>
          </Box>
        )}
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        {articles.length > 0 ? (
        <TableContainer component={Paper} sx={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)' }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f0f4f8' }}>
                <StyledTableCell>Image</StyledTableCell>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Author</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Created At</StyledTableCell>
                <StyledTableCell width="180">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles.map((article) => (
                <StyledTableRow key={article._id}>
                  <TableCell>
                    {article.image ? (
                      <ThumbnailImg src={article.image} alt={article.title} />
                    ) : (
                      <div>No image</div>
                    )}
                  </TableCell>
                  <TableCell>{article.title}</TableCell>
                  <TableCell>{article.author}</TableCell>
                  <TableCell>
                    {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                  </TableCell>
                  <TableCell>
                    {new Date(article.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <ActionButtons>
                      <Tooltip title="View Article" arrow placement="top">
                        <IconButton 
                          onClick={() => handleViewClick(article.slug)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Article" arrow placement="top">
                        <IconButton 
                          onClick={() => handleEditClick(article._id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Article" arrow placement="top">
                        <IconButton 
                          className="delete-btn"
                          onClick={() => handleDeleteClick(article)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ActionButtons>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <NoArticlesMessage>
          <NewspaperIcon />
          <Typography variant="h6">No articles found</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Get started by adding your first article!
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/articles/new')}
            sx={{ mt: 2 }}
          >
            Create New Article
          </Button>
        </NoArticlesMessage>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          style: {
            borderRadius: '12px',
            padding: '8px',
            maxWidth: '500px'
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#d32f2f' }}>
          Confirm Delete
        </DialogTitle>
        <Divider sx={{ mb: 2 }} />
        <DialogContent>
          <DialogContentText sx={{ color: 'var(--text-medium)' }}>
            Are you sure you want to delete the article <strong>"{articleToDelete?.title}"</strong>? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button 
            onClick={handleDeleteCancel} 
            variant="outlined"
            sx={{ 
              borderRadius: '8px', 
              textTransform: 'none',
              fontWeight: 500,
              padding: '8px 16px'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            sx={{ 
              borderRadius: '8px', 
              textTransform: 'none', 
              fontWeight: 500,
              padding: '8px 16px'
            }}
          >
            Delete Article
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  </AdminLayout>
  );
};

export default ArticlesList;
