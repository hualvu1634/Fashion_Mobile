import { Category } from "../types";
import { CATEGORY_IMAGES } from "../constants/images";

export const categories: Category[] = [
  {
    id: "t-shirts",
    name: "T-shirts",
    image: CATEGORY_IMAGES.tShirts,
    productCount: 120,
  },
  {
    id: "jeans",
    name: "Jeans",
    image: CATEGORY_IMAGES.jeans,
    productCount: 85,
  },
  {
    id: "dresses",
    name: "Dresses",
    image: CATEGORY_IMAGES.dresses,
    productCount: 95,
  },
  {
    id: "outerwear",
    name: "Outerwear",
    image: CATEGORY_IMAGES.outerwear,
    productCount: 65,
  },
  {
    id: "shoes",
    name: "Shoes",
    image: CATEGORY_IMAGES.shoes,
    productCount: 110,
  },
  {
    id: "accessories",
    name: "Accessories",
    image: CATEGORY_IMAGES.accessories,
    productCount: 150,
  },
  {
    id: "sweaters",
    name: "Sweaters",
    image: CATEGORY_IMAGES.sweaters,
    productCount: 70,
  },
  {
    id: "activewear",
    name: "Activewear",
    image: CATEGORY_IMAGES.activewear,
    productCount: 90,
  }
];

export const getProductCountByCategory = (categoryId: string): number => {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.productCount : 0;
};