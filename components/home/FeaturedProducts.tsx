import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ProductCard } from '../../components/ui/ProductCard';
import { Link } from 'expo-router';
import { Product } from '../../types';
import Colors from '../../constants/colors';

interface FeaturedProductsProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  title,
  products,
  viewAllLink,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {viewAllLink && (
          <Link href={viewAllLink as any} asChild>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </Link>
        )}
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard product={item} size="small" />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  viewAll: {
    fontSize: 14,
    color: Colors.primary,
  },
  listContent: {
    paddingLeft: 16,
    paddingRight: 8,
    gap: 12,
  },
});
