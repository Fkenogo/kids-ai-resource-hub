
import { useState } from 'react';
import { ShoppingFilters as FilterType, ProductCategory, PriceType } from '@/types/shopping';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ShoppingFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  productCount: number;
}

export const ShoppingFilters = ({ filters, onFiltersChange, productCount }: ShoppingFiltersProps) => {
  const categories: { id: ProductCategory; name: string }[] = [
    { id: 'books', name: 'Books' },
    { id: 'courses', name: 'Courses' },
    { id: 'videos', name: 'Videos' },
    { id: 'tools', name: 'Tools' },
    { id: 'games', name: 'Games' },
    { id: 'kits', name: 'Kits' }
  ];

  const priceTypes: { id: PriceType; name: string }[] = [
    { id: 'free', name: 'Free' },
    { id: 'one-time', name: 'One-time Purchase' },
    { id: 'subscription', name: 'Subscription' }
  ];

  const ageRanges = ['2-5', '5-8', '8-12', '12-16', '16+'];

  const handleCategoryChange = (category: ProductCategory, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handlePriceTypeChange = (priceType: PriceType, checked: boolean) => {
    const newPriceTypes = checked
      ? [...filters.priceTypes, priceType]
      : filters.priceTypes.filter(p => p !== priceType);
    
    onFiltersChange({ ...filters, priceTypes: newPriceTypes });
  };

  const handleAgeRangeChange = (ageRange: string, checked: boolean) => {
    const newAgeRanges = checked
      ? [...filters.ageRanges, ageRange]
      : filters.ageRanges.filter(a => a !== ageRange);
    
    onFiltersChange({ ...filters, ageRanges: newAgeRanges });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: [0, 200],
      ageRanges: [],
      priceTypes: [],
      inStockOnly: false,
      minRating: 0,
      searchQuery: filters.searchQuery
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Filters
            <Badge variant="outline">{productCount} products</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Categories */}
          <div>
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category.id, checked as boolean)
                    }
                  />
                  <label htmlFor={category.id} className="text-sm cursor-pointer">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price Range */}
          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="space-y-3">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => 
                  onFiltersChange({ ...filters, priceRange: value as [number, number] })
                }
                max={200}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Price Type */}
          <div>
            <h3 className="font-medium mb-3">Price Type</h3>
            <div className="space-y-2">
              {priceTypes.map(priceType => (
                <div key={priceType.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={priceType.id}
                    checked={filters.priceTypes.includes(priceType.id)}
                    onCheckedChange={(checked) => 
                      handlePriceTypeChange(priceType.id, checked as boolean)
                    }
                  />
                  <label htmlFor={priceType.id} className="text-sm cursor-pointer">
                    {priceType.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Age Range */}
          <div>
            <h3 className="font-medium mb-3">Age Range</h3>
            <div className="space-y-2">
              {ageRanges.map(ageRange => (
                <div key={ageRange} className="flex items-center space-x-2">
                  <Checkbox
                    id={ageRange}
                    checked={filters.ageRanges.includes(ageRange)}
                    onCheckedChange={(checked) => 
                      handleAgeRangeChange(ageRange, checked as boolean)
                    }
                  />
                  <label htmlFor={ageRange} className="text-sm cursor-pointer">
                    {ageRange} years
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Rating */}
          <div>
            <h3 className="font-medium mb-3">Minimum Rating</h3>
            <div className="space-y-3">
              <Slider
                value={[filters.minRating]}
                onValueChange={(value) => 
                  onFiltersChange({ ...filters, minRating: value[0] })
                }
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground">
                {filters.minRating} stars and above
              </div>
            </div>
          </div>

          <Separator />

          {/* Stock */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={filters.inStockOnly}
              onCheckedChange={(checked) => 
                onFiltersChange({ ...filters, inStockOnly: checked as boolean })
              }
            />
            <label htmlFor="inStock" className="text-sm cursor-pointer">
              In stock only
            </label>
          </div>

          <Button onClick={clearFilters} variant="outline" className="w-full">
            Clear All Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
