import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import GalleryPage from './pages/GalleryPage';
import VideoPage from './pages/VideoPage';
import CategoryPage from './pages/CategoryPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

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
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
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
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
