
-- Insert the ABCs of Artificial Intelligence resource
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
  'ABCs of Artificial Intelligence',
  'This book is designed to introduce young children to the vocabulary of Artificial Intelligence (AI) in a playful and engaging manner. It uses colorful illustrations and simple language to make new and sometimes complex terms accessible to early readers.',
  'https://newbookrecommendation.com/books-on-ai-for-kids-an-essential-guide-for-young-learners/',
  ARRAY['5-7', '8-10']::age_range[],
  'book'::resource_type,
  'paid'::cost_type,
  'Book',
  ARRAY[
    'Richly illustrated to capture children''s attention',
    'Uses simple and age-appropriate language to explain AI terms'
  ],
  ARRAY[
    'Develop reading skills',
    'Improve comprehension of new words related to AI'
  ],
  ARRAY[
    'Young learners will become familiar with basic AI vocabulary',
    'Laying an early foundation for understanding future AI concepts'
  ],
  '/lovable-uploads/eeb9f173-b879-40a7-9701-ce4bb199d5b0.png',
  (SELECT id FROM profiles LIMIT 1),
  true
);

