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
import { Stack, useRouter } from 'expo-router'; // Thêm Stack để ẩn header mặc định
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../constants/colors';
import { useOrdersStore } from '../store/useOrdersStore';
import { Feather } from '@expo/vector-icons';

export default function OrdersScreen() {
  const router = useRouter();
  const { orders, cancelOrder } = useOrdersStore();

  const handleViewDetails = (orderId: string) => {
    // Điều hướng đến màn hình chi tiết đơn hàng (chưa triển khai)
    console.log(`Xem chi tiết đơn hàng ${orderId}`);
  };

  const handleCancelOrder = (orderId: string) => {
    cancelOrder(orderId);
  };

  return (
    <>
      {/* Ẩn header mặc định để đảm bảo không có tiêu đề "Order" */}
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Đơn hàng của tôi</Text>
        </View>

        {orders.length > 0 ? (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.orderCard}>
                <Text style={styles.orderId}>Mã đơn hàng: {item.id}</Text>
                <Text style={styles.orderDate}>Ngày đặt: {item.date}</Text>
                <Text style={styles.orderStatus}>Trạng thái: {item.status}</Text>
                <Text style={styles.orderTotal}>Tổng tiền: ${item.total.toFixed(2)}</Text>
                <View style={styles.orderActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleViewDetails(item.id)}
                  >
                    <Text style={styles.actionText}>Xem chi tiết</Text>
                  </TouchableOpacity>
                  {item.status === 'Pending' && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.cancelButton]}
                      onPress={() => handleCancelOrder(item.id)}
                    >
                      <Text style={[styles.actionText, styles.cancelText]}>Hủy đơn</Text>
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
            <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào</Text>
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
  listContent: {
    padding: 16,
  },
  orderCard: {
    padding: 16,
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    marginBottom: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  orderDate: {
    fontSize: 14,
    color: Colors.gray[600],
    marginTop: 4,
  },
  orderStatus: {
    fontSize: 14,
    color: Colors.gray[600],
    marginTop: 4,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 4,
  },
  orderActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  actionText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  cancelText: {
    color: Colors.error,
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginLeft: 16,
  },
});