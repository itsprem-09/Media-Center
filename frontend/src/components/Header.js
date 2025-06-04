import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { AuthContext } from '../context/AuthContext';
import SearchBar from './SearchBar';

const HeaderContainer = styled.header`
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  max-width: 1200px;
  margin: 0 auto;
  border-bottom: 1px solid #eaeaea;
  
  @media (max-width: 768px) {
    padding: 12px 15px;
  }
`;

const Logo = styled.div`
  font-size: 28px;
  font-weight: 700;
  font-family: 'Noto Serif', serif;
  letter-spacing: -0.5px;
  
  a {
    text-decoration: none;
    color: #222;
    transition: color 0.3s ease;
    
    &:hover {
      color: #2b6da8;
      text-decoration: none;
    }
  }
`;

const NavWrapper = styled.div.attrs(props => ({
  // Use transient props with $ prefix to avoid passing to DOM
  style: {
    maxHeight: props.$isOpen ? '300px' : '0'
  }
}))`
  display: flex;
  flex: 1;
  transition: all 0.3s ease;
  overflow: hidden;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  background-color: #fff;
  
  @media (min-width: 768px) {
    max-height: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  background-color: #fff;
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0;
    background-color: #fff;
  }
`;

const NavItem = styled.div`
  padding: 12px 15px;
  text-align: center;
  border-bottom: 1px solid #e1e1e1;
  background-color: #fff;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background-color: #f9f9f9;
  }
  
  &.active {
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      height: 2px;
      background-color: #2b6da8;
    }
  }
  
  a {
    color: #333;
    text-decoration: none;
    font-weight: 500;
    font-size: 15px;
    transition: color 0.2s;
    font-family: 'Noto Serif', serif;
    display: block;
    
    &:hover {
      color: #2b6da8;
    }
  }
  
  @media (min-width: 768px) {
    border-bottom: none;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
`;

const AuthLinks = styled.div`
  display: flex;
  align-items: center;
  
  a {
    margin-left: 15px;
    text-decoration: none;
    color: #2b6da8;
    font-size: 14px;
    font-weight: 500;
    padding: 5px 0;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: #2b6da8;
      transition: width 0.3s ease;
    }
    
    &:hover {
      text-decoration: none;
      
      &:after {
        width: 100%;
      }
    }
    
    &:first-child {
      margin-left: 0;
    }
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  
  span {
    margin-left: 5px;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: block;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const DateDisplay = styled.div`
  font-size: 14px;
  color: #666;
  padding: 5px 0;
  text-align: center;
  border-bottom: 1px solid #e1e1e1;
`;

const SearchDropdown = styled.div.attrs(props => ({
  // Use transient props with $ prefix to avoid passing to DOM
  style: {
    opacity: props.$isVisible ? 1 : 0,
    visibility: props.$isVisible ? 'visible' : 'hidden',
    transform: props.$isVisible ? 'translateY(0)' : 'translateY(-10px)'
  }
}))`
  position: absolute;
  top: 100%;
  right: 0;
  width: 300px;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  margin-top: 10px;
  z-index: 1000;
  transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
  
  @media (max-width: 576px) {
    width: 260px;
    right: -30px;
  }
  
  &:before {
    content: '';
    position: absolute;
    top: -6px;
    right: 12px;
    width: 12px;
    height: 12px;
    background-color: white;
    transform: rotate(45deg);
    border-left: 1px solid rgba(0, 0, 0, 0.05);
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  
  const handleSearchSubmit = (query) => {
    setIsSearchOpen(false);
    
    // If we're on the home page, use custom event to trigger search
    if (window.location.pathname === '/') {
      const searchEvent = new CustomEvent('performSearch', { detail: { query } });
      window.dispatchEvent(searchEvent);
    } else {
      // If we're on another page, navigate to homepage with search query
      navigate(`/?search=${encodeURIComponent(query)}`);
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };
  
  const [activeItem, setActiveItem] = useState(window.location.pathname);
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <HeaderContainer>
      <TopBar>
        <Logo><Link to="/">THE MEDIA CENTER</Link></Logo>
        <MenuButton onClick={toggleMenu}>
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </MenuButton>
        <HeaderActions>
          <Search ref={searchRef}>
            <SearchIcon onClick={toggleSearch} />
            <SearchDropdown $isVisible={isSearchOpen}>
              <SearchBar 
                onSearch={handleSearchSubmit} 
                placeholder="Search articles, galleries, videos..."
                size="small"
              />
            </SearchDropdown>
          </Search>
          
          {user ? (
            <UserMenu>
              <PersonIcon fontSize="small" />
              <span>{user.name}</span>
              <button onClick={handleLogout} style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#666' }}>
                Logout
              </button>
            </UserMenu>
          ) : (
            <AuthLinks>
              <Link to="/login">Sign in</Link>
              <span style={{ margin: '0 5px', color: '#666' }}>|</span>
              <Link to="/register">Register</Link>
            </AuthLinks>
          )}
        </HeaderActions>
      </TopBar>
      
      <NavWrapper $isOpen={isMenuOpen}>
        <Nav>
          <NavItem className={activeItem === '/' ? 'active' : ''}>
            <Link to="/" onClick={() => { setActiveItem('/'); toggleMenu(); }}>Home</Link>
          </NavItem>
          <NavItem className={activeItem === '/category/news' ? 'active' : ''}>
            <Link to="/category/news" onClick={() => { setActiveItem('/category/news'); toggleMenu(); }}>News</Link>
          </NavItem>
          <NavItem className={activeItem === '/category/opinion' ? 'active' : ''}>
            <Link to="/category/opinion" onClick={() => { setActiveItem('/category/opinion'); toggleMenu(); }}>Opinion</Link>
          </NavItem>
          <NavItem className={activeItem === '/category/business' ? 'active' : ''}>
            <Link to="/category/business" onClick={() => { setActiveItem('/category/business'); toggleMenu(); }}>Business</Link>
          </NavItem>
          <NavItem className={activeItem === '/category/sport' ? 'active' : ''}>
            <Link to="/category/sport" onClick={() => { setActiveItem('/category/sport'); toggleMenu(); }}>Sport</Link>
          </NavItem>
          <NavItem className={activeItem === '/category/entertainment' ? 'active' : ''}>
            <Link to="/category/entertainment" onClick={() => { setActiveItem('/category/entertainment'); toggleMenu(); }}>Entertainment</Link>
          </NavItem>
          <NavItem className={activeItem === '/category/technology' ? 'active' : ''}>
            <Link to="/category/technology" onClick={() => { setActiveItem('/category/technology'); toggleMenu(); }}>Technology</Link>
          </NavItem>
          <NavItem className={activeItem === '/category/lifestyle' ? 'active' : ''}>
            <Link to="/category/lifestyle" onClick={() => { setActiveItem('/category/lifestyle'); toggleMenu(); }}>Lifestyle</Link>
          </NavItem>
        </Nav>
      </NavWrapper>
    </HeaderContainer>
  );
};

export default Header;
