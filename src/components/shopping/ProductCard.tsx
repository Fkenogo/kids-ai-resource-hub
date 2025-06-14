
import { Product } from '@/types/shopping';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, ExternalLink } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  viewMode: 'grid' | 'list';
}

export const ProductCard = ({ product, onAddToCart, viewMode }: ProductCardProps) => {
  const handlePurchase = () => {
    if (product.isAffiliate && product.affiliateUrl) {
      window.open(product.affiliateUrl, '_blank');
    } else {
      onAddToCart(product);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">
          ({product.reviewCount})
        </span>
      </div>
    );
  };

  if (viewMode === 'list') {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <img 
                src={product.imageUrl} 
                alt={product.title}
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold">{product.title}</h3>
                <div className="flex items-center gap-2">
                  {product.bestseller && (
                    <Badge variant="destructive">Bestseller</Badge>
                  )}
                  {product.featured && (
                    <Badge>Featured</Badge>
                  )}
                </div>
              </div>
              
              <p className="text-muted-foreground mb-3">{product.shortDescription}</p>
              
              <div className="flex items-center gap-4 mb-3">
                {renderStars(product.rating)}
                <Badge variant="outline">{product.ageRange}</Badge>
                <Badge variant="outline">{product.category}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    ${product.price}
                    {product.priceType === 'subscription' && '/month'}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                
                <Button onClick={handlePurchase} className="flex items-center gap-2">
                  {product.isAffiliate ? (
                    <>
                      <ExternalLink className="h-4 w-4" />
                      Buy Now
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full group hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={product.imageUrl} 
            alt={product.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            {product.bestseller && (
              <Badge variant="destructive">Bestseller</Badge>
            )}
            {product.featured && (
              <Badge>Featured</Badge>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.shortDescription}
          </p>
          
          <div className="flex items-center gap-2 mb-3">
            {renderStars(product.rating)}
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">{product.ageRange}</Badge>
            <Badge variant="outline">{product.category}</Badge>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xl font-bold">
                ${product.price}
                {product.priceType === 'subscription' && '/mo'}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through ml-2">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handlePurchase} 
          className="w-full flex items-center gap-2"
          disabled={!product.inStock}
        >
          {!product.inStock ? (
            'Out of Stock'
          ) : product.isAffiliate ? (
            <>
              <ExternalLink className="h-4 w-4" />
              Buy Now
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
