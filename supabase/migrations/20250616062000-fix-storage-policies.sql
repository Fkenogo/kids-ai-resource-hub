
-- Clean storage policies migration
-- This replaces the previous conflicting migration

-- First, clean up any conflicting storage policies
DROP POLICY IF EXISTS "Public read access for images" ON storage.objects;
DROP POLICY IF EXISTS "Admin access to resource-images" ON storage.objects; 
DROP POLICY IF EXISTS "Authenticated access to community-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone public read images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage resource-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can manage community-images" ON storage.objects;

-- Ensure the storage buckets exist and are public
INSERT INTO storage.buckets (id, name, public)
VALUES ('resource-images', 'resource-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('community-images', 'community-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create simple, clear policies for storage.objects
-- 1. Public read access for both buckets
CREATE POLICY "Public read access to all images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id IN ('resource-images', 'community-images'));

-- 2. Admin/moderator access to resource-images bucket with proper role checking
CREATE POLICY "Admin manage resource-images"
  ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'resource-images'
    AND EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'moderator')
    )
  )
  WITH CHECK (
    bucket_id = 'resource-images'
    AND EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'moderator')
    )
  );

-- 3. Authenticated user access to community-images bucket
CREATE POLICY "Authenticated manage community-images"
  ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'community-images'
    AND auth.uid() IS NOT NULL
  )
  WITH CHECK (
    bucket_id = 'community-images'
    AND auth.uid() IS NOT NULL
  );
