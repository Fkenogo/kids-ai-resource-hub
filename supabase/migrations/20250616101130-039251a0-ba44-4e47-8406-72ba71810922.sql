
-- First, let's ensure we have the foreign key relationships set up correctly
-- and that the profiles table has the right constraints

-- Make sure the foreign key constraints exist and are correct
ALTER TABLE public.resource_reviews 
DROP CONSTRAINT IF EXISTS resource_reviews_user_id_fkey;

ALTER TABLE public.resource_comments 
DROP CONSTRAINT IF EXISTS resource_comments_user_id_fkey;

-- Add the correct foreign key constraints to link to profiles
ALTER TABLE public.resource_reviews 
ADD CONSTRAINT resource_reviews_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.resource_comments 
ADD CONSTRAINT resource_comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add unique constraint to prevent duplicate reviews per user per resource
ALTER TABLE public.resource_reviews 
ADD CONSTRAINT resource_reviews_user_resource_unique 
UNIQUE (user_id, resource_id);

-- Ensure profiles table has proper constraints
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_username_unique UNIQUE (username);
