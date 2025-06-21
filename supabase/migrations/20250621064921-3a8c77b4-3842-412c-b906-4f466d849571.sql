
-- Add the missing is_pinned column to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN is_pinned BOOLEAN DEFAULT false;

-- Create an index for better performance when querying pinned posts
CREATE INDEX idx_blog_posts_pinned ON public.blog_posts(is_pinned) WHERE is_pinned = true;
