import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { getOptimizedImageSource } from '../../utils/imageUtils';

interface ProductGalleryProps {
  images: string[];
}

const { width } = Dimensions.get('window');

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  return (
    <View style={styles.container}>
      {images.length > 0 && (
        <Image
          source={getOptimizedImageSource(images[0], 'large')}
          style={styles.mainImage}
          contentFit="cover"
          transition={300}
        />
      )}
      {/* Optionally render thumbnails */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  mainImage: {
    width: width,
    height: width,
    backgroundColor: '#f2f2f2',
  },
});
