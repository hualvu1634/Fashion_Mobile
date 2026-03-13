import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons'; // ✅ Thay cho lucide
import Colors from '../../constants/colors';
import { CartItem as CartItemType } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { getOptimizedImageSource, getPlaceholderImage } from '../../utils/imageUtils';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCartStore();

const handleIncrement = () => {
  updateQuantity(item.product.id, item.size, item.color, item.quantity + 1);
};

const handleDecrement = () => {
  if (item.quantity > 1) {
    updateQuantity(item.product.id, item.size, item.color, item.quantity - 1);
  }
};

  return (
    <View style={styles.container}>
      <Image
        source={getOptimizedImageSource(item.product.images[0], 'small')}
        placeholder={getPlaceholderImage('product')}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>{item.product.name}</Text>
      <TouchableOpacity onPress={() => removeFromCart(item.product.id, item.size, item.color)}>
            <Feather name="trash-2" size={18} color={Colors.gray[500]} />
          </TouchableOpacity>
        </View>

        <View style={styles.details}>
          <Text style={styles.size}>Size: {item.size}</Text>
          <Text style={styles.color}>Color: {item.color}</Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity onPress={handleDecrement}>
              <Feather name="minus" size={16} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity onPress={handleIncrement}>
              <Feather name="plus" size={16} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: Colors.white,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 1,
  },
  image: {
    width: 80,
    height: 80,
    backgroundColor: Colors.gray[100],
  },
  content: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    width: '80%',
  },
  details: {
    marginTop: 8,
  },
  size: {
    fontSize: 12,
    color: Colors.gray[600],
  },
  color: {
    fontSize: 12,
    color: Colors.gray[600],
    marginBottom: 6,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
});
