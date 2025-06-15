
-- Insert the SciShow Kids resource into the resources table
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
  'SciShow Kids',
  'SciShow Kids is a popular YouTube channel that creates fun and engaging science videos specifically for younger children. While not exclusively focused on AI, they often cover related topics and can provide an accessible introduction to scientific concepts relevant to AI in an age-appropriate manner.',
  'https://www.youtube.com/@SciShowKids',
  ARRAY['5-7', '8-10', '11-13']::age_range[],
  'video'::resource_type,
  'free'::cost_type,
  'Video',
  ARRAY[
    'Engaging videos with simple explanations',
    'Content designed for younger viewers'
  ],
  ARRAY[
    'Curiosity about science',
    'Basic scientific vocabulary (some related to AI concepts)'
  ],
  ARRAY[
    'Gain a foundational understanding of basic scientific principles that underpin AI'
  ],
  '/lovable-uploads/d653a9d4-f2ca-4a35-baae-857821def469.png',
  (SELECT id FROM profiles LIMIT 1),
  true
);
