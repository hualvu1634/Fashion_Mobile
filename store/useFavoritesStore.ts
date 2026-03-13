
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';

const STORAGE_KEY = '@favorites_store';

interface FavoritesState {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;

  saveToStorage: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
  reset: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],

  toggleFavorite: (product) => {
    const exists = get().favorites.find((fav) => fav.id === product.id);
    if (exists) {
      set((state) => {
        const newFavs = state.favorites.filter((fav) => fav.id !== product.id);
        get().saveToStorage();
        return { favorites: newFavs };
      });
    } else {
      set((state) => {
        const newFavs = [...state.favorites, product];
        get().saveToStorage();
        return { favorites: newFavs };
      });
    }
  },

  isFavorite: (productId) => {
    return get().favorites.some((fav) => fav.id === productId);
  },

  saveToStorage: async () => {
    try {
      const { favorites } = get();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Lỗi lưu favorites store:', e);
    }
  },

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const favorites = JSON.parse(data);
        set({ favorites });
      }
    } catch (e) {
      console.error('Lỗi load favorites store:', e);
    }
  },

  reset: () => {
    set({ favorites: [] });
    AsyncStorage.removeItem(STORAGE_KEY).catch((e) =>
      console.error('Lỗi xóa favorites trong AsyncStorage:', e)
    );
  },
}));

// Nếu muốn reset thủ công:
export function initializeFavorites() {
  useFavoritesStore.getState().reset();
}
