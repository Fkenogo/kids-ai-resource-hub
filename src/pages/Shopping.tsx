
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { ProductGrid } from '@/components/shopping/ProductGrid';
import { ShoppingFilters } from '@/components/shopping/ShoppingFilters';
import { ShoppingHeader } from '@/components/shopping/ShoppingHeader';
import { CartSidebar } from '@/components/shopping/CartSidebar';
import { mockProducts } from '@/data/shoppingData';
import { Product, ShoppingFilters as FilterType, SortOption, CartItem } from '@/types/shopping';

const Shopping = () => {
  const [products] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [filters, setFilters] = useState<FilterType>({
    categories: [],
    priceRange: [0, 200],
    ageRanges: [],
    priceTypes: [],
    inStockOnly: false,
    minRating: 0,
    searchQuery: ''
  });
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const applyFilters = (newFilters: FilterType) => {
    let filtered = products.filter(product => {
      // Category filter
      if (newFilters.categories.length > 0 && !newFilters.categories.includes(product.category)) {
        return false;
      }
      
      // Price range filter
      if (product.price < newFilters.priceRange[0] || product.price > newFilters.priceRange[1]) {
        return false;
      }
      
      // Price type filter
      if (newFilters.priceTypes.length > 0 && !newFilters.priceTypes.includes(product.priceType)) {
        return false;
      }
      
      // Stock filter
      if (newFilters.inStockOnly && !product.inStock) {
        return false;
      }
      
      // Rating filter
      if (product.rating < newFilters.minRating) {
        return false;
      }
      
      // Search query filter
      if (newFilters.searchQuery && !product.title.toLowerCase().includes(newFilters.searchQuery.toLowerCase()) &&
          !product.description.toLowerCase().includes(newFilters.searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    });

    // Apply sorting
    switch (sortOption) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        // Featured first, then by rating
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
    }

    setFilteredProducts(filtered);
  };

  const handleFiltersChange = (newFilters: FilterType) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortOption(newSort);
    applyFilters(filters);
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <ShoppingHeader 
          cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          onCartClick={() => setIsCartOpen(true)}
          onSearch={(query) => handleFiltersChange({ ...filters, searchQuery: query })}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <ShoppingFilters 
                filters={filters}
                onFiltersChange={handleFiltersChange}
                productCount={filteredProducts.length}
              />
            </div>
            
            <div className="lg:col-span-3">
              <ProductGrid 
                products={filteredProducts}
                sortOption={sortOption}
                onSortChange={handleSortChange}
                onAddToCart={addToCart}
              />
            </div>
          </div>
        </div>

        <CartSidebar 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
        />
      </div>
    </Layout>
  );
};

export default Shopping;
