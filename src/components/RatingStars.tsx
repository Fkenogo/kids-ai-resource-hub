
import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const RatingStars = ({ 
  rating, 
  size = 'md', 
  interactive = false,
  onRatingChange
}: RatingStarsProps) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const getStarSize = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'md': return 'w-5 h-5';
      case 'lg': return 'w-6 h-6';
      default: return 'w-5 h-5';
    }
  };
  
  const renderStar = (position: number) => {
    const filled = interactive 
      ? position <= (hoverRating || rating)
      : position <= rating;
    
    return (
      <Star 
        key={position}
        className={cn(
          getStarSize(),
          filled ? 'text-yellow-500 fill-yellow-500' : 'text-muted stroke-muted',
          interactive && 'cursor-pointer transition-colors duration-200'
        )}
        onClick={() => {
          if (interactive && onRatingChange) {
            onRatingChange(position);
          }
        }}
        onMouseEnter={() => {
          if (interactive) {
            setHoverRating(position);
          }
        }}
        onMouseLeave={() => {
          if (interactive) {
            setHoverRating(0);
          }
        }}
      />
    );
  };

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map(position => renderStar(position))}
    </div>
  );
};
