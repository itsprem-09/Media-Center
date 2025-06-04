import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext';

// Material UI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--background-gray);
  position: relative;
`;

const Sidebar = styled.aside`
  width: 280px;
  background-color: #1a2a38;
  color: white;
  padding-top: 0;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  box-shadow: 3px 0 10px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease; // More specific transition
  z-index: 1000;

  // Styles for mobile/tablet - sidebar slides in/out based on isOpen prop
  @media (max-width: 991px) {
    left: ${props => (props.$isOpen ? '0' : '-280px')};
  }
  
  // Styles for desktop - sidebar is fixed open
  @media (min-width: 992px) {
    left: 0;
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  background-color: var(--primary-dark);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SidebarTitle = styled.h1`
  font-size: 22px;
  margin: 0;
  font-weight: 600;
  font-family: 'Noto Serif', serif;
  color: white;
`;

const SidebarSubtitle = styled.p`
  font-size: 13px;
  margin: 5px 0 0;
  opacity: 0.7;
  font-family: 'Open Sans', sans-serif;
`;

const SidebarNav = styled.nav`
  padding: 10px;
`;

const NavItem = styled.div`
  margin-bottom: 8px;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  font-family: 'Open Sans', sans-serif;
  
  &:hover {
    background-color: rgba(43, 109, 168, 0.15);
    color: white;
    transform: translateX(4px);
  }
  
  &.active {
    background-color: var(--primary-color);
    color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background-color: white;
    }
  }
  
  svg {
    margin-right: 12px;
    font-size: 20px;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 14px 16px;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 16px;
  font-weight: 500;
  font-family: 'Open Sans', sans-serif;
  margin-top: 10px;
  
  &:hover {
    background-color: rgba(211, 47, 47, 0.2);
    color: white;
  }
  
  svg {
    margin-right: 12px;
    font-size: 20px;
  }
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 280px; // Base style for desktop
  padding: 30px;
  background-color: var(--background-light);
  transition: margin-left 0.3s ease; // More specific transition
  min-height: 100vh;
  
  // Styles for mobile/tablet - no margin for sidebar
  @media (max-width: 991px) {
    margin-left: 0;
    width: 100%;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1002;
  background-color: var(--primary-color);
  color: white;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  @media (min-width: 992px) {
    display: none;
  }
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 25px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 25px;
  border-radius: 8px;
`;

const TopBarTitle = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  color: var(--text-dark);
  font-weight: 600;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-medium);
  font-weight: 500;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => (props.$isOpen ? 'block' : 'none')};
  
  @media (min-width: 992px) {
    display: none;
  }
`;

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current page name for the header
  const getCurrentPageName = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/dashboard') return 'Dashboard';
    if (path === '/admin/articles') return 'Articles Management';
    if (path.includes('/admin/articles/add')) return 'Add New Article';
    if (path.includes('/admin/articles/edit')) return 'Edit Article';
    if (path === '/admin/galleries') return 'Photo Galleries Management';
    if (path.includes('/admin/galleries/add')) return 'Add New Gallery';
    if (path.includes('/admin/galleries/edit')) return 'Edit Gallery';
    if (path === '/admin/videos') return 'Videos Management';
    if (path.includes('/admin/videos/add')) return 'Add New Video';
    if (path.includes('/admin/videos/edit')) return 'Edit Video';
    if (path === '/admin/docs') return 'Documentation & Resources';
    return 'Admin Panel';
  };
  
  // Check if link is active
  const isLinkActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return location.pathname.includes(path) && path !== '/admin';
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 992) {
      setSidebarOpen(false);
    }
  };
  
  // Get first letter of user's name for avatar
  const getNameInitial = () => {
    return user && user.name ? user.name.charAt(0).toUpperCase() : 'A';
  };
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <LayoutContainer>
      <Overlay $isOpen={sidebarOpen} onClick={toggleSidebar} />
      
      <MobileMenuButton onClick={toggleSidebar}>
        {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </MobileMenuButton>
      
      <Sidebar $isOpen={sidebarOpen}>
        <SidebarHeader>
          <div>
            <SidebarTitle>Media Center</SidebarTitle>
            <SidebarSubtitle>Admin Dashboard</SidebarSubtitle>
          </div>
          {window.innerWidth <= 992 && (
            <CloseIcon style={{ cursor: 'pointer' }} onClick={toggleSidebar} />
          )}
        </SidebarHeader>
        
        <SidebarNav>
          <NavItem>
            <NavLink 
              to="/admin/dashboard" 
              onClick={closeSidebarOnMobile}
              className={isLinkActive('/admin/dashboard') && location.pathname === '/admin' ? 'active' : ''}
            >
              <DashboardIcon /> Dashboard
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink 
              to="/admin/articles" 
              onClick={closeSidebarOnMobile}
              className={location.pathname.includes('/admin/articles') ? 'active' : ''}
            >
              <ArticleIcon /> Articles
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink 
              to="/admin/galleries" 
              onClick={closeSidebarOnMobile}
              className={location.pathname.includes('/admin/galleries') ? 'active' : ''}
            >
              <PhotoLibraryIcon /> Photo Galleries
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink 
              to="/admin/videos" 
              onClick={closeSidebarOnMobile}
              className={location.pathname.includes('/admin/videos') ? 'active' : ''}
            >
              <VideoLibraryIcon /> Videos
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink 
              to="/admin/docs" 
              onClick={closeSidebarOnMobile}
              className={location.pathname.includes('/admin/docs') ? 'active' : ''}
            >
              <MenuBookIcon /> Documentation
            </NavLink>
          </NavItem>
          
          <NavItem>
            <LogoutButton onClick={handleLogout}>
              <LogoutIcon /> Logout
            </LogoutButton>
          </NavItem>
        </SidebarNav>
      </Sidebar>
      
      <MainContent>
        <TopBar>
          <TopBarTitle>{getCurrentPageName()}</TopBarTitle>
          <UserInfo>
            {user && user.name ? user.name : 'Admin'}
            <UserAvatar>
              <AccountCircleIcon />
            </UserAvatar>
          </UserInfo>
        </TopBar>
        
        <div className="fade-in">
          {children}
        </div>
      </MainContent>
    </LayoutContainer>
  );
};

export default AdminLayout;
