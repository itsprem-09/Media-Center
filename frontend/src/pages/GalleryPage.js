import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { fetchGalleryById } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const GalleryContainer = styled.div`
  background-color: #FFFFF0;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const GalleryHeader = styled.div`
  margin-bottom: 30px;
  text-align: center;
`;

const GalleryTitle = styled.h1`
  font-size: 32px;
  margin-bottom: 10px;
  font-weight: 700;
  color: #333;
`;

const GalleryDate = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const ImageWrapper = styled.div`
  cursor: pointer;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 4px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const ImageCaption = styled.div`
  font-size: 14px;
  color: #555;
  margin-top: 8px;
  font-style: italic;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 90%;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  display: block;
  margin: 0 auto;
`;

const ModalCaption = styled.div`
  color: white;
  text-align: center;
  padding: 15px;
  font-size: 16px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  ${props => props.direction === 'prev' ? 'left: -50px;' : 'right: -50px;'}
  transform: translateY(-50%);
  background: none;
  border: none;
  color: white;
  font-size: 40px;
  cursor: pointer;
  
  @media (max-width: 768px) {
    ${props => props.direction === 'prev' ? 'left: 10px;' : 'right: 10px;'}
    font-size: 30px;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 50px;
  color: red;
`;

const GalleryPage = () => {
  const { id } = useParams();
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const res = await fetchGalleryById(id);
        setGallery(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching gallery:', err);
        setError('Failed to load gallery. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchGallery();
  }, [id]);
  
  const openModal = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };
  
  const closeModal = () => {
    setSelectedImage(null);
  };
  
  const handlePrev = () => {
    const newIndex = currentIndex - 1;
    if (newIndex >= 0) {
      setSelectedImage(gallery.images[newIndex]);
      setCurrentIndex(newIndex);
    }
  };
  
  const handleNext = () => {
    const newIndex = currentIndex + 1;
    if (newIndex < gallery.images.length) {
      setSelectedImage(gallery.images[newIndex]);
      setCurrentIndex(newIndex);
    }
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImage) {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentIndex]);
  
  if (loading) {
    return (
      <GalleryContainer>
        <Header />
        <Loading>Loading gallery...</Loading>
        <Footer />
      </GalleryContainer>
    );
  }
  
  if (error || !gallery) {
    return (
      <GalleryContainer>
        <Header />
        <ErrorMessage>{error || 'Gallery not found'}</ErrorMessage>
        <Footer />
      </GalleryContainer>
    );
  }
  
  return (
    <GalleryContainer>
      <Header />
      <MainContent>
        <GalleryHeader>
          <GalleryTitle>{gallery.title}</GalleryTitle>
          <GalleryDate>
            Published {new Date(gallery.createdAt).toLocaleDateString()}
          </GalleryDate>
        </GalleryHeader>
        
        <ImagesGrid>
          {gallery.images.map((image, index) => (
            <ImageWrapper key={image._id} onClick={() => openModal(image, index)}>
              <Image src={image.url} alt={image.caption} />
              {image.caption && <ImageCaption>{image.caption}</ImageCaption>}
            </ImageWrapper>
          ))}
        </ImagesGrid>
      </MainContent>
      
      {selectedImage && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            
            {currentIndex > 0 && (
              <NavButton direction="prev" onClick={handlePrev}>&lsaquo;</NavButton>
            )}
            
            <ModalImage src={selectedImage.url} alt={selectedImage.caption} />
            
            {currentIndex < gallery.images.length - 1 && (
              <NavButton direction="next" onClick={handleNext}>&rsaquo;</NavButton>
            )}
            
            {selectedImage.caption && (
              <ModalCaption>{selectedImage.caption}</ModalCaption>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
      
      <Footer />
    </GalleryContainer>
  );
};

export default GalleryPage;
