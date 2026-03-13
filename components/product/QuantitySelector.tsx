import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'; // ✅ Thay vì lucide
import Colors from '../../constants/colors';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  minQuantity?: number;
  maxQuantity?: number;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  minQuantity = 1,
  maxQuantity = 10,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Quantity</Text>
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={onDecrement}
          disabled={quantity <= minQuantity}
          style={[styles.button, quantity <= minQuantity && styles.disabled]}
        >
          <Feather name="minus" size={16} color={Colors.text} />
        </TouchableOpacity>

        <Text style={styles.quantity}>{quantity}</Text>

        <TouchableOpacity
          onPress={onIncrement}
          disabled={quantity >= maxQuantity}
          style={[styles.button, quantity >= maxQuantity && styles.disabled]}
        >
          <Feather name="plus" size={16} color={Colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 12 },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  button: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
  },
  disabled: {
    backgroundColor: Colors.gray[200],
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginHorizontal: 12,
  },
});
