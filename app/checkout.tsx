import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput, 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons'; 
import Button from '../components/ui/Button';
import Colors from '../constants/colors';

import { useCartStore } from '../store/useCartStore';
import { useOrdersStore } from '../store/useOrdersStore';
import { useNotificationsStore } from '../store/useNotificationsStore';

export default function CheckoutScreen() {
  const router = useRouter();

  const { items, getCartTotal, clearCart } = useCartStore();
  const { addOrder } = useOrdersStore();
  const { addNotification } = useNotificationsStore();

  const [error, setError] = useState<string | null>(null);
  const [selectedShipping, setSelectedShipping] = useState('standard');

  // --- STATE MỚI CHO ĐỊA CHỈ VÀ THANH TOÁN ---
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card'>('Cash');
  const [cardDetails, setCardDetails] = useState('');

  const subtotal = getCartTotal();
  const shippingCost = selectedShipping === 'express' ? 9.99 : 5.99;
  const total = subtotal + shippingCost;

  const handlePlaceOrder = () => {
    setError(null);

    // 1. Kiểm tra địa chỉ (Text)
    if (!address.trim()) {
      setError('Vui lòng nhập địa chỉ giao hàng để tiếp tục.');
      return;
    }

    // 2. Kiểm tra phương thức thanh toán
    if (paymentMethod === 'Card' && !cardDetails.trim()) {
      setError('Vui lòng nhập thông tin thẻ ngân hàng để tiếp tục.');
      return;
    }

    const orderId = Date.now().toString();
    const dateStr = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleString();

    addOrder({
      id: orderId,
      date: dateStr,
      status: 'Pending',
      total: total,
      items: items.map(i => ({
        productId: i.product.id,
        quantity: i.quantity,
        price: i.product.price
      }))
    });

    addNotification({
      id: Date.now().toString() + '_notif',
      title: 'Đặt hàng thành công!',
      message: `Đơn hàng #${orderId} trị giá $${total.toFixed(2)} đã được đặt thành công vào lúc ${currentTime}.`,
      date: dateStr,
    });
    
    clearCart(); 
    router.push('/');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Thanh toán' }} />
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {error && (
            <View style={styles.errorContainer}>
              <View style={styles.errorIcon}>
                 <Feather name="alert-circle" size={20} color={Colors.error} />
              </View>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* --- PHẦN 1: ĐỊA CHỈ GIAO HÀNG --- */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Feather name="map-pin" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
              </View>
            </View>

            <TextInput
              style={styles.textInputArea}
              placeholderTextColor={Colors.gray[400]}
              multiline={true}
              numberOfLines={3}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* --- PHẦN 2: PHƯƠNG THỨC THANH TOÁN --- */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Feather name="credit-card" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
              </View>
            </View>

            <View style={styles.paymentButtonsContainer}>
              <TouchableOpacity
                style={[styles.paymentBtn, paymentMethod === 'Cash' && styles.paymentBtnActive]}
                onPress={() => setPaymentMethod('Cash')}
              >
                <Feather name="dollar-sign" size={18} color={paymentMethod === 'Cash' ? Colors.primary : Colors.gray[500]} />
                <Text style={[styles.paymentBtnText, paymentMethod === 'Cash' && styles.paymentBtnTextActive]}>Tiền mặt</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.paymentBtn, paymentMethod === 'Card' && styles.paymentBtnActive]}
                onPress={() => setPaymentMethod('Card')}
              >
                <Feather name="credit-card" size={18} color={paymentMethod === 'Card' ? Colors.primary : Colors.gray[500]} />
                <Text style={[styles.paymentBtnText, paymentMethod === 'Card' && styles.paymentBtnTextActive]}>Thẻ ngân hàng</Text>
              </TouchableOpacity>
            </View>

            {paymentMethod === 'Card' && (
              <TextInput
                style={[styles.textInput, { marginTop: 12 }]}
              
                value={cardDetails}
                onChangeText={setCardDetails}
              />
            )}
          </View>

          {/* --- PHẦN 3: VẬN CHUYỂN (Giữ nguyên) --- */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Feather name="truck" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Vận chuyển</Text>
              </View>
            </View>

            <View style={styles.optionsContainer}>
              {[
                { id: 'standard', title: 'Tiêu chuẩn', price: 5.99, desc: '3-5 ngày' },
                { id: 'express', title: 'Hỏa tốc', price: 9.99, desc: '1-2 ngày' },
              ].map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.optionCard,
                    selectedShipping === method.id && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedShipping(method.id)}
                >
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>{method.title}</Text>
                    <Text style={styles.optionSubtitle}>{method.desc}</Text>
                  </View>
                  <View style={styles.optionRight}>
                    <Text style={styles.shippingPrice}>${method.price}</Text>
                    {selectedShipping === method.id && (
                      <View style={styles.checkCircle}>
                        <Feather name="check" size={14} color={Colors.white} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* --- PHẦN 4: TỔNG KẾT (Giữ nguyên) --- */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tạm tính</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
              <Text style={styles.summaryValue}>${shippingCost}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </ScrollView>

        {/* NÚT THANH TOÁN (Giữ nguyên) */}
        <View style={styles.footer}>
          <Button
            title={`Đặt hàng`}
            onPress={handlePlaceOrder}
            fullWidth
            disabled={items.length === 0} 
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error + '20',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.error + '40',
  },
  errorIcon: {
    marginRight: 10,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  section: {
    backgroundColor: Colors.white,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  // --- Style Mới cho Input và Nút Payment ---
  textInputArea: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.gray[50],
    textAlignVertical: 'top',
    height: 80,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.gray[50],
  },
  paymentButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    gap: 8,
    backgroundColor: Colors.white,
  },
  paymentBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  paymentBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[600],
  },
  paymentBtnTextActive: {
    color: Colors.primary,
  },
  // --- Giữ nguyên các Style cũ ở dưới ---
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.gray[50],
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 12,
    color: Colors.gray[600],
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shippingPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray[200],
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
});