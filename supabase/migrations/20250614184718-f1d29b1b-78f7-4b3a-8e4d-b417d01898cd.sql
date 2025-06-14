
-- Phase 1: Create storage buckets for various image types

-- Create a bucket for resource thumbnails, publicly readable.
INSERT INTO storage.buckets (id, name, public)
VALUES ('resource-images', 'resource-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create a bucket for product images, publicly readable.
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create a bucket for blog post images, publicly readable.
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create a bucket for user avatars, publicly readable.
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-avatars', 'user-avatars', true)
ON CONFLICT (id) DO NOTHING;


-- Phase 1.2: Set up Row Level Security (RLS) for storage objects
-- NOTE: We assume RLS is already enabled on storage.objects, as is default for Supabase.

-- Allow public read access to all our new buckets
DROP POLICY IF EXISTS "Public read access for images" ON storage.objects;
CREATE POLICY "Public read access for images"
ON storage.objects FOR SELECT
USING (
  bucket_id IN ('resource-images', 'product-images', 'blog-images', 'user-avatars')
);

-- Allow authenticated users to upload to content buckets.
DROP POLICY IF EXISTS "Authenticated users can upload content images" ON storage.objects;
CREATE POLICY "Authenticated users can upload content images"
ON storage.objects FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  bucket_id IN ('resource-images', 'product-images', 'blog-images')
);

-- Allow authenticated users to UPDATE content images.
DROP POLICY IF EXISTS "Authenticated users can update content images" ON storage.objects;
CREATE POLICY "Authenticated users can update content images"
ON storage.objects FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND
  bucket_id IN ('resource-images', 'product-images', 'blog-images')
);

-- Allow authenticated users to DELETE content images.
DROP POLICY IF EXISTS "Authenticated users can delete content images" ON storage.objects;
CREATE POLICY "Authenticated users can delete content images"
ON storage.objects FOR DELETE
USING (
  auth.uid() IS NOT NULL AND
  bucket_id IN ('resource-images', 'product-images', 'blog-images')
);

-- Allow users to manage their own avatars in the 'user-avatars' bucket.
DROP POLICY IF EXISTS "Users can manage their own avatars" ON storage.objects;
CREATE POLICY "Users can manage their own avatars"
ON storage.objects FOR ALL
USING (
  bucket_id = 'user-avatars' AND auth.uid() = owner
);
