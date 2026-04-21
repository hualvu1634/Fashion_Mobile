import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';

import Colors from '../constants/colors';
import { useOrdersStore } from '../store/useOrdersStore';
import { Feather } from '@expo/vector-icons';

export default function OrdersScreen() {
  const router = useRouter();
  const { orders, cancelOrder } = useOrdersStore();

  const handleCancelOrder = (orderId: string) => {
    cancelOrder(orderId);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>My Orders</Text>
        </View>

        {orders.length > 0 ? (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>Order #{item.id.slice(-6)}</Text>
                  <Text style={[styles.orderStatus, { color: item.status === 'Cancelled' ? Colors.error : Colors.primary }]}>
                    {item.status}
                  </Text>
                </View>

                <Text style={styles.detailText}>Date: {item.date}</Text>
                <Text style={styles.detailText}>Phone: {item.phone || 'N/A'}</Text>
                <Text style={styles.detailText}>Address: {item.address || 'N/A'}</Text>
                <Text style={styles.detailText}>Items: {item.items.reduce((acc, curr) => acc + curr.quantity, 0)}</Text>
                
                <View style={styles.divider} />
                
                <View style={styles.orderFooter}>
                  <Text style={styles.orderTotal}>Total: ${item.total.toFixed(2)}</Text>
                  {item.status === 'Pending' && (
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => handleCancelOrder(item.id)}
                    >
                      <Text style={styles.cancelText}>Cancel Order</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Feather name="shopping-bag" size={64} color={Colors.gray[300]} />
            <Text style={styles.emptyText}>You don't have any orders yet</Text>
          </View>
        )}
      </SafeAreaView>
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
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginLeft: 16,
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
    padding: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 12,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailText: {
    fontSize: 14,
    color: Colors.gray[600],
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray[200],
    marginVertical: 12,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  cancelButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.error,
    backgroundColor: Colors.white,
  },
  cancelText: {
    color: Colors.error,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray[500],
    marginTop: 16,
  },
});