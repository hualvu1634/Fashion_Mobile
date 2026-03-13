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
    imageUrl?: string;
  }
  
  export interface Category {
    id: string;
    name: string;
    image: string;
    productCount: number;
  }
  
  export interface CartItem {
    product: Product;
    quantity: number;
    size: string;
    color: string;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    address?: Address[];
  }
  
  export interface Address {
    id: string;
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }
  
  export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    date: string;
    trackingNumber?: string;
    shippingAddress: Address;
  }