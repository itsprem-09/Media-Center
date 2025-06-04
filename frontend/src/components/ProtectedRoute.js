import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  // Show loading state while authentication status is being determined
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  // Render children if authenticated
  return children;
};

export default ProtectedRoute;
