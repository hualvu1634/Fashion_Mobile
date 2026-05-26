import React, { useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { HomeBanner } from '../../components/home/HomeBanner';
import { FeaturedProducts } from '../../components/home/FeaturedProducts';
import Colors from '../../constants/colors';
import { products } from '../../mocks/products';
import { BANNER_IMAGES } from '../../constants/images';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const newArrivals = [...products].sort(() => 0.5 - Math.random()).slice(0, 8);
  const trending = [...products].sort(() => 0.5 - Math.random()).slice(0, 8);
  const discounted = products.filter((p) => p.discount).slice(0, 8);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

        <View style={styles.searchWrapper}>
          <Text style={styles.title}>Home</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <HomeBanner
            title="Summer Collection"
            subtitle="50% off on all items"
            buttonText="Shop Now"
            imageUrl={BANNER_IMAGES.summerCollection}
            link="/product/category/t-shirts"
          />

          <FeaturedProducts
            title="New Arrivals"
            products={newArrivals}
            viewAllLink="/explore?filter=new"
          />

          <FeaturedProducts
            title="Trending Now"
            products={trending}
            viewAllLink="/explore?filter=trending"
          />

          {discounted.length > 0 && (
            <FeaturedProducts
              title="On Sale"
              products={discounted}
              viewAllLink="/explore?filter=sale"
            />
          )}
        </ScrollView>

        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => router.push('/chat')}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble-ellipses" size={26} color={Colors.white} />
        </TouchableOpacity>
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
    zIndex: 100, // Đảm bảo nút luôn nổi trên ScrollView
  },
});