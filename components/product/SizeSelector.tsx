import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '../../constants/colors';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSelectSize: (size: string) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSelectSize,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Size</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {sizes.map((size) => (
          <TouchableOpacity
            key={size}
            style={[
              styles.sizeButton,
              selectedSize === size && styles.selectedButton,
            ]}
            onPress={() => onSelectSize(size)}
          >
            <Text style={[
              styles.sizeText,
              selectedSize === size && styles.selectedText
            ]}>
              {size}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 12 },
  sizeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    marginRight: 12,
  },
  selectedButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  selectedText: {
    color: Colors.white,
  },
});
