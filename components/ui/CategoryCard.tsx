import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  ViewStyle
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { Category } from '../../types';
import { getOptimizedImageSource, getPlaceholderImage } from '../../utils/imageUtils';

interface CategoryCardProps {
  category: Category;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
}

const { width } = Dimensions.get('window');

export const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  style,
  size = 'medium'
}) => {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/product/category/${category.id}`);
  };
  
  const getCardWidth = () => {
    switch (size) {
      case 'small':
        return (width - 48) / 2.5; // 2.5 items per row with padding
      case 'large':
        return width - 32; // Full width with padding
      case 'medium':
      default:
        return (width - 48) / 2; // 2 items per row with padding
    }
  };
  
  const getImageHeight = () => {
    switch (size) {
      case 'small':
        return 80;
      case 'large':
        return 160;
      case 'medium':
      default:
        return 120;
    }
  };
  
  const cardWidth = getCardWidth();
  const imageHeight = getImageHeight();
  
  // Determine image size based on card size
  const imageSize = size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium';
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { width: cardWidth },
        style
      ]} 
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Image
        source={getOptimizedImageSource(category.image, imageSize)}
        placeholder={getPlaceholderImage('category')}
        style={[styles.image, { height: imageHeight }]}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.name}>{category.name}</Text>
        <Text style={styles.count}>{category.productCount} items</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  image: {
    width: '100%',
    backgroundColor: Colors.gray[100],
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 2,
  },
  count: {
    fontSize: 12,
    color: Colors.gray[200],
  },
});