import React from 'react';
import styled from 'styled-components';

/*
 * Generic advertisement placeholder.
 * The real TheHindu.com site serves ads from Google Ad-Manager; while the
 * project has no ad-server yet, we render static placeholders that match the
 * standard IAB sizes used on that site (leaderboard 970×90, billboard 970×250,
 * medium-rectangle 300×250, mobile-banner 320×50, etc.).
 *
 * Usage: <AdBanner variant="leaderboard" />
 */

const sizeMap = {
  // Large horizontal banner shown below the header.
  leaderboard: { w: 970, h: 90 },
  // Tall horizontal banner typically mid-article.
  billboard: { w: 970, h: 250 },
  // Sidebar rectangle.
  rectangle: { w: 300, h: 250 },
  // Mobile small banner.
  mobile: { w: 320, h: 50 },
  // Default fallback.
  default: { w: 728, h: 90 },
};

/*
 * Generic advertisement placeholder – static image until a real ad-server is
 * wired up. Supported variants mirror common IAB sizes used by TheHindu.com.
 */

// Wrapper – we use transient props ($w / $h) so they are not forwarded to the
// underlying DOM element.
const AdPlaceholderVisual = styled.div`
  width: ${(props) => props.$w}px;
  height: ${(props) => props.$h}px;
  max-width: 100%;
  background-color: #f0f0f0; // Light gray background
  border: 1px solid #cccccc;   // Subtle border
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #777777;           // Medium gray text
  font-size: 1rem;          // Adjust as needed, e.g., 14px, 16px
  box-sizing: border-box;   // Ensures padding/border are within width/height
  overflow: hidden;         // Prevents text overflow if too long
`;

// Wrapper for centering and margins
const AdWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 25px 0;
`;

const AdBanner = ({ variant = 'leaderboard', className }) => {
  const size = sizeMap[variant] || sizeMap.default;
  const { w, h } = size;
  // const placeholderUrl = `https://via.placeholder.com/${w}x${h}?text=Advertisement`; // No longer needed

  return (
    <AdWrapper className={className}>
      <AdPlaceholderVisual $w={w} $h={h}>
        Advertisement ({w}x{h})
      </AdPlaceholderVisual>
    </AdWrapper>
  );
};

export default AdBanner;
