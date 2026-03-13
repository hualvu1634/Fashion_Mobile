import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons'; 
import { ProductGallery } from '../../components/product/ProductGallery';
import { SizeSelector } from '../../components/product/SizeSelector';
import { ColorSelector } from '../../components/product/ColorSelector';
import { QuantitySelector } from '../../components/product/QuantitySelector';
import Button from '../../components/ui/Button'; 
import { FeaturedProducts } from '../../components/home/FeaturedProducts';
import Colors from '../../constants/colors';
import { getProductById, getRelatedProducts } from '../../mocks/products';
import { useCartStore } from '../../store/useCartStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { Badge } from '../../components/ui/Badge'; 

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const product = getProductById(id);
  const { addToCart } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  if (!product) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Product not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={styles.goBackButton}
        />
      </View>
    );
  }
  
  const isProductFavorite = isFavorite(product.id);
  const relatedProducts = getRelatedProducts(product.category, product.id);
  
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      return;
    }
    
    addToCart(product, quantity, selectedSize, selectedColor);
    router.push('/cart');
  };
  
  const handleFavoritePress = () => {
    toggleFavorite(product);
  };
  
  const handleShare = () => {
    // Share functionality
  };
  
  const handleIncrement = () => {
    setQuantity(prev => Math.min(prev + 1, 10));
  };
  
  const handleDecrement = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: product.name,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleFavoritePress}
              >
                <Feather 
                  name="heart" 
                  size={24} 
                  color={isProductFavorite ? Colors.secondary : Colors.gray[700]} 
                  solid={isProductFavorite}
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleShare}
              >
                <Feather name="share-2" size={24} color={Colors.gray[700]} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ProductGallery images={product.images} />
          
          <View style={styles.infoContainer}>
            <View style={styles.brandContainer}>
              <Text style={styles.brand}>{product.brand}</Text>
              {product.discount && (
                <Badge 
                  label={`${product.discount}% OFF`} 
                  variant="secondary" 
                  size="small" 
                />
              )}
            </View>
            
            <Text style={styles.name}>{product.name}</Text>
            
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
              {product.originalPrice && (
                <Text style={styles.originalPrice}>
                  ${product.originalPrice.toFixed(2)}
                </Text>
              )}
            </View>
            
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Text 
                    key={star} 
                    style={[
                      styles.star, 
                      star <= Math.floor(product.rating) ? styles.filledStar : {}
                    ]}
                  >
                    ★
                  </Text>
                ))}
              </View>
              <Text style={styles.ratingText}>
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <Text style={styles.description}>{product.description}</Text>
            
            <View style={styles.divider} />
            
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />
            
            <ColorSelector
              colors={product.colors}
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
            />
            
            <QuantitySelector
              quantity={quantity}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />
            
            {relatedProducts.length > 0 && (
              <>
                <View style={styles.divider} />
                <FeaturedProducts
                  title="You May Also Like"
                  products={relatedProducts}
                />
              </>
            )}
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <View style={styles.priceFooter}>
            <Text style={styles.priceLabel}>Total:</Text>
            <Text style={styles.priceValue}>
              ${(product.price * quantity).toFixed(2)}
            </Text>
          </View>
          <Button
            title="Add to Cart"
            onPress={handleAddToCart}
            fullWidth
            disabled={!selectedSize || !selectedColor}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  goBackButton: {
    width: 200,
  },
  infoContainer: {
    padding: 16,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  brand: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: Colors.gray[500],
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  star: {
    fontSize: 16,
    color: Colors.gray[300],
  },
  filledStar: {
    color: Colors.warning,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray[200],
    marginVertical: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.gray[700],
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  priceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
});
