import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons'; 
import { CartItem } from '../../components/cart/CartItem';
import { CartSummary } from '../../components/cart/CartSummary';
import Button from '../../components/ui/Button';
import Colors from '../../constants/colors';
import { useCartStore } from '../../store/useCartStore'; 

export default function CartScreen() {
  const router = useRouter();
  const { items, getCartTotal } = useCartStore();

  const handleBack = () => {
    router.back();
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 5 : 0; // hoặc 0 nếu cart rỗng
  const total = subtotal + shipping;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giỏ hàng</Text>
        <Feather name="shopping-bag" size={24} color={Colors.primary} />
      </View>

      {/* Cart Items */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có sản phẩm gì ở giỏ hàng</Text>
          </View>
        ) : (
          items.map((item) => (
            <CartItem key={item.product.id + item.size + item.color} item={item} />
          ))
        )}
      </ScrollView>

      {/* Footer */}
      {items.length > 0 && (
        <View style={styles.footer}>
          <CartSummary
            subtotal={subtotal}
            shipping={shipping}
            total={total}
          />
          <Button title="Thanh toán" onPress={handleCheckout} fullWidth />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120, // để tránh bị footer che
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray[500],
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    backgroundColor: Colors.white,
  },
});