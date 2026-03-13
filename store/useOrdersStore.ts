import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@orders_store';

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: Array<{ productId: string; quantity: number; price: number }>;
};

type OrdersStore = {
  orders: Order[];

  addOrder: (order: Order) => void;
  cancelOrder: (orderId: string) => void;

  saveToStorage: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
  reset: () => void;
};

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  orders: [
    
  ],

  addOrder: (order: Order) => {
    set((state) => {
      const newOrders = [...state.orders, order];
      get().saveToStorage();
      return { orders: newOrders };
    });
  },

  cancelOrder: (orderId: string) => {
    set((state) => {
      const newOrders = state.orders.map((order) =>
        order.id === orderId ? { ...order, status: 'Cancelled' as OrderStatus } : order
      );
      get().saveToStorage();
      return { orders: newOrders };
    });
  },

  saveToStorage: async () => {
    try {
      const { orders } = get();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Lỗi lưu orders store:', e);
    }
  },

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const rawOrders = JSON.parse(data);

        if (Array.isArray(rawOrders)) {
          const orders = rawOrders.map((o: any) => ({
            id: String(o.id),
            date: String(o.date),
            status: ['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(o.status)
              ? (o.status as OrderStatus)
              : 'Pending',
            total: Number(o.total),
            items: Array.isArray(o.items)
              ? o.items.map((item: any) => ({
                  productId: String(item.productId),
                  quantity: Number(item.quantity),
                  price: Number(item.price),
                }))
              : [],
          })) as Order[];

          set({ orders });
          return;
        }

        await AsyncStorage.removeItem(STORAGE_KEY);
        set({ orders: [] });
      }
    } catch (e) {
      console.error('Lỗi load orders store:', e);
      set({ orders: [] });
    }
  },

  reset: () => {
    set({ orders: [] });
    AsyncStorage.removeItem(STORAGE_KEY).catch((e) =>
      console.error('Lỗi xóa orders trong AsyncStorage:', e)
    );
  },
}));
