import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons'; 
import { ProductCard } from '../../../components/ui/ProductCard';
import Colors from '../../../constants/colors'; 
import { products } from '../../../mocks/products';
import { categories } from '../../../mocks/categories';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popular');
  
  const category = categories.find(cat => cat.id === id);
  const categoryProducts = products.filter(product => product.category === id);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const sortProducts = () => {
    let sorted = [...categoryProducts];
    
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sorted.sort(() => 0.5 - Math.random());
        break;
      case 'popular':
      default:
        sorted.sort((a, b) => b.rating - a.rating);
        break;
    }
    
    return sorted;
  };
  
  const sortedProducts = sortProducts();
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: category?.name || 'Category',
        }}
      />
      
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.resultsText}>
            {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'}
          </Text>
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="filter" size={18} color={Colors.text} /> 
            <Text style={styles.filterText}>Filter & Sort</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={sortedProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productsContainer}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              style={styles.productCard}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  resultsText: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 4,
  },
  productsContainer: {
    padding: 16,
  },
  productCard: {
    flex: 1,
    marginHorizontal: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
});
