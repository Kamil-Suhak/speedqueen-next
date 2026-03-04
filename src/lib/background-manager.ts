/**
 * Background Manager Utility
 * Dynamically cycles through available background images for site sections.
 * Optimized for high-whitespace images with corner/side props.
 */

export const backgroundImages = [
  "/images/backgrounds/1.jpg", // Props on bottom right
  "/images/backgrounds/2.jpg", // Props on left center
  "/images/backgrounds/3.jpg", // Props on right center
];

export const getSectionBackground = (index: number) => {
  if (backgroundImages.length === 0) return undefined;
  return backgroundImages[index % backgroundImages.length];
};

/**
 * Returns a specific style object based on the image's layout.
 * Uses a larger fixed background-size to keep props consistent and visible
 * and an overlay to make them less intrusive.
 */
export const sectionBackgroundStyle = (imagePath: string | undefined) => {
  if (!imagePath) return { backgroundColor: '#ffffff' };
  
  const isImage1 = imagePath.endsWith('1.jpg');
  const isImage2 = imagePath.endsWith('2.jpg');

  return {
    backgroundColor: '#ffffff',
    // We add a white overlay (0.6 opacity) to make the images subtle and clean
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(${imagePath})`,
    backgroundRepeat: 'no-repeat',
    // Precise positioning for the props
    backgroundPosition: isImage2 ? 'left center' : (isImage1 ? 'right bottom' : 'right center'),
    // Increased size to 1800px as requested for better visibility
    backgroundSize: '1800px auto', 
    backgroundAttachment: 'scroll',
  } as React.CSSProperties;
};
