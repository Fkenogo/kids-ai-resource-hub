
-- 1. Create the 'resource-images' bucket for admin-only resource images, public read
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('resource-images', 'resource-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create the 'community-images' bucket for user-generated community images, public read
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('community-images', 'community-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. RLS Policies for storage.objects

-- Remove any old policies on storage.objects for clean slate
DROP POLICY IF EXISTS "Allow upload to all" ON storage.objects;
DROP POLICY IF EXISTS "Allow update to all" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete to all" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Admins public read resource-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage resource-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone public read community-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can manage community-images" ON storage.objects;

-- 4. Public read policy for both buckets (resource-images, community-images)
CREATE POLICY "Anyone public read images"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id IN ('resource-images', 'community-images')
  );

-- 5. Only admins/moderators can insert/update/delete objects in resource-images
CREATE POLICY "Admins can manage resource-images"
  ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'resource-images'
    AND (
      public.has_role(auth.uid(), 'admin')
      OR public.has_role(auth.uid(), 'moderator')
    )
  )
  WITH CHECK (
    bucket_id = 'resource-images'
    AND (
      public.has_role(auth.uid(), 'admin')
      OR public.has_role(auth.uid(), 'moderator')
    )
  );

-- 6. Allow any authenticated user to insert/update/delete objects in community-images
CREATE POLICY "Authenticated can manage community-images"
  ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'community-images' AND auth.uid() IS NOT NULL
  )
  WITH CHECK (
    bucket_id = 'community-images' AND auth.uid() IS NOT NULL
  );

-- (Optional: You may wish to further restrict community-images write access to only images they own,
-- let me know if you want that.)
