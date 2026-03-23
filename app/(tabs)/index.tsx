import React, { useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Platform,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { SearchBar } from '../../components/ui/SearchBar';
import { HomeBanner } from '../../components/home/HomeBanner';
import { CategoryList } from '../../components/home/CategoryList';
import { FeaturedProducts } from '../../components/home/FeaturedProducts';
import Colors from '../../constants/colors';
import { products } from '../../mocks/products';
import { categories } from '../../mocks/categories';
import { BANNER_IMAGES } from '../../constants/images';
import FeaturedCategories from '../../components/home/FeaturedCategories';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/explore',
        params: { query: searchQuery },
      });
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const newArrivals = [...products].sort(() => 0.5 - Math.random()).slice(0, 5);
  const trending = [...products].sort(() => 0.5 - Math.random()).slice(0, 5);
  const discounted = products.filter((p) => p.discount).slice(0, 5);

  return (
    <>
      {/* Ẩn header mặc định */}
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

        {/* Tiêu đề Trang chủ + Tìm kiếm */}
        <View style={styles.searchWrapper}>
          <Text style={styles.title}>Trang chủ</Text>
      
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <HomeBanner
            title="Bộ sưu tập mùa hè"
            subtitle="Giảm đến 50% cho các mặt hàng được chọn"
            buttonText="Mua ngay"
            imageUrl={BANNER_IMAGES.summerCollection}
            link="/product/category/t-shirts"
          />

          <FeaturedCategories />

          <FeaturedProducts
            title="Hàng mới về"
            products={newArrivals}
            viewAllLink="/explore?filter=new"
          />

          <FeaturedProducts
            title="Xu hướng hiện nay"
            products={trending}
            viewAllLink="/explore?filter=trending"
          />

          {discounted.length > 0 && (
            <FeaturedProducts
              title="Đang giảm giá"
              products={discounted}
              viewAllLink="/explore?filter=sale"
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : StatusBar.currentHeight ?? 8,
    paddingBottom: 6,
    backgroundColor: Colors.white,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  searchBar: {
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    height: 44,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 0,
  },
});
