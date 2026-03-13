import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Product } from '../../types';
import Colors from '../../constants/colors';
import { getOptimizedImageSource } from '../../utils/imageUtils';
import Icon from 'react-native-vector-icons/Feather';
import { useFavoritesStore } from '../../store/useFavoritesStore';

interface ProductCardProps {
  product: Product;
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  size = 'medium',
  style,
}) => {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const isFav = isFavorite(product.id);

  const cardWidth = size === 'small' ? 140 : '48%';
  const imageHeight = size === 'small' ? 140 : 200;

  return (
    <View style={[{ width: cardWidth, position: 'relative' }, style]}>
      <Link href={`/product/${product.id}`} asChild>
        <TouchableOpacity style={styles.card}>
          <Image
            source={getOptimizedImageSource(product.images[0], 'small')}
            style={[styles.image, { height: imageHeight }]}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>
        </TouchableOpacity>
      </Link>

      {/* ❤️ Icon yêu thích */}
      <TouchableOpacity 
        style={styles.heartButton} 
        onPress={() => toggleFavorite(product)}
      >
        <Icon 
          name="heart" 
          size={20} 
          color={isFav ? Colors.secondary : Colors.gray[400]} 
          solid={isFav}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    elevation: 2,
  },
  image: {
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: Colors.gray[100],
  },
  info: {
    padding: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 6,
    elevation: 3,
  },
});
