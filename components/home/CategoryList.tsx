import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { CategoryCard } from '../../components/ui/CategoryCard';
import Colors from '../../constants/colors';
import { Category } from '../../types';

interface CategoryListProps {
  title: string;
  categories: Category[];
  viewAllLink?: string;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  title,
  categories,
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
        data={categories}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <CategoryCard category={item} />
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
  },
});
