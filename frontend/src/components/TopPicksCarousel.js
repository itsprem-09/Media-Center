import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TopPicksContainer = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-family: 'Didot', 'GFS Didot', serif; /* Match existing title font */
  font-size: 28px; /* As per image */
  font-weight: bold;
  color: #B71C1C; /* Dark red from image */
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  position: relative;
`;

const CarouselWrapper = styled.div`
  .slick-prev,
  .slick-next {
    z-index: 10; /* Increased z-index */
    width: 36px; /* Slightly larger */
    height: 36px; /* Slightly larger */
    background-color: #424242; /* Darker solid background */
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.2s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }

  .slick-prev:hover,
  .slick-next:hover {
    background-color: #212121; /* Even darker on hover */
    transform: scale(1.1);
  }

  .slick-prev:before,
  .slick-next:before {
    font-family: 'slick'; /* Ensure slick icon font is used */
    font-size: 18px; /* Adjusted size */
    color: white;
    opacity: 1; /* Full opacity */
  }

  .slick-prev {
    left: 10px; /* Pulled inwards */
  }

  .slick-next {
    right: 10px; /* Pulled inwards */
  }

  .slick-slide > div {
    margin: 0 10px; /* Spacing between slides */
  }
  .slick-dots {
    bottom: -30px;
    li button:before {
      font-size: 10px;
      color: #ccc; /* Inactive dot color */
    }
    li.slick-active button:before {
      color: #B71C1C; /* Active dot color - matches title */
    }
  }
`;

const PickCard = styled.div`
  height: 350px; /* Adjust as needed */
  position: relative;
  overflow: hidden;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* Align content to bottom */
  background-color: ${props => props.bgColor || '#333'}; /* Default bg for color cards */

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: ${props => (props.type === 'image-background' ? 'scale(1.05)' : 'none')};
  }
`;

const CardContent = styled.div`
  position: relative;
  z-index: 2;
  padding: 20px;
  background: ${props => (props.type === 'image-background' ? 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)' : 'transparent')};
  width: 100%;
  box-sizing: border-box;

  ${PickCard}.color-background & {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center; /* Center content vertically for color cards */
    text-align: left;
  }
`;

const CategoryLabel = styled.span`
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  color: #fff; /* White for image backgrounds */
  background-color: rgba(0,0,0,0.3); /* Slight dark background for readability on images */
  padding: 3px 6px;
  border-radius: 3px;
  margin-bottom: 8px;
  display: inline-block;

  ${PickCard}.color-background & {
    background-color: transparent;
    padding-left: 0;
    color: rgba(255,255,255,0.8);
  }
`;

const PickTitle = styled.h3`
  font-family: 'Didot', 'GFS Didot', serif;
  font-size: ${props => (props.isLarge ? '28px' : '20px')}; /* Larger for color card */
  font-weight: bold;
  color: #fff;
  margin: 0;
  line-height: 1.3;
`;

const dummyData = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/neeraj/400/350', // Placeholder from picsum.photos
    category: 'Visual Story',
    title: 'Neeraj joins the 90m club!',
    type: 'image-background'
  },
  {
    id: 2,
    category: 'Cricket',
    title: 'Piyush Chawla announces retirement from all forms of cricket',
    type: 'color-background',
    bgColor: '#B71C1C' // Dark red from title
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/hills/400/350', // Placeholder from picsum.photos
    category: 'Sponsored',
    title: 'Skopos Vadayambath Hills: Gated Villa Plot Living in Kochi\'s Rising Suburb, Puthenkurish',
    type: 'image-background'
  },
  {
    id: 4,
    image: 'https://picsum.photos/seed/elonMusk/400/350', // Placeholder from picsum.photos
    category: 'Science',
    title: 'In row with Trump, Musk says will end critical U.S. spaceship program',
    type: 'image-background'
  },
  {
    id: 5,
    image: 'https://picsum.photos/seed/aiStory/400/350', // Placeholder from picsum.photos
    category: 'Technology',
    title: 'New Breakthrough in AI Development Announced Today',
    type: 'image-background'
  },
];

const TopPicksCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          arrows: false, // Hide arrows on mobile for cleaner look
        }
      }
    ]
  };

  return (
    <TopPicksContainer>
      <SectionTitle>Top Picks</SectionTitle>
      <CarouselWrapper>
        <Slider {...settings}>
          {dummyData.map(pick => (
            <div key={pick.id}>
              <PickCard type={pick.type} bgColor={pick.bgColor} className={pick.type === 'color-background' ? 'color-background' : ''}>
                {pick.image && <img src={pick.image} alt={pick.title} />}
                <CardContent type={pick.type}>
                  <CategoryLabel>{pick.category}</CategoryLabel>
                  <PickTitle isLarge={pick.type === 'color-background'}>{pick.title}</PickTitle>
                </CardContent>
              </PickCard>
            </div>
          ))}
        </Slider>
      </CarouselWrapper>
    </TopPicksContainer>
  );
};

export default TopPicksCarousel;
