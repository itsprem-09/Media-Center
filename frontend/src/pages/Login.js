import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styled from 'styled-components';
import '../assets/auth.css';

const PageContainer = styled.div`
  background-color: #f6f6f6;
  min-height: 100vh;
  display: flex; /* Added to center the auth card vertically */
  align-items: center; /* Added to center the auth card vertically */
`;

const AuthContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  
  const { login, user, loading, error: authError } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { email, password } = formData;
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log('Login.js - User object for redirection:', user);
      console.log('Login.js - User role for redirection:', user.role);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(location.state?.from || '/');
      }
    }
  }, [user, navigate, location.state]);
  
  // Show error from context if any
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    
    // Validate form
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate(location.state?.from || '/');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };
  
  return (
    <PageContainer>
      <AuthContainer>
        <div className="hindu-auth-card">
          <div className="hindu-auth-header">
            <h2>Sign in to your account</h2>
            <div className="hindu-divider"></div>
          </div>
          
          {error && <div className="hindu-auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="hindu-auth-form">
            <div className="hindu-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Your email address"
                disabled={loading}
              />
            </div>
            
            <div className="hindu-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Your password"
                disabled={loading}
              />
            </div>
            
            <div className="hindu-form-help">
              <a href="#">Forgot password?</a>
            </div>
            
            <button 
              type="submit" 
              className="hindu-auth-button"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'SIGN IN'}
            </button>
          </form>
          
          <div className="hindu-auth-footer">
            <div className="hindu-separator">
              <span>OR</span>
            </div>
            <p>Don't have an account? <Link to="/register">Create one now</Link></p>
          </div>
        </div>
      </AuthContainer>
    </PageContainer>
  );
};

export default Login;
