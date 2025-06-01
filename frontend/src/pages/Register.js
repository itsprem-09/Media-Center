import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const { name, email, password, confirmPassword } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    
    // Validate form
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      
      // Call register from context
      await register({
        name,
        email,
        password
      });
      
      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <PageContainer>
      <AuthContainer>
        <div className="hindu-auth-card">
          <div className="hindu-auth-header">
            <h2>Create your account</h2>
            <div className="hindu-divider"></div>
          </div>
          
          {error && <div className="hindu-auth-error">{error}</div>}
          {success && <div className="hindu-auth-success">Registration successful! Redirecting to login...</div>}
          
          <form onSubmit={handleSubmit} className="hindu-auth-form">
            <div className="hindu-form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="Your full name"
                disabled={loading}
              />
            </div>
            
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
                placeholder="Create a password (min 6 characters)"
                disabled={loading}
              />
            </div>
            
            <div className="hindu-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>
            
            <div className="hindu-terms">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </div>
            
            <button 
              type="submit" 
              className="hindu-auth-button"
              disabled={loading}
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>
          
          <div className="hindu-auth-footer">
            <div className="hindu-separator">
              <span>OR</span>
            </div>
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </AuthContainer>
    </PageContainer>
  );
};

export default Register;
