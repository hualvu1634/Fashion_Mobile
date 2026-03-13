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
import { useNotificationsStore } from '../store/useNotificationsStore';
import { Feather } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, markAsRead, deleteNotification } = useNotificationsStore();

  return (
    <>
      {/* Ẩn header mặc định để đảm bảo không có tiêu đề nào từ Expo Router */}
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Thông báo</Text>
        </View>

        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.notificationCard, !item.isRead && styles.unread]}>
              <View style={styles.notificationInfo}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationDate}>{item.date}</Text>
              </View>
              <View style={styles.notificationActions}>
                {!item.isRead && (
                  <TouchableOpacity onPress={() => markAsRead(item.id)}>
                    <Feather name="check" size={20} color={Colors.primary} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => deleteNotification(item.id)} style={styles.actionIcon}>
                  <Feather name="trash-2" size={20} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="bell" size={64} color={Colors.gray[300]} />
              <Text style={styles.emptyText}>Không có thông báo</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginLeft: 16,
  },
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
  notificationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    marginBottom: 16,
  },
  unread: {
    backgroundColor: Colors.primary + '20',
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  notificationMessage: {
    fontSize: 14,
    color: Colors.gray[600],
    marginTop: 4,
  },
  notificationDate: {
    fontSize: 14,
    color: Colors.gray[600],
    marginTop: 4,
  },
  notificationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionIcon: {
    padding: 4,
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