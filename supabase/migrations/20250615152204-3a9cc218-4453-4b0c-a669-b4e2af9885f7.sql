
-- Manually assign the "admin" role to the specified user and ensure their profile exists.
-- This is based on the user fredkenogo (user_id: d0ab7d9a-9512-4b63-9e8c-8a011e230b30)

-- 1. Insert "admin" role for the specified user
INSERT INTO public.user_roles (user_id, role)
VALUES ('d0ab7d9a-9512-4b63-9e8c-8a011e230b30', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- 2. Create a profile if it doesn't exist.
INSERT INTO public.profiles (id, username, email, display_name)
SELECT
  'd0ab7d9a-9512-4b63-9e8c-8a011e230b30',
  'fredkenogo',
  'fredkenogo@gmail.com',
  'Fred Kenogo'
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE id = 'd0ab7d9a-9512-4b63-9e8c-8a011e230b30'
);
