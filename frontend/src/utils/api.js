import axios from 'axios';

// Set base URL for all API requests
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://media-center-d6js.onrender.com/api'
});

// Intercept requests and add auth token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Make sure we're setting the Authorization header properly
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    };
  }
  return config;
});

// Articles API
export const fetchArticles = (params) => API.get('/articles', { params });
export const fetchArticleBySlug = (slug) => API.get(`/articles/${slug}`);
export const fetchArticleById = (id) => API.get(`/articles/id/${id}`); // For admin fetching by ID
export const createArticle = (articleData) => API.post('/articles', articleData);
export const updateArticle = (id, articleData) => API.put(`/articles/${id}`, articleData);
export const deleteArticle = (id) => API.delete(`/articles/${id}`);

// Galleries API
export const fetchGalleries = (params) => API.get('/galleries', { params });
export const fetchGalleryById = (id) => API.get(`/galleries/${id}`);
export const createGallery = (galleryData) => API.post('/galleries', galleryData);
export const updateGallery = (id, galleryData) => API.put(`/galleries/${id}`, galleryData);
export const addImageToGallery = (id, imageData) => API.post(`/galleries/${id}/images`, imageData);
export const removeImageFromGallery = (galleryId, imageId) => API.delete(`/galleries/${galleryId}/images/${imageId}`);
export const deleteGallery = (id) => API.delete(`/galleries/${id}`);

// Videos API
export const fetchVideos = (params) => API.get('/videos', { params });
export const fetchVideoById = (id) => API.get(`/videos/${id}`);
export const createVideo = (videoData) => API.post('/videos', videoData);
export const updateVideo = (id, videoData) => API.put(`/videos/${id}`, videoData);
export const deleteVideo = (id) => API.delete(`/videos/${id}`);

// Auth API
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);
export const getCurrentUser = () => API.get('/auth/user');

// Upload API (Cloudinary)
export const uploadImage = (formData) => {
  return API.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const uploadVideo = (formData) => {
  return API.post('/upload/video', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Search API
export const searchContent = (query, params = {}) => {
  return API.get('/search', { params: { query, ...params } });
};

export default API;
