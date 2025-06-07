import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LoginIcon from '@mui/icons-material/Login';
import { AuthContext } from '../context/AuthContext';

const HeaderContainer = styled.header`
  background-color: #ffffff;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 20px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #e0e0e0;
  font-size: 12px;
  
  @media (max-width: 768px) {
    padding: 6px 15px;
  }
`;

// Add these two missing styled components
const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const MainHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 20px 0;
  background-color: #ffffff;
  
  @media (max-width: 768px) {
    padding: 10px 15px 0;
  }
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 10px;
`;

const Logo = styled(Link)`
  font-family: 'Didot', 'GFS-Didot';
  font-size: 36px;
  font-weight: bold;
  color: #000000;
  text-decoration: none;
  letter-spacing: -1px;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const NavContainer = styled.nav`
  width: 100%;
  max-width: 1200px;
  border-top: 1px solid #e0e0e0;
  border-bottom: 3px solid #d32f2f;
  padding: 8px 0;
  
  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
    border-bottom: none;
  }
`;

const NavList = styled.ul`
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 25px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const NavItem = styled.li`
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  
  a {
    color: #333;
    text-decoration: none;
    padding: 5px 0;
    transition: color 0.2s ease;
    
    &:hover {
      color: #D32F2F;
    }
  }
  
  @media (max-width: 768px) {
    border-bottom: 1px solid #e0e0e0;
    padding: 10px 0;
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  font-size: 24px;
  padding: 0;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  padding: 5px;
  
  &:hover {
    color: #D32F2F;
  }
`;

const SubscribeButton = styled(Link)`
  background-color: #D32F2F;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 3px;
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #B71C1C;
  }
`;

const LoginButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    color: #D32F2F;
  }
`;

const LogoutButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 3px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #5a6268;
  }
`;

const SearchContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 1000;
`;

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <HeaderContainer>
      <TopBar>
        <TopBarLeft>
          <span>{currentDate}</span>
          <Link to="/epaper" style={{ color: '#D32F2F', textDecoration: 'none' }}>e-Paper</Link>
        </TopBarLeft>
        <TopBarRight>
          {user ? (
            <>
              <span>Welcome, {user.name || user.email}</span>
              <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            </>
          ) : (
            <>
              <LoginButton to="/login">
                <LoginIcon fontSize="small" />
                Login
              </LoginButton>
              <SubscribeButton to="/subscribe">Subscribe</SubscribeButton>
            </>
          )}
        </TopBarRight>
      </TopBar>
      
      <MainHeader>
        <LogoContainer>
          <Logo to="/">Media Center</Logo>
        </LogoContainer>
        
        <MobileMenuButton onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </MobileMenuButton>
        
        <NavContainer $isOpen={mobileMenuOpen}>
          <NavList>
            <NavItem><Link to="/">Home</Link></NavItem>
            <NavItem><Link to="/category/news">News</Link></NavItem>
            <NavItem><Link to="/category/opinion">Opinion</Link></NavItem>
            <NavItem><Link to="/category/business">Business</Link></NavItem>
            <NavItem><Link to="/category/sport">Sport</Link></NavItem>
            <NavItem><Link to="/category/entertainment">Entertainment</Link></NavItem>
            <NavItem><Link to="/galleries">Galleries</Link></NavItem>
            <NavItem><Link to="/videos">Videos</Link></NavItem>
            <NavItem>
              <SearchButton onClick={toggleSearch}>
                <SearchIcon fontSize="small" />
              </SearchButton>
            </NavItem>
          </NavList>
        </NavContainer>
      </MainHeader>
      
      <SearchContainer $isOpen={searchOpen}>
        <form onSubmit={(e) => {
          e.preventDefault();
          const query = searchInputRef.current.value.trim();
          if (query) {
            navigate(`/search?query=${encodeURIComponent(query)}`);
            setSearchOpen(false);
          }
        }}>
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search..." 
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #e0e0e0',
              borderRadius: '3px'
            }}
          />
        </form>
      </SearchContainer>
    </HeaderContainer>
  );
};

export default Header;
