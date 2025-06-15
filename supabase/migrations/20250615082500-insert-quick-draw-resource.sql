
-- Insert the Quick, Draw! (Google) resource
INSERT INTO public.resources (
  title,
  description,
  url,
  age_ranges,
  resource_type,
  cost,
  format,
  key_features,
  skills_attained,
  learning_outcomes,
  image_url,
  added_by,
  is_approved
) VALUES (
  'Quick, Draw! (Google)',
  'Quick, Draw! is a fun and engaging online game developed by Google that challenges users to draw a given object within 20 seconds, while an Artificial Intelligence (AI) tries to guess what it is. This game provides a playful introduction to how AI recognizes patterns and learns from user input.',
  'https://quickdraw.withgoogle.com/',
  ARRAY['5-7', '8-10', '11-13', '14-17']::age_range[],
  'game'::resource_type,
  'free'::cost_type,
  'Game',
  ARRAY[
    'Highly interactive and easy to play for all ages',
    'A fun way to see AI in action'
  ],
  ARRAY[
    'Enhanced creativity through drawing',
    'Development of pattern recognition skills'
  ],
  ARRAY[
    'Gain a basic understanding of how AI recognizes objects from visual patterns'
  ],
  '/lovable-uploads/23f62d14-7f28-4ea8-a2b7-baac6b7be262.png',
  (SELECT id FROM profiles LIMIT 1),
  true
);
