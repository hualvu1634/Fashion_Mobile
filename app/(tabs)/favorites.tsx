import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  StatusBar
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ProductCard } from '../../components/ui/ProductCard'; 
import Button from '../../components/ui/Button'; 
import Colors from '../../constants/colors';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { Feather } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const { favorites } = useFavoritesStore();
  const router = useRouter();
  
  const handleContinueShopping = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      
      <View style={styles.header}>
        {/* Thêm nút quay lại */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Yêu thích</Text>
          <Text style={styles.subtitle}>
            {favorites.length} {favorites.length === 1 ? 'sản phẩm' : 'sản phẩm'}
          </Text>
        </View>
      </View>
      
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <ProductCard 
              product={item} 
              style={styles.productCard}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="heart" size={64} color={Colors.gray[300]} />
          <Text style={styles.emptyTitle}>Chưa có sản phẩm yêu thích</Text>
          <Text style={styles.emptySubtitle}>
            Lưu các sản phẩm yêu thích để xem lại sau.
          </Text>
          <Button
            title="Khám phá sản phẩm"
            onPress={handleContinueShopping}
            style={styles.continueButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray[600],
    marginTop: 4,
  },
  listContent: {
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
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: 24,
  },
  continueButton: {
    width: '80%',
  },
});