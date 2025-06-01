import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AdminLayout from './components/AdminLayout';
import { fetchArticles, deleteArticle } from '../utils/api';
import { Editor, EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';

// Material UI imports
import { 
  Paper, 
  Typography, 
  Button, 
  IconButton, 
  Tooltip,
  Chip,
  Box,
  CircularProgress,
  Fade,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArticleIcon from '@mui/icons-material/Article';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .header-title {
    font-family: 'Noto Serif', serif;
    color: var(--text-dark);
  }

  .header-subtitle {
    font-family: 'Open Sans', sans-serif;
    color: var(--text-medium);
    margin-top: 4px;
  }
`;

const ArticlesContainer = styled.div`
  animation: fadeIn 0.4s ease forwards;
  width: 100%;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const TableContainer = styled(Paper)`
  margin-top: 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    white-space: normal;
  }
`;

const AddButton = styled(Button)`
  &.MuiButton-root {
    padding: 10px 20px;
    font-weight: 600;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(43, 109, 168, 0.2);
    transition: all 0.3s ease;
    background-color: var(--primary-color);
    text-transform: none;
    font-size: 0.95rem;
    color: white;
    text-decoration: none;
    
    &:hover {
      background-color: var(--primary-dark);
      box-shadow: 0 6px 12px rgba(43, 109, 168, 0.3);
      transform: translateY(-2px);
    }
  }
`;

const TableHead = styled.thead`
  background-color: var(--background-light-gray); /* Assuming var(--background-off) is light gray */
  
  th {
    padding: 16px 20px;
    text-align: left;
    font-weight: 700; /* Bolder for header */
    color: var(--text-dark);
    border-bottom: 2px solid var(--border-color);
    font-family: 'Noto Serif', serif; /* Changed to Noto Serif */
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.9rem;
  }
`;

const TableBody = styled.tbody`
  tr {
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: var(--background-hover); /* Use a specific hover variable if available */
    }
  }
  
  td {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-medium);
    font-family: 'Open Sans', sans-serif;
    font-size: 0.9rem;

    .article-title-cell {
      font-weight: 500;
      color: var(--text-dark);
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const CategoryChip = styled(Chip)`
  &.MuiChip-root {
    font-weight: 500;
    background-color: rgba(43, 109, 168, 0.12); /* Slightly adjusted alpha */
    color: var(--primary-color);
    font-size: 0.825rem; /* Slightly adjusted font size */
    padding: 4px 8px; /* Added padding for better appearance */
    border-radius: 6px; /* Softer corners */
    font-family: 'Open Sans', sans-serif;
  }
`;

const StyledPagination = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding-bottom: 16px;
  
  .MuiPagination-root {
    .MuiPaginationItem-root {
      &.Mui-selected {
        background-color: var(--primary-color);
        color: white;
      }
    }
  }
`;

const ActionIconButton = styled(IconButton)`
  &.MuiIconButton-root {
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const EmptyStateContainer = styled(Box)`
  text-align: center;
  padding: 60px 30px;
  background-color: var(--background-light-gray); /* Or a very light shade */
  border-radius: 12px;
  margin: 40px 0;
  border: 1px dashed var(--border-color-light);
  
  .empty-state-icon {
    font-size: 56px; /* Slightly smaller */
    color: var(--primary-color);
    opacity: 0.7;
    margin-bottom: 20px;
  }

  .empty-state-title {
    font-family: 'Noto Serif', serif;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 8px;
  }

  .empty-state-message {
    font-family: 'Open Sans', sans-serif;
    color: var(--text-medium);
    margin-bottom: 24px;
  }

  .empty-state-button {
    font-family: 'Open Sans', sans-serif;
    font-weight: 600;
    text-transform: none;
    border-radius: 8px;
    padding: 10px 20px;
  }
`;

const LoadingContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  width: 100%;
  
  .MuiCircularProgress-root {
    color: var(--primary-color);
  }
`;

const ContentWrapper = styled(Box)`
  position: relative;
`;

const AdminArticles = () => {
  // Ensure fetchArticles is used from api utils if not already the case
  // const { fetchArticles, deleteArticle } = SomeApiUtil; // Example if it's from a specific util object
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  
  const fetchArticlesData = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetchArticles({ 
        page,
        limit: 10
      });
      
      setArticles(res.data.articles);
      setPagination(res.data.pagination);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please try again later.');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchArticlesData();
  }, []);
  
  const handlePageChange = (event, page) => {
    fetchArticlesData(page);
  };
  
  const handleDeleteClick = (article) => {
    setArticleToDelete(article);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;
    
    try {
      await deleteArticle(articleToDelete._id);
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
      fetchArticlesData(pagination.page);
    } catch (error) {
      console.error('Error deleting article:', error);
      setError('Failed to delete article. Please try again.');
    }
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setArticleToDelete(null);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <LoadingContainer>
          <CircularProgress size={50} thickness={4} />
        </LoadingContainer>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <ArticlesContainer>
        <PageHeader>
          <div>
            <Typography variant="h4" component="h1" className="header-title">
              Articles Management
            </Typography>
            <Typography variant="body1" className="header-subtitle">
              Create, edit and manage your articles
            </Typography>
          </div>
          <AddButton 
            component={Link} 
            to="/admin/articles/new"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add New Article
          </AddButton>
        </PageHeader>
        
        {error && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              mb: 3, 
              bgcolor: 'rgba(211, 47, 47, 0.08)', 
              color: '#d32f2f',
              border: '1px solid rgba(211, 47, 47, 0.2)',
              borderRadius: 2
            }}
          >
            <Typography>{error}</Typography>
          </Paper>
        )}
        
        <ContentWrapper>
          {articles.length > 0 ? (
            <Fade in={true} timeout={500}>
              <TableContainer>
                <StyledTable>
                  <TableHead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Author</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </TableHead>
                  <TableBody>
                    {articles.map(article => (
                      <tr key={article._id}>
                        <td className="article-title-cell">
                          <Typography variant="body2" fontWeight={500} sx={{ fontFamily: 'Open Sans, sans-serif' }}>
                            {article.title}
                          </Typography>
                        </td>
                        <td>
                          <CategoryChip 
                            size="small" 
                            label={article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                          />
                        </td>
                        <td>{article.author}</td>
                        <td>{formatDate(article.createdAt)}</td>
                        <td>
                          <ActionButtons>
                            <Tooltip title="View Article" arrow placement="top">
                              <ActionIconButton 
                                component={Link}
                                to={`/article/${article.slug}`}
                                target="_blank"
                                size="small" 
                                color="primary"
                              >
                                <VisibilityIcon fontSize="small" />
                              </ActionIconButton>
                            </Tooltip>
                            
                            <Tooltip title="Edit Article" arrow placement="top">
                              <ActionIconButton 
                                component={Link}
                                to={`/admin/articles/edit/${article._id}`}
                                size="small" 
                                color="primary"
                              >
                                <EditIcon fontSize="small" />
                              </ActionIconButton>
                            </Tooltip>
                            
                            <Tooltip title="Delete Article" arrow placement="top">
                              <ActionIconButton 
                                onClick={() => handleDeleteClick(article)}
                                size="small" 
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </ActionIconButton>
                            </Tooltip>
                          </ActionButtons>
                        </td>
                      </tr>
                    ))}
                  </TableBody>
                </StyledTable>
              </TableContainer>
            </Fade>
          ) : (
            <EmptyStateContainer>
              <ArticleIcon className="empty-state-icon" />
              <Typography variant="h5" className="empty-state-title">No articles found</Typography>
              <Typography variant="body1" className="empty-state-message">
                Get started by creating your first article.
              </Typography>
              <Button 
                component={Link}
                to="/admin/articles/new"
                variant="outlined" 
                color="primary" 
                startIcon={<AddIcon />}
                className="empty-state-button"
              >
                Add New Article
              </Button>
            </EmptyStateContainer>
          )}
          
          {pagination.pages > 1 && (
            <StyledPagination>
              <Pagination 
                count={pagination.pages} 
                page={pagination.page} 
                onChange={handlePageChange} 
                color="primary"
                size="large"
                showFirstButton 
                showLastButton
              />
            </StyledPagination>
          )}
        </ContentWrapper>
        
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
          <DialogTitle sx={{ fontFamily: 'Noto Serif, serif', fontSize: '1.3rem', fontWeight: 600, color: 'var(--error-main, #d32f2f)' }}>
            Confirm Delete
          </DialogTitle>
          <Divider sx={{ mb: 2 }} />
          <DialogContent>
            <DialogContentText sx={{ color: 'var(--text-medium)', fontFamily: 'Open Sans, sans-serif' }}>
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
                fontWeight: 600, /* Increased font weight */
                padding: '8px 16px',
                fontFamily: 'Open Sans, sans-serif'
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
                fontWeight: 600, /* Increased font weight */
                padding: '8px 16px',
                fontFamily: 'Open Sans, sans-serif'
              }}
            >
              Delete Article
            </Button>
          </DialogActions>
        </Dialog>
      </ArticlesContainer>
    </AdminLayout>
  );
};

export default AdminArticles;
