/**
 * Dynamically cycles through available background images for site sections.
 */

export const backgroundImages = [
  "/images/backgrounds/1.jpg", // bottom right
  "/images/backgrounds/2.jpg", // left center
  "/images/backgrounds/3.jpg", // right center
];

export const getSectionBackground = (index: number) => {
  if (backgroundImages.length === 0) return undefined;
  return backgroundImages[index % backgroundImages.length];
};

export const sectionBackgroundStyle = (imagePath: string | undefined) => {
  if (!imagePath) return { backgroundColor: '#ffffff' };
  
  const isImage1 = imagePath.endsWith('1.jpg');
  const isImage2 = imagePath.endsWith('2.jpg');

  return {
    backgroundColor: '#ffffff',
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(${imagePath})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: isImage2 ? 'left center' : (isImage1 ? 'right bottom' : 'right center'),
    backgroundSize: '1800px auto', 
    backgroundAttachment: 'scroll',
  } as React.CSSProperties;
};
