import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #FFFFF0;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const LoginTitle = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
`;

const LoginSubtitle = styled.p`
  font-size: 14px;
  color: #666;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #0087a8;
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #0087a8;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #006b87;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
  font-size: 14px;
`;

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error: authError } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setLocalError('Email and password are required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setLocalError('');
      
      const success = await login(formData.email, formData.password);
      
      if (success) {
        navigate('/admin');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <LoginTitle>Media Center Admin</LoginTitle>
          <LoginSubtitle>Sign in to manage content</LoginSubtitle>
        </LoginHeader>
        
        {(localError || authError) && (
          <ErrorMessage>{localError || authError}</ErrorMessage>
        )}
        
        <LoginForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </FormGroup>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </LoginForm>
      </LoginCard>
    </LoginContainer>
  );
};

export default AdminLogin;
