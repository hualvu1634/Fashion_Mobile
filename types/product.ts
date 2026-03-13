// types/product.ts

export interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    images: string[];
    description: string;
    sizes: string[];
    colors: string[];
    rating: number;
    reviewCount: number;
    isFavorite: boolean;
    category: string;
    tags: string[];
    imageUrl?: string; // Thêm dòng này để không bị lỗi khi thiếu imageUrl
  }
  