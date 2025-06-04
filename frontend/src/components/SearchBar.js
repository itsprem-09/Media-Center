import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Paper,
  InputBase,
  IconButton,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const SearchContainer = styled(Paper)(({ theme }) => ({
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  maxWidth: '500px',
  borderRadius: '30px',
  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  border: '1px solid #e0e0e0',
  '&:hover': {
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
    borderColor: theme.palette.primary.light,
  },
  '&:focus-within': {
    boxShadow: '0 6px 15px rgba(43, 109, 168, 0.15)',
    borderColor: theme.palette.primary.main,
  }
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  flex: 1,
  fontFamily: 'Roboto, sans-serif',
  '& input::placeholder': {
    fontSize: '0.9rem',
    opacity: 0.7,
  },
}));

const SearchButton = styled(IconButton)(({ theme }) => ({
  padding: 10,
  color: theme.palette.primary.main,
  backgroundColor: theme.palette.grey[100],
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: 'white',
  },
  borderRadius: '50%',
  marginRight: '4px',
}));

const ClearButton = styled(IconButton)(({ theme }) => ({
  padding: 10,
  color: theme.palette.grey[500],
  '&:hover': {
    color: theme.palette.error.main,
  },
}));

const SearchBar = ({ onSearch, initialQuery = '', size = 'medium', placeholder = 'Search articles, galleries, videos...' }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <SearchContainer elevation={1}>
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          inputProps={{ 'aria-label': 'search media center' }}
          size={size}
          fullWidth
        />
        {searchQuery && (
          <>
            <ClearButton 
              aria-label="clear search" 
              onClick={handleClear}
              size="small"
            >
              <ClearIcon fontSize="small" />
            </ClearButton>
            <Divider orientation="vertical" flexItem sx={{ height: 28, mx: 0.5 }} />
          </>
        )}
        <SearchButton 
          type="submit" 
          aria-label="search"
          disabled={!searchQuery.trim()}
        >
          <SearchIcon />
        </SearchButton>
      </SearchContainer>
    </form>
  );
};

export default SearchBar;
