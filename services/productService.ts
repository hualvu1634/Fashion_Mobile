import { products } from '../mocks/products';
import { Product } from '../types';

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    return new Promise((resolve) => {
      // Giả lập độ trễ khi lấy dữ liệu từ API (hoặc local mock)
      setTimeout(() => {
        resolve(products);
      }, 300);
    });
  }
};
