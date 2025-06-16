
-- Check existing constraints and add only the missing ones
-- First, let's try to add the foreign key constraints that might be missing

-- Try to add foreign key constraint for resource_comments to profiles (this might be missing)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'resource_comments_user_id_fkey'
    ) THEN
        ALTER TABLE public.resource_comments 
        ADD CONSTRAINT resource_comments_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Try to add foreign key constraint for resource_reviews to resources (this might be missing)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'resource_reviews_resource_id_fkey'
    ) THEN
        ALTER TABLE public.resource_reviews 
        ADD CONSTRAINT resource_reviews_resource_id_fkey 
        FOREIGN KEY (resource_id) REFERENCES public.resources(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Try to add foreign key constraint for resource_comments to resources (this might be missing)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'resource_comments_resource_id_fkey'
    ) THEN
        ALTER TABLE public.resource_comments 
        ADD CONSTRAINT resource_comments_resource_id_fkey 
        FOREIGN KEY (resource_id) REFERENCES public.resources(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Enable RLS on both tables (safe to run multiple times)
ALTER TABLE public.resource_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_comments ENABLE ROW LEVEL SECURITY;

-- Add RLS policies (using IF NOT EXISTS to avoid conflicts)
DO $$ 
BEGIN
    -- RLS policies for resource_reviews
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'resource_reviews' AND policyname = 'Anyone can view reviews'
    ) THEN
        EXECUTE 'CREATE POLICY "Anyone can view reviews" ON public.resource_reviews FOR SELECT USING (true)';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'resource_reviews' AND policyname = 'Authenticated users can create reviews'
    ) THEN
        EXECUTE 'CREATE POLICY "Authenticated users can create reviews" ON public.resource_reviews FOR INSERT WITH CHECK (auth.uid() = user_id)';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'resource_reviews' AND policyname = 'Users can update their own reviews'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can update their own reviews" ON public.resource_reviews FOR UPDATE USING (auth.uid() = user_id)';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'resource_reviews' AND policyname = 'Users can delete their own reviews'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can delete their own reviews" ON public.resource_reviews FOR DELETE USING (auth.uid() = user_id)';
    END IF;

    -- RLS policies for resource_comments
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'resource_comments' AND policyname = 'Anyone can view comments'
    ) THEN
        EXECUTE 'CREATE POLICY "Anyone can view comments" ON public.resource_comments FOR SELECT USING (true)';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'resource_comments' AND policyname = 'Authenticated users can create comments'
    ) THEN
        EXECUTE 'CREATE POLICY "Authenticated users can create comments" ON public.resource_comments FOR INSERT WITH CHECK (auth.uid() = user_id)';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'resource_comments' AND policyname = 'Users can update their own comments'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can update their own comments" ON public.resource_comments FOR UPDATE USING (auth.uid() = user_id)';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'resource_comments' AND policyname = 'Users can delete their own comments'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can delete their own comments" ON public.resource_comments FOR DELETE USING (auth.uid() = user_id)';
    END IF;
END $$;
