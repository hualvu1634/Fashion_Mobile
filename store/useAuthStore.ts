import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@auth_store';

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
}

interface AuthState {
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  loadUserFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
  reset: () => void;
}

import { useCartStore } from './useCartStore';

import { useFavoritesStore } from './useFavoritesStore';
import { useOrdersStore } from './useOrdersStore';
import { useNotificationsStore } from './useNotificationsStore';


export const useAuthStore = create<AuthState>((set, get) => ({
  users: [],
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    await new Promise(resolve => setTimeout(resolve, 500));

    const { users } = get();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      const fakeToken = "fake-jwt-token-" + user.id;
      set({
        currentUser: user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      await get().saveToStorage();

      // Load data from other stores
      await Promise.all([
        useCartStore.getState().loadFromStorage(),
   
        useFavoritesStore.getState().loadFromStorage(),
        useOrdersStore.getState().loadFromStorage(),
     
      ]);

      return fakeToken;
    } else {
      set({ error: "Tài khoản mật khẩu không chính xác", isLoading: false });
      return null;
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    await new Promise(resolve => setTimeout(resolve, 500));

    const { users } = get();
    if (users.some(u => u.email === email)) {
      set({ error: "Email đã được đăng ký", isLoading: false });
      return null;
    }

    const newUser: User = {
      id: String(users.length + 1),
      name,
      email,
      password,
    };

    set({
      users: [...users, newUser],
      currentUser: newUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
    await get().saveToStorage();

    return "fake-signup-token-" + newUser.id;
  },

  logout: async () => {
   set({ currentUser: null, isAuthenticated: false, error: null, isLoading: false });
    try {
      await get().saveToStorage();

    useCartStore.getState().reset();
    useFavoritesStore.getState().reset();
    useOrdersStore.getState().reset();
    useNotificationsStore.getState().reset();
    } catch (e) {
      console.error('Lỗi xóa dữ liệu AsyncStorage khi logout:', e);
    }
  },

  loadUserFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const { users, currentUser, isAuthenticated } = JSON.parse(data);
        set({ users, currentUser, isAuthenticated, isLoading: false, error: null });
      }
    } catch (e) {
      console.error('Lỗi load user từ AsyncStorage:', e);
    }
  },

  saveToStorage: async () => {
    try {
      const { users, currentUser, isAuthenticated } = get();
      const data = JSON.stringify({ users, currentUser, isAuthenticated });
      await AsyncStorage.setItem(STORAGE_KEY, data);
    } catch (e) {
      console.error('Lỗi lưu auth store:', e);
    }
  },

  reset: () => {
    set({ users: [], currentUser: null, isAuthenticated: false, isLoading: false, error: null });
  },
}));
