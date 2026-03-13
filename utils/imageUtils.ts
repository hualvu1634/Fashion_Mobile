import { Platform } from 'react-native';
import { getImageUrl as getRemoteImageUrl } from '../constants/images';

// Function to determine if we should use local or remote images
export const shouldUseRemoteImages = () => {
  // In a real app, this might check environment variables or other conditions
  return true;
};

// Helper function to get image source
export const getImageSource = (
  imageKey: string,
  options?: { width?: number; height?: number; quality?: number }
) => {
  if (shouldUseRemoteImages()) {
    return { uri: getRemoteImageUrl(imageKey, options) };
  }
  
  // For future use with local images
  // This would return require(`../assets/images/${imageKey}`)
  return { uri: imageKey };
};

// Helper function to optimize image loading
export const getOptimizedImageSource = (
  imageUrl: string,
  size: 'thumbnail' | 'small' | 'medium' | 'large' | 'original' = 'medium'
) => {
  const sizeMap = {
    thumbnail: { width: 100, quality: 70 },
    small: { width: 300, quality: 75 },
    medium: { width: 600, quality: 80 },
    large: { width: 1200, quality: 85 },
    original: {}
  };
  
  return { uri: getRemoteImageUrl(imageUrl, sizeMap[size]) };
};

// Function to handle image loading errors
export const handleImageError = (error: any, fallbackImage: string) => {
  console.warn('Image loading error:', error);
  return { uri: fallbackImage };
};

// Function to get placeholder image for loading state
export const getPlaceholderImage = (type: 'product' | 'category' | 'avatar' | 'banner') => {
  const placeholders = {
    product: 'https://via.placeholder.com/300x300/f5f5f5/cccccc?text=Loading',
    category: 'https://via.placeholder.com/300x200/f5f5f5/cccccc?text=Category',
    avatar: 'https://via.placeholder.com/100x100/f5f5f5/cccccc?text=User',
    banner: 'https://via.placeholder.com/800x400/f5f5f5/cccccc?text=Banner'
  };
  
  return { uri: placeholders[type] };
};