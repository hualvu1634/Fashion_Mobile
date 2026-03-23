import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons'; 

import Colors from '../../constants/colors'; 
import { useAuthStore } from '../../store/useAuthStore';
import { getOptimizedImageSource, getPlaceholderImage } from '../../utils/imageUtils';

export default function ProfileScreen() {

  const { currentUser, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
   
  };

  const menuItems = [
    {
      id: 'orders',
      title: 'Đơn hàng của tôi',
      icon: <Feather name="shopping-bag" size={20} color={Colors.gray[700]} />,
      onPress: () => router.push('../orders'),
    },
    {
      id: 'favorites',
      title: 'Yêu thích',
      icon: <Feather name="heart" size={20} color={Colors.gray[700]} />,
      onPress: () => router.push('../favorites'),
    },
    {
      id: 'notifications',
      title: 'Thông báo',
      icon: <Feather name="bell" size={20} color={Colors.gray[700]} />,
      onPress: () => router.push('../notifications'),
    },
    {
      id: 'help',
      title: 'Trung tâm trợ giúp',
      icon: <Feather name="help-circle" size={20} color={Colors.gray[700]} />,
      onPress: () => router.push('../help-center'),
    },
  ];

  // Nếu không có currentUser (trường hợp hiếm gặp do lỗi), không render gì cả
  if (!currentUser) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Phần thông tin cá nhân */}
        <View style={styles.profileSection}>
          {currentUser.avatar ? (
            <Image
              source={getOptimizedImageSource(currentUser.avatar, 'medium')}
              placeholder={getPlaceholderImage('avatar')}
              style={styles.avatar}
              contentFit="cover"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Feather name="user" size={32} color={Colors.gray[500]} />
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{currentUser.name}</Text>
            <Text style={styles.email}>{currentUser.email}</Text>
          </View>
       
        </View>

        {/* Menu chức năng */}
        <View style={styles.menuSection}>
          {menuItems.map(item => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                {item.icon}
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Feather name="chevron-right" size={20} color={Colors.gray[400]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Nút đăng xuất */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: { flex: 1, marginLeft: 16 },
  name: { fontSize: 18, fontWeight: '600', color: Colors.text, marginBottom: 4 },
  email: { fontSize: 14, color: Colors.gray[600] },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.gray[100],
  },
  editButtonText: { fontSize: 14, color: Colors.text },
  menuSection: { paddingVertical: 8 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuItemText: { fontSize: 16, color: Colors.text, marginLeft: 12 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  logoutText: { fontSize: 16, color: Colors.error, marginLeft: 12 },
});