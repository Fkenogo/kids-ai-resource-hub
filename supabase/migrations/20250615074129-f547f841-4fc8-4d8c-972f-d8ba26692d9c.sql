
-- Insert the Create & Learn AI Explorers resource
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
  'Create & Learn AI Explorers',
  'This is a structured online course designed to introduce young learners to the exciting world of Artificial Intelligence (AI). Through engaging, hands-on projects, children will learn fundamental AI concepts and develop practical skills. The curriculum is designed to be interactive and fun, making learning about complex topics accessible and enjoyable.',
  'https://www.create-learn.us/ai-explorers/',
  ARRAY['8-10', '11-13']::age_range[],
  'online_course'::resource_type,
  'paid'::cost_type,
  'Course',
  ARRAY[
    'Live instructor-led classes provide real-time guidance and support',
    'Interactive challenges and projects encourage active learning and application of concepts'
  ],
  ARRAY[
    'Students will gain skills in basic AI coding',
    'Learn about image recognition technology',
    'Understand the principles behind chatbot design'
  ],
  ARRAY[
    'By the end of the course, children will be able to build their own AI projects',
    'Understand the ethical considerations surrounding AI',
    'Have a solid foundation for further exploration in the field'
  ],
  '/lovable-uploads/97561b01-10af-4d31-8a28-0c165a818c6e.png',
  (SELECT id FROM profiles LIMIT 1),
  true
);
