import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'; // ✅ Thay cho lucide
import Colors from '../../constants/colors';

interface ColorSelectorProps {
  colors: string[];
  selectedColor: string | null;
  onSelectColor: (color: string) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onSelectColor,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Color</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorCircle,
              { backgroundColor: color },
              selectedColor === color && styles.selected,
            ]}
            onPress={() => onSelectColor(color)}
          >
            {selectedColor === color && (
              <Feather name="check" size={14} color={Colors.white} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 12 },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selected: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
});
