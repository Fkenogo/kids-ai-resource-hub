
-- First create a system admin user in auth.users for reference
-- Note: This uses a direct INSERT which may need adjustment based on Supabase setup
DO $$
BEGIN
  -- Try to insert system user if it doesn't exist
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'system-admin@example.com',
    crypt('system-password', gen_salt('bf')),
    now(),
    null,
    null,
    '{"role": "system_admin"}',
    '{"name": "System Admin"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  ) ON CONFLICT (id) DO NOTHING;
  
  -- Create corresponding profile
  INSERT INTO public.profiles (
    id,
    username,
    display_name,
    email,
    bio,
    is_verified,
    date_joined
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'system-admin',
    'System Administrator',
    'system-admin@example.com',
    'System administrator account for managing platform resources',
    true,
    now()
  ) ON CONFLICT (id) DO NOTHING;
  
EXCEPTION WHEN others THEN
  -- If direct auth.users insert fails, let's check if we can use a different approach
  RAISE NOTICE 'Could not create system user in auth.users table: %', SQLERRM;
END $$;

-- Insert 8 new AI learning resources for kids
INSERT INTO public.resources (
  title,
  description,
  url,
  age_ranges,
  resource_type,
  cost,
  format,
  learning_outcomes,
  skills_attained,
  key_features,
  added_by,
  is_approved,
  is_featured,
  average_rating,
  review_count,
  view_count,
  like_count,
  share_count,
  save_count,
  comment_count
) VALUES 
(
  'Code.org AI for Kids',
  'This free, beginner-friendly course offers an accessible introduction to Artificial Intelligence (AI) concepts through the engaging medium of coding. It''s specifically designed for younger learners to grasp the basics of AI in a fun and interactive way.',
  'https://code.org/ai',
  ARRAY['8-10']::age_range[],
  'online_course'::resource_type,
  'free'::cost_type,
  'Online Course',
  ARRAY[
    'Children will learn the fundamental concepts of AI while simultaneously developing coding skills through the creation of mini-games and interactive projects'
  ],
  ARRAY[
    'Computational thinking skills',
    'Logical reasoning',
    'Problem-solving abilities through coding exercises related to AI'
  ],
  ARRAY[
    'Interactive coding puzzles that make learning enjoyable',
    'Fun challenges motivate students to apply their understanding of AI principles'
  ],
  '00000000-0000-0000-0000-000000000000',
  true,
  false,
  0,
  0,
  0,
  0,
  0,
  0,
  0
),
(
  'Codingal – AI Genius for Kids',
  'Codingal offers live online classes focused on Artificial Intelligence (AI) coding projects for a wide age range. These mentor-guided sessions provide personalized attention and a structured approach to learning AI through practical application.',
  'https://www.codingal.com/courses/ai-and-machine-learning/',
  ARRAY['5-7', '8-10', '11-13', '14-17']::age_range[],
  'online_course'::resource_type,
  'paid'::cost_type,
  'Online Course',
  ARRAY[
    'Participants will gain tangible AI coding skills by working on real-world style projects under the guidance of experienced mentors'
  ],
  ARRAY[
    'Programming skills specifically related to AI',
    'Enhanced creativity by applying AI in innovative ways'
  ],
  ARRAY[
    'Mentor-guided learning ensuring individual support and progress',
    'Step-by-step projects allow students to build a strong understanding of AI concepts through practical creation'
  ],
  '00000000-0000-0000-0000-000000000000',
  true,
  false,
  0,
  0,
  0,
  0,
  0,
  0,
  0
),
(
  'Kubrio AI Learning',
  'Kubrio offers a unique, gamified Artificial Intelligence (AI) learning platform tailored for teenagers. It focuses on fostering creativity through project-based learning in an engaging and interactive environment.',
  'https://www.kubrio.com/',
  ARRAY['14-17']::age_range[],
  'online_course'::resource_type,
  'paid'::cost_type,
  'Online Course',
  ARRAY[
    'Students will learn AI concepts through hands-on experience in storytelling and game development, fostering a deeper understanding of AI''s creative possibilities'
  ],
  ARRAY[
    'AI creativity by exploring AI''s potential in artistic and imaginative applications',
    'Enhanced logical thinking',
    'Project-based learning methodologies within the context of AI'
  ],
  ARRAY[
    'Project-based platform allowing students to learn by doing',
    'Self-paced accommodating individual learning speeds',
    'Highly interactive to keep learners engaged'
  ],
  '00000000-0000-0000-0000-000000000000',
  true,
  false,
  0,
  0,
  0,
  0,
  0,
  0,
  0
),
(
  'AIClub',
  'AIClub provides a comprehensive learning experience in machine learning specifically designed for teenagers. The platform offers a structured progression from basic to advanced topics, ensuring a solid understanding of key concepts.',
  'https://corp.aiclub.world/',
  ARRAY['14-17']::age_range[],
  'online_course'::resource_type,
  'paid'::cost_type,
  'Online Course',
  ARRAY[
    'Students will gain a strong foundation in data science',
    'Proficiency in Python programming for AI',
    'Comprehensive understanding of machine learning principles',
    'Ability to perform data analysis'
  ],
  ARRAY[
    'Python programming essential for data analysis and machine learning',
    'Data analysis skills',
    'Machine learning model development',
    'Feature engineering'
  ],
  ARRAY[
    'Interactive lessons make learning engaging',
    'Students work with real-world datasets providing practical experience',
    'Community discussions foster collaboration and peer learning',
    'Curriculum progresses systematically from foundational to more complex areas'
  ],
  '00000000-0000-0000-0000-000000000000',
  true,
  false,
  0,
  0,
  0,
  0,
  0,
  0,
  0
),
(
  'Tynker AI Coding',
  'Tynker offers a fun and engaging way for younger learners to get involved with Artificial Intelligence (AI) through gamified coding and AI-focused projects. The platform integrates AI concepts into its interactive programming lessons.',
  'https://www.tynker.com/',
  ARRAY['5-7', '8-10', '11-13']::age_range[],
  'online_course'::resource_type,
  'paid'::cost_type,
  'Online Course',
  ARRAY[
    'Students will be able to develop practical AI-based projects using Python, gaining hands-on experience in applying AI principles'
  ],
  ARRAY[
    'Python programming language used in AI',
    'AI application design by creating AI-powered projects'
  ],
  ARRAY[
    'AI-driven programming lessons that introduce AI concepts in an age-appropriate manner',
    'Gamified coding and AI-focused projects'
  ],
  '00000000-0000-0000-0000-000000000000',
  true,
  false,
  0,
  0,
  0,
  0,
  0,
  0,
  0
),
(
  'Studyable',
  'Studyable is an innovative AI-powered platform designed to enhance students'' learning efficiency. It utilizes artificial intelligence to generate personalized quizzes, flashcards, and comprehensive study guides from any text input, helping students to actively engage with their learning material.',
  'https://studyable.app/',
  ARRAY['8-10', '11-13', '14-17']::age_range[],
  'interactive_tool'::resource_type,
  'freemium'::cost_type,
  'Interactive Tool',
  ARRAY[
    'Users will experience improved study efficiency by leveraging AI-powered revision tools that adapt to their learning needs and help reinforce understanding'
  ],
  ARRAY[
    'Improved critical thinking skills by engaging with AI-generated questions',
    'Enhanced memory retention through the use of flashcards',
    'Active recall strategies facilitated by the platform'
  ],
  ARRAY[
    'AI-generated quizzes tailored to the learning content',
    'Interactive learning tools like flashcards aid in memorization',
    'Personalized study materials created based on specific text provided by the user'
  ],
  '00000000-0000-0000-0000-000000000000',
  true,
  false,
  0,
  0,
  0,
  0,
  0,
  0,
  0
),
(
  'BrainPOP AI',
  'BrainPOP AI is an engaging, interactive learning platform that uses the power of artificial intelligence to explain complex topics, including AI itself, through captivating animations and interactive quizzes. It aims to make learning accessible and enjoyable for young learners.',
  'https://www.brainpop.com/',
  ARRAY['8-10', '11-13', '14-17']::age_range[],
  'interactive_tool'::resource_type,
  'paid'::cost_type,
  'Interactive Tool',
  ARRAY[
    'Children will gain a solid understanding of AI and other STEM topics through the platform''s engaging and interactive content, fostering a deeper interest in these fields'
  ],
  ARRAY[
    'Better comprehension of AI concepts',
    'Enhanced problem-solving skills through interactive challenges',
    'Boosted creativity by exploring AI applications'
  ],
  ARRAY[
    'AI-driven personalized learning paths that adapt to individual student needs',
    'Engaging educational videos explain concepts clearly',
    'Interactive assessments help students test their understanding in a fun way'
  ],
  '00000000-0000-0000-0000-000000000000',
  true,
  false,
  0,
  0,
  0,
  0,
  0,
  0,
  0
),
(
  'RoboMind Academy',
  'RoboMind Academy is an online coding platform where children learn programming and fundamental Artificial Intelligence (AI) concepts by programming and guiding a virtual robot. This interactive approach makes learning both engaging and practical.',
  'https://www.robomindacademy.com/',
  ARRAY['8-10', '11-13', '14-17']::age_range[],
  'interactive_tool'::resource_type,
  'freemium'::cost_type,
  'Interactive Tool',
  ARRAY[
    'Participants will gain a foundational understanding of basic AI principles',
    'Develop programming skills',
    'Grasp core concepts of robotics through hands-on virtual robot control'
  ],
  ARRAY[
    'Coding skills by writing instructions for the robot',
    'Basic AI logic by designing the robot''s behavior',
    'Improved problem-solving abilities through coding challenges'
  ],
  ARRAY[
    'AI-powered coding exercises that adapt to the learner''s progress',
    'Interactive challenges reinforce understanding',
    'Robotics simulation environment where students can test their code in a virtual world'
  ],
  '00000000-0000-0000-0000-000000000000',
  true,
  false,
  0,
  0,
  0,
  0,
  0,
  0,
  0
);
