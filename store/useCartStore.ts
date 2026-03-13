
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';

const STORAGE_KEY = '@cart_store';

interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, size: string, color: string) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  saveToStorage: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
  reset: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: (product, quantity, size, color) => {
    set((state) => {
      // Kiểm tra nếu đã có item cùng productId + size + color thì cộng dồn số lượng
      const existingIndex = state.items.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.size === size &&
          item.color === color
      );

      let newItems;
      if (existingIndex >= 0) {
        newItems = [...state.items];
        newItems[existingIndex].quantity += quantity;
      } else {
        newItems = [...state.items, { product, quantity, size, color }];
      }
      get().saveToStorage();
      return { items: newItems };
    });
  },

  removeFromCart: (productId, size, color) => {
    set((state) => {
      const newItems = state.items.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.size === size &&
            item.color === color
          )
      );
      get().saveToStorage();
      return { items: newItems };
    });
  },

  updateQuantity: (productId, size, color, quantity) => {
    set((state) => {
      const newItems = state.items.map((item) =>
        item.product.id === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      );
      get().saveToStorage();
      return { items: newItems };
    });
  },

  clearCart: () => {
    set({ items: [] });
    get().saveToStorage();
  },

  getCartTotal: () => {
    return get().items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  },

  getCartCount: () =>
    get().items.reduce((count, item) => count + item.quantity, 0),

  saveToStorage: async () => {
    try {
      const { items } = get();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Lỗi lưu giỏ hàng vào AsyncStorage:', e);
    }
  },

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const items = JSON.parse(data);
        set({ items });
      }
    } catch (e) {
      console.error('Lỗi load giỏ hàng từ AsyncStorage:', e);
    }
  },

  reset: () => {
    set({ items: [] });
    AsyncStorage.removeItem(STORAGE_KEY).catch((e) =>
      console.error('Lỗi xóa giỏ hàng trong AsyncStorage:', e)
    );
  },
}));
