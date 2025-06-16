
import { useState } from 'react';
import { Resource } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Star, StarIcon } from 'lucide-react';
import { m } from 'framer-motion';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useResourceReviews, useCreateReview } from '@/hooks/useSupabaseData';
import { toast } from 'sonner';

interface ResourceReviewsProps {
  resource: Resource;
}

interface ReviewWithProfile {
  id: string;
  resource_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    username?: string;
    display_name?: string;
  } | null;
}

export const ResourceReviews = ({ resource }: ResourceReviewsProps) => {
  const { isAuthenticated, user } = useAuthContext();
  const { data: reviewsData = [], refetch } = useResourceReviews(resource.id);
  const createReviewMutation = useCreateReview();
  
  const [reviewText, setReviewText] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  // Safe type conversion with better error handling
  const typedReviews: ReviewWithProfile[] = Array.isArray(reviewsData) 
    ? reviewsData.map(review => ({
        id: review.id,
        resource_id: review.resource_id,
        user_id: review.user_id,
        rating: review.rating,
        comment: review.comment,
        is_verified_purchase: review.is_verified_purchase,
        helpful_count: review.helpful_count,
        created_at: review.created_at,
        updated_at: review.updated_at,
        profiles: review.profiles && typeof review.profiles === 'object' && !('error' in review.profiles)
          ? review.profiles
          : null
      }))
    : [];
  
  // Check if user has already reviewed this resource
  const userHasReviewed = user ? typedReviews.some(review => 
    review.user_id === user.id
  ) : false;

  const handleSubmitReview = async () => {
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }

    if (!user) {
      toast.error('Please sign in to review');
      return;
    }

    if (userHasReviewed) {
      toast.error('You have already reviewed this resource');
      return;
    }
    
    try {
      await createReviewMutation.mutateAsync({
        resource_id: resource.id,
        user_id: user.id,
        rating: rating,
        comment: reviewText.trim() || null
      });
      
      setReviewText('');
      setRating(0);
      refetch();
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Error creating review:', error);
      toast.error('Failed to submit review');
    }
  };
  
  const formatReviewDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const StarRating = ({ currentRating, onRate, readonly = false }: {
    currentRating: number;
    onRate?: (rating: number) => void;
    readonly?: boolean;
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
            onClick={() => !readonly && onRate?.(star)}
            onMouseEnter={() => !readonly && setHoveredStar(star)}
            onMouseLeave={() => !readonly && setHoveredStar(0)}
          >
            <Star
              className={`h-5 w-5 ${
                star <= (hoveredStar || currentRating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <m.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-4">
        <h3 className="text-xl font-medium flex items-center gap-2">
          <StarIcon className="h-5 w-5" />
          Reviews ({typedReviews.length})
        </h3>
        
        {isAuthenticated && !userHasReviewed ? (
          <>
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <div>
                <label className="block text-sm font-medium mb-2">Your Rating</label>
                <StarRating currentRating={rating} onRate={setRating} />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Review (Optional)</label>
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this resource..."
                  className="min-h-[100px] resize-none"
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmitReview} 
                  disabled={!rating || createReviewMutation.isPending}
                >
                  {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </div>
          </>
        ) : isAuthenticated && userHasReviewed ? (
          <div className="text-center py-4 bg-muted rounded-lg">
            <p className="text-muted-foreground">You have already reviewed this resource</p>
          </div>
        ) : (
          <div className="text-center py-4 bg-muted rounded-lg">
            <p className="text-muted-foreground mb-2">Sign in to leave a review</p>
            <Button variant="outline" asChild>
              <a href="/login">Sign In</a>
            </Button>
          </div>
        )}
      </div>
      
      {typedReviews.length > 0 ? (
        <div className="space-y-6 pt-4">
          {typedReviews.map((review, index) => (
            <m.div 
              key={review.id}
              className="flex gap-4 pb-6 border-b border-border last:border-b-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Avatar>
                <div className="bg-primary text-white w-full h-full flex items-center justify-center text-lg">
                  {review.profiles?.display_name?.charAt(0).toUpperCase() || 
                   review.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              </Avatar>
              <div className="flex-grow">
                <div className="flex items-baseline justify-between mb-2">
                  <h4 className="font-medium">
                    {review.profiles?.display_name || review.profiles?.username || 'Anonymous'}
                  </h4>
                  <span className="text-sm text-muted-foreground">
                    {formatReviewDate(review.created_at)}
                  </span>
                </div>
                <div className="mb-2">
                  <StarRating currentRating={review.rating} readonly />
                </div>
                {review.comment && (
                  <p className="text-base">{review.comment}</p>
                )}
              </div>
            </m.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <StarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No reviews yet. Be the first to review this resource!</p>
        </div>
      )}
    </m.div>
  );
};
