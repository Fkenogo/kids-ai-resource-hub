
-- Insert the Build a Chatbot resource into the resources table
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
  'Build a Chatbot',
  'This project involves creating your own Artificial Intelligence (AI) powered chatbot. Using visual programming tools like Scratch (for younger learners at https://scratch.mit.edu/) or platforms like Google Dialogflow (for more advanced features at https://dialogflow.com/), participants can learn the basics of natural language processing and build interactive conversational agents.',
  'https://scratch.mit.edu/',
  ARRAY['8-10', '11-13', '14-17']::age_range[],
  'activity'::resource_type,
  'free'::cost_type,
  'Activity',
  ARRAY[
    'Highly interactive, allowing for immediate feedback and experimentation',
    'Educational: teaches fundamental concepts of natural language processing',
    'Optional advanced integration with Google Dialogflow (may incur costs)'
  ],
  ARRAY[
    'Develop coding skills (especially in Scratch)',
    'Learn about natural language processing principles'
  ],
  ARRAY[
    'Understand how AI chatbots work',
    'Gain practical experience in building simple conversational AI systems'
  ],
  '/lovable-uploads/3c8c14c9-d8fd-4bfc-816e-2e45f35889ad.png',
  (SELECT id FROM profiles LIMIT 1),
  true
);
