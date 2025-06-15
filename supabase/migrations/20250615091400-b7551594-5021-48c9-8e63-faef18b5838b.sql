
-- Insert the iD Tech AI Camp resource into the resources table
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
  'iD Tech AI Camp',
  'iD Tech offers specialized AI and coding bootcamps designed for older kids and teenagers. These intensive programs provide hands-on experience with AI concepts, often involving advanced projects in areas like machine learning and data science. Camps may be held online or in-person.',
  'https://www.idtech.com/',
  ARRAY['11-13', '14-17']::age_range[],
  'camp'::resource_type,
  'paid'::cost_type,
  'Camp',
  ARRAY[
    'Offers both online and in-person learning options',
    'Focuses on advanced AI projects for in-depth experience'
  ],
  ARRAY[
    'Develop programming skills relevant to AI',
    'Gain knowledge of data science principles'
  ],
  ARRAY[
    'Acquire advanced AI skills through intensive, project-based learning'
  ],
  '/lovable-uploads/da608108-3c85-4e9b-acd2-d4c36fe7b486.png',
  (SELECT id FROM profiles LIMIT 1),
  true
);
