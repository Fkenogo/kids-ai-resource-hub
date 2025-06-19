
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, Filter } from 'lucide-react';

interface ShoppingHeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onSearch: (query: string) => void;
}

export const ShoppingHeader = ({ cartItemCount, onCartClick, onSearch }: ShoppingHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="bg-white border-b border-border sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold brand-gradient-text mb-2">AI Learning Shop</h1>
            <p className="text-brand-secondary">Discover the best AI learning resources for kids</p>
          </div>
          
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-secondary h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 border-brand-purple/20 focus:border-brand-purple focus:ring-brand-purple/20"
              />
            </form>
            
            <Button 
              variant="outline" 
              onClick={onCartClick} 
              className="relative border-brand-purple/20 hover:bg-brand-purple/5 text-brand-purple"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Cart</span>
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-brand-purple"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
