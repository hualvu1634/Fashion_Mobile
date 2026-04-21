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

  const [phone, setPhone] = useState(''); // Thêm state lưu số điện thoại
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card'>('Cash');
  const [cardDetails, setCardDetails] = useState('');

  const subtotal = getCartTotal();
  const shippingCost = selectedShipping === 'express' ? 9.99 : 5.99;
  const total = subtotal + shippingCost;

  const handlePlaceOrder = () => {
    setError(null);

    // Kiểm tra thêm sđt
    if (!phone.trim() || !address.trim()) {
      setError('Please enter your phone number and delivery address to continue.');
      return;
    }

    if (paymentMethod === 'Card' && !cardDetails.trim()) {
      setError('Please enter your credit card information to continue.');
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
      phone: phone,     // Truyền số điện thoại vào store
      address: address, 
      items: items.map(i => ({
        productId: i.product.id,
        quantity: i.quantity,
        price: i.product.price
      }))
    });

    addNotification({
      id: Date.now().toString() + '_notif',
      title: 'Order Placed Successfully!',
      message: `Order #${orderId} worth $${total.toFixed(2)} was successfully placed at ${currentTime}.`,
      date: dateStr,
    });
    
    clearCart(); 
    router.push('/');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Checkout' }} />
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

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Feather name="map-pin" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Delivery Information</Text>
              </View>
            </View>

            {/* Input số điện thoại */}
            <TextInput
              style={[styles.textInput, { marginBottom: 12 }]}
              placeholder="Phone Number"
              placeholderTextColor={Colors.gray[400]}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            {/* Input địa chỉ */}
            <TextInput
              style={styles.textInputArea}
              placeholder="Delivery Address"
              placeholderTextColor={Colors.gray[400]}
              multiline={true}
              numberOfLines={3}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Feather name="credit-card" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Payment Method</Text>
              </View>
            </View>

            <View style={styles.paymentButtonsContainer}>
              <TouchableOpacity
                style={[styles.paymentBtn, paymentMethod === 'Cash' && styles.paymentBtnActive]}
                onPress={() => setPaymentMethod('Cash')}
              >
                <Feather name="dollar-sign" size={18} color={paymentMethod === 'Cash' ? Colors.primary : Colors.gray[500]} />
                <Text style={[styles.paymentBtnText, paymentMethod === 'Cash' && styles.paymentBtnTextActive]}>Cash</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.paymentBtn, paymentMethod === 'Card' && styles.paymentBtnActive]}
                onPress={() => setPaymentMethod('Card')}
              >
                <Feather name="credit-card" size={18} color={paymentMethod === 'Card' ? Colors.primary : Colors.gray[500]} />
                <Text style={[styles.paymentBtnText, paymentMethod === 'Card' && styles.paymentBtnTextActive]}>Credit Card</Text>
              </TouchableOpacity>
            </View>

            {paymentMethod === 'Card' && (
              <TextInput
                style={[styles.textInput, { marginTop: 12 }]}
                placeholder="Card Details"
                placeholderTextColor={Colors.gray[400]}
                value={cardDetails}
                onChangeText={setCardDetails}
              />
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Feather name="truck" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Shipping</Text>
              </View>
            </View>

            <View style={styles.optionsContainer}>
              {[
                { id: 'standard', title: 'Standard', price: 5.99, desc: '3-5 days' },
                { id: 'express', title: 'Express', price: 9.99, desc: '1-2 days' },
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping Fee</Text>
              <Text style={styles.summaryValue}>${shippingCost}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={`Place Order`}
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
    backgroundColor: Colors.white,
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
  textInputArea: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
 backgroundColor: Colors.white,    textAlignVertical: 'top',
    height: 80,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
     backgroundColor: Colors.white,
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
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
 backgroundColor: Colors.white,    padding: 12,
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