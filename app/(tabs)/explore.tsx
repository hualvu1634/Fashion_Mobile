import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SearchBar } from '../../components/ui/SearchBar'; 
import { ProductCard } from '../../components/ui/ProductCard';
import { CategoryCard } from '../../components/ui/CategoryCard';
import Colors from '../../constants/colors';
import { products } from '../../mocks/products';
import { categories } from '../../mocks/categories';
import { Feather } from '@expo/vector-icons';

export default function ExploreScreen() {
  const { query, filter } = useLocalSearchParams<{ query?: string; filter?: string }>();
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [activeFilter, setActiveFilter] = useState(filter || 'all');
  const [loading, setLoading] = useState(false);
  const [showCategories, setShowCategories] = useState(!query);

  const filterOptions = [
    // { id: 'all', name: 'Tất cả' },
    // { id: 'new', name: 'Hàng mới về' },
    // { id: 'trending', name: 'Xu hướng' },
    // { id: 'sale', name: 'Đang giảm giá' },
  ];

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      setShowCategories(false);
    }
    if (filter) {
      setActiveFilter(filter);
    }
  }, [query, filter]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setShowCategories(text.length === 0);

    if (text.length > 0) {
      setLoading(true);
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleFilterPress = (filterId: string) => {
    setActiveFilter(filterId);
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  };

  const getFilteredProducts = () => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (activeFilter === 'sale') {
      filtered = filtered.filter((product) => product.discount);
    } else if (activeFilter === 'new') {
      filtered = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 4);
    } else if (activeFilter === 'trending') {
      filtered = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 6);
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

        <View style={styles.header}>
          {/* Thêm tiêu đề "Khám phá" ở góc trên bên phải */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Khám phá</Text>
          </View>

          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Tìm kiếm sản phẩm..."
            style={styles.searchBar}
            onClear={() => setSearchQuery('')}
          />

          <FlatList
            data={filterOptions}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === item.id && styles.activeFilterButton,
                ]}
                onPress={() => handleFilterPress(item.id)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === item.id && styles.activeFilterText,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : showCategories ? (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.categoriesContainer}
            renderItem={({ item }) => (
              <CategoryCard category={item} style={styles.categoryCard} />
            )}
            ListHeaderComponent={
              <Text style={styles.sectionTitle}>Danh mục sản phẩm</Text>
            }
          />
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.productsContainer}
            renderItem={({ item }) => (
              <ProductCard product={item} style={styles.productCard} />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
                <Text style={styles.emptySubtext}>
                  Thử với từ khóa hoặc bộ lọc khác
                </Text>
              </View>
            }
            ListHeaderComponent={
              filteredProducts.length > 0 ? (
                <View style={styles.resultsHeader}>
                  <Text style={styles.resultsText}>
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'kết quả' : 'kết quả'}
                  </Text>
                  <TouchableOpacity style={styles.sortButton}>
                    <Feather name="filter" size={18} color={Colors.text} />
                    <Text style={styles.sortText}>Sắp xếp</Text>
                  </TouchableOpacity>
                </View>
              ) : null
            }
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.white 
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 8,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start', 
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  searchBar: { 
    marginBottom: 8,
  },
  filterList: { 
    paddingRight: 8 
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    marginRight: 8,
  },
  activeFilterButton: { 
    backgroundColor: Colors.primary 
  },
  filterText: { 
    fontSize: 14, 
    color: Colors.gray[700] 
  },
  activeFilterText: { 
    color: Colors.white, 
    fontWeight: '500' 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  categoriesContainer: { 
    padding: 16 
  },
  categoryCard: { 
    flex: 1, 
    marginHorizontal: 8 
  },
  productsContainer: { 
    padding: 16 
  },
  productCard: { 
    flex: 1, 
    marginHorizontal: 8 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
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
    marginBottom: 8 
  },
  emptySubtext: { 
    fontSize: 14, 
    color: Colors.gray[500], 
    textAlign: 'center' 
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsText: { 
    fontSize: 14, 
    color: Colors.gray[600] 
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sortText: { 
    fontSize: 14, 
    color: Colors.text, 
    marginLeft: 4 
  },
});