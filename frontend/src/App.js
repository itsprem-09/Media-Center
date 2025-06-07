import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

// Public Pages
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import GalleryPage from './pages/GalleryPage';
import VideoPage from './pages/VideoPage';
import CategoryPage from './pages/CategoryPage';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchResults from './pages/SearchResults';
import PublicGalleriesPage from './pages/PublicGalleriesPage'; // Added for public galleries page
import PublicVideosPage from './pages/PublicVideosPage'; // Added for public videos page

// Admin Pages
import AdminDashboard from './admin/AdminDashboard';
import AdminDocs from './admin/AdminDocs';

// Admin Form Pages
import AdminArticlePage from './admin/pages/AdminArticlePage';
import AdminGalleryPage from './admin/pages/AdminGalleryPage';
import AdminVideoPage from './admin/pages/AdminVideoPage';

// Admin List Pages
import ArticlesList from './admin/pages/ArticlesList';
import GalleriesList from './admin/pages/GalleriesList';
import VideosList from './admin/pages/VideosList';

// Components
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/article/:slug" element={<ArticlePage />} />
              <Route path="/gallery/:id" element={<GalleryPage />} />
              <Route path="/video/:id" element={<VideoPage />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/galleries" element={<PublicGalleriesPage />} /> {/* Added public galleries route */}
              <Route path="/videos" element={<PublicVideosPage />} /> {/* Added public videos route */}
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* Admin Articles Routes */}
              <Route path="/admin/articles" element={
                <ProtectedRoute>
                  <ArticlesList />
                </ProtectedRoute>
              } />
              <Route path="/admin/articles/new" element={
                <ProtectedRoute>
                  <AdminArticlePage />
                </ProtectedRoute>
              } />
              <Route path="/admin/articles/edit/:id" element={
                <ProtectedRoute>
                  <AdminArticlePage />
                </ProtectedRoute>
              } />
              
              {/* Admin Galleries Routes */}
              <Route path="/admin/galleries" element={
                <ProtectedRoute>
                  <GalleriesList />
                </ProtectedRoute>
              } />
              <Route path="/admin/galleries/new" element={
                <ProtectedRoute>
                  <AdminGalleryPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/galleries/edit/:id" element={
                <ProtectedRoute>
                  <AdminGalleryPage />
                </ProtectedRoute>
              } />
              
              {/* Admin Videos Routes */}
              <Route path="/admin/videos" element={
                <ProtectedRoute>
                  <VideosList />
                </ProtectedRoute>
              } />
              <Route path="/admin/videos/new" element={
                <ProtectedRoute>
                  <AdminVideoPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/videos/edit/:id" element={
                <ProtectedRoute>
                  <AdminVideoPage />
                </ProtectedRoute>
              } />
              
              {/* Admin Documentation Route */}
              <Route path="/admin/docs" element={
                <ProtectedRoute>
                  <AdminDocs />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
