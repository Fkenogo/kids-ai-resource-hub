
-- Insert the Teachable Machine (Google) resource
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
  'Teachable Machine (Google)',
  'Teachable Machine is a user-friendly, web-based tool developed by Google that allows individuals, including children, to train their own Artificial Intelligence (AI) models using simple inputs like images, sounds, and poses. It provides an intuitive way to understand how machine learning works without requiring any coding knowledge.',
  'https://teachablemachine.withgoogle.com/',
  ARRAY['8-10', '11-13', '14-17']::age_range[],
  'interactive_tool'::resource_type,
  'free'::cost_type,
  'Interactive Tool',
  ARRAY[
    'Very easy to use with a visual interface',
    'Provides real-time feedback as the AI model is being trained'
  ],
  ARRAY[
    'Practical experience in data analysis by organizing input data',
    'Basics of machine learning model training'
  ],
  ARRAY[
    'Participants will grasp fundamental machine learning concepts by creating and interacting with their own AI models.'
  ],
  '/lovable-uploads/cee2308b-d52c-4676-bcfb-8c0a3de4a3ab.png',
  (SELECT id FROM profiles LIMIT 1),
  true
);
