
export type ProductCategory = 
  | 'books'
  | 'courses'
  | 'videos'
  | 'tools'
  | 'games'
  | 'kits';

export type PriceType = 'one-time' | 'subscription' | 'free';

export interface Product {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  priceType: PriceType;
  currency: string;
  imageUrl: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount?: number;
  seller: string;
  isAffiliate: boolean;
  affiliateUrl?: string;
  ageRange: string;
  tags: string[];
  features: string[];
  requirements?: string[];
  dateAdded: string;
  bestseller?: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShoppingFilters {
  categories: ProductCategory[];
  priceRange: [number, number];
  ageRanges: string[];
  priceTypes: PriceType[];
  inStockOnly: boolean;
  minRating: number;
  searchQuery: string;
}

export type SortOption = 'newest' | 'price-low' | 'price-high' | 'rating' | 'popular';
