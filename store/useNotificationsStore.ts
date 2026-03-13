import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@notifications_store';

type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
};

type NotificationsStore = {
  notifications: Notification[];
  // THÊM HÀM NÀY
  addNotification: (notification: Omit<Notification, 'isRead'>) => void;
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  saveToStorage: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
  reset: () => void;
};

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  notifications: [],

  // THÊM LOGIC NÀY
  addNotification: (notification) => {
    set((state) => {
      const newNotif = { ...notification, isRead: false };
      const newNotifications = [newNotif, ...state.notifications]; // Thêm vào đầu danh sách
      get().saveToStorage();
      return { notifications: newNotifications };
    });
  },

  markAsRead: (id: string) => {
    set((state) => {
      const newNotifications = state.notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      );
      get().saveToStorage();
      return { notifications: newNotifications };
    });
  },

  deleteNotification: (id: string) => {
    set((state) => {
      const newNotifications = state.notifications.filter((notif) => notif.id !== id);
      get().saveToStorage();
      return { notifications: newNotifications };
    });
  },

  saveToStorage: async () => {
    try {
      const { notifications } = get();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error('Lỗi lưu notifications store:', e);
    }
  },

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const notifications = JSON.parse(data);
        set({ notifications });
      }
    } catch (e) {
      console.error('Lỗi load notifications store:', e);
    }
  },

  reset: () => {
    set({ notifications: [] });
    AsyncStorage.removeItem(STORAGE_KEY).catch((e) =>
      console.error('Lỗi xóa notifications:', e)
    );
  },
}));