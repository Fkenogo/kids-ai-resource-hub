
import { AgeRange, Resource, ResourceType, CostType, Review, User, Format } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'parent123',
    email: 'parent@example.com',
    dateJoined: '2023-09-15T10:30:00Z',
    isAdmin: false,
    profileBio: 'Parent of two curious kids interested in AI and technology.',
  },
  {
    id: '2',
    username: 'tech_educator',
    email: 'educator@example.com',
    dateJoined: '2023-08-20T14:15:00Z',
    isAdmin: true,
    profileBio: 'Computer science teacher with a passion for introducing AI concepts to children.',
  },
  {
    id: '3',
    username: 'ai_parent',
    email: 'aiparent@example.com',
    dateJoined: '2023-10-05T09:45:00Z',
    isAdmin: false,
    profileBio: 'Working in the AI industry and looking for resources to teach my kids.',
  },
];

export const mockResources: Resource[] = [
  // Online Courses & Platforms
  {
    id: '1',
    title: 'Create & Learn AI Explorers',
    description: 'This is a structured online course designed to introduce young learners to the exciting world of Artificial Intelligence (AI). Through engaging, hands-on projects, children will learn fundamental AI concepts and develop practical skills. The curriculum is designed to be interactive and fun, making learning about complex topics accessible and enjoyable.',
    url: 'https://www.create-learn.us/ai-explorers/',
    ageRanges: ['8-10', '11-13'],
    resourceType: 'online_course',
    format: 'Course',
    cost: 'paid',
    keyFeatures: ['Live instructor-led classes provide real-time guidance and support', 'Interactive challenges and projects encourage active learning and application of concepts', 'Project-based learning'],
    learningOutcomes: ['By the end of the course, children will be able to build their own AI projects', 'Understand the ethical considerations surrounding AI', 'Have a solid foundation for further exploration in the field'],
    skillsAttained: ['Basic AI coding', 'Image recognition technology', 'Chatbot design principles'],
    dateAdded: '2023-09-15T15:45:00Z',
    addedBy: '2',
    averageRating: 4.9,
    reviewCount: 32,
    featuredResource: true,
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2673&auto=format&fit=crop',
    viewCount: 980,
    likeCount: 412,
    shareCount: 120,
    saveCount: 203,
    commentCount: 45
  },
  {
    id: '2',
    title: 'Code.org AI for Kids',
    description: 'This free, beginner-friendly course offers an accessible introduction to Artificial Intelligence (AI) concepts through the engaging medium of coding. It\'s specifically designed for younger learners to grasp the basics of AI in a fun and interactive way.',
    url: 'https://code.org/ai',
    ageRanges: ['8-10'],
    resourceType: 'online_course',
    format: 'Course',
    cost: 'free',
    keyFeatures: ['Interactive coding puzzles that make learning enjoyable', 'Fun challenges motivate students to apply their understanding of AI principles', 'Self-paced learning'],
    learningOutcomes: ['Fundamental concepts of AI while simultaneously developing coding skills', 'Creation of mini-games and interactive projects', 'Basic understanding of AI applications'],
    skillsAttained: ['Computational thinking', 'Logical reasoning', 'Problem-solving abilities through coding exercises related to AI'],
    dateAdded: '2023-07-05T08:45:00Z',
    addedBy: '1',
    averageRating: 4.8,
    reviewCount: 37,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop',
    viewCount: 876,
    likeCount: 234,
    shareCount: 87,
    saveCount: 156,
    commentCount: 25
  },
  {
    id: '3',
    title: 'Codingal – AI Genius for Kids',
    description: 'Codingal offers live online classes focused on Artificial Intelligence (AI) coding projects for a wide age range. These mentor-guided sessions provide personalized attention and a structured approach to learning AI through practical application.',
    url: 'https://www.codingal.com/courses/ai-and-machine-learning/',
    ageRanges: ['5-7', '8-10', '11-13', '14-17'],
    resourceType: 'online_course',
    format: 'Course',
    cost: 'paid',
    keyFeatures: ['Mentor-guided learning, ensuring individual support and progress', 'Step-by-step projects for strong understanding', 'Personalized attention during live sessions'],
    learningOutcomes: ['Tangible AI coding skills through real-world style projects', 'Understanding of AI application in different domains', 'Foundation for further programming exploration'],
    skillsAttained: ['Programming skills specifically related to AI', 'Enhanced creativity by applying AI in innovative ways', 'Problem-solving through coding'],
    dateAdded: '2023-10-20T11:15:00Z',
    addedBy: '3',
    averageRating: 4.2,
    reviewCount: 45,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=2670&auto=format&fit=crop',
    viewCount: 623,
    likeCount: 142,
    shareCount: 48,
    saveCount: 89,
    commentCount: 18
  },
  
  // Books & Reading Materials
  {
    id: '4',
    title: 'ABCs of Artificial Intelligence',
    description: 'This book is designed to introduce young children to the vocabulary of Artificial Intelligence (AI) in a playful and engaging manner. It uses colorful illustrations and simple language to make new and sometimes complex terms accessible to early readers.',
    url: 'https://newbookrecommendation.com/books-on-ai-for-kids-an-essential-guide-for-young-learners/',
    ageRanges: ['5-7'],
    resourceType: 'book',
    format: 'Book',
    cost: 'paid',
    keyFeatures: ['Richly illustrated to capture children\'s attention', 'Simple and age-appropriate language to explain AI terms', 'Interactive exercises'],
    learningOutcomes: ['Familiarity with basic AI vocabulary', 'Early foundation for understanding future AI concepts', 'Increased interest in technology'],
    skillsAttained: ['Reading skills', 'Improved comprehension of new words related to AI', 'Early technology literacy'],
    dateAdded: '2023-10-20T11:15:00Z',
    addedBy: '3',
    averageRating: 4.2,
    reviewCount: 45,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=2670&auto=format&fit=crop',
    viewCount: 623,
    likeCount: 142,
    shareCount: 48,
    saveCount: 89,
    commentCount: 18
  },
  {
    id: '5',
    title: 'STEM Starters for Kids: AI Activity Book',
    description: 'This activity book provides an interactive way for older elementary and middle school children to learn about Artificial Intelligence (AI) and related STEM fields. It includes a variety of puzzles and hands-on projects designed to make learning engaging and fun.',
    url: 'https://www.skyhorsepublishing.com/9781631587283/stem-starters-for-kids-artificial-intelligence-activity-book/',
    ageRanges: ['8-10', '11-13'],
    resourceType: 'book',
    format: 'Book',
    cost: 'paid',
    keyFeatures: ['Highly interactive, encouraging active participation', 'Educational, covering fundamental concepts in AI, algorithms, and robotics', 'Variety of puzzles and challenges'],
    learningOutcomes: ['Better understanding of AI and related STEM concepts', 'Practical application of concepts through activities', 'Strengthened foundation in technology-related topics'],
    skillsAttained: ['Enhanced problem-solving abilities', 'Developed critical thinking skills', 'Basic understanding of algorithms'],
    dateAdded: '2023-08-12T14:30:00Z',
    addedBy: '2',
    averageRating: 4.6,
    reviewCount: 29,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop',
    viewCount: 1430,
    likeCount: 567,
    shareCount: 256,
    saveCount: 345,
    commentCount: 38
  },
  {
    id: '6',
    title: 'Artificial Intelligence for Babies',
    description: 'This book introduces very young children to the fundamental concepts of Artificial Intelligence (AI) using easy-to-understand language and bright, engaging illustrations. It aims to spark early curiosity about technology and how machines can learn.',
    url: 'https://www.penguin.co.nz/books/artificial-intelligence-for-babies-9781464221453',
    ageRanges: ['5-7'],
    resourceType: 'book',
    format: 'Book',
    cost: 'paid',
    keyFeatures: ['Interactive, encouraging engagement', 'Features vibrant visuals to aid understanding', 'Captures young imaginations'],
    learningOutcomes: ['Fostered curiosity in technology', 'Gentle introduction to core ideas behind artificial intelligence', 'Foundation for future technology learning'],
    skillsAttained: ['Pattern recognition skills', 'Early STEM literacy', 'Basic awareness of what AI is'],
    dateAdded: '2023-11-03T09:20:00Z',
    addedBy: '1',
    averageRating: 4.5,
    reviewCount: 18,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2669&auto=format&fit=crop',
    viewCount: 756,
    likeCount: 189,
    shareCount: 65,
    saveCount: 98,
    commentCount: 22
  },
  {
    id: '7',
    title: '20 Fables for Kids on AI',
    description: 'This book uses the engaging format of fables to teach Artificial Intelligence (AI) concepts to older children and teenagers. By presenting complex topics through relatable stories, it makes AI more accessible and thought-provoking.',
    url: 'https://rfbooks.gumroad.com/l/20-fables-for-kids-on-AI',
    ageRanges: ['11-13', '14-17'],
    resourceType: 'book',
    format: 'Book',
    cost: 'paid',
    keyFeatures: ['Story-driven learning to make concepts memorable', 'Thought-provoking narratives', 'Relatable characters and situations'],
    learningOutcomes: ['Understanding of various AI concepts through engaging storytelling', 'Making abstract ideas more concrete', 'Appreciation for the ethical dimensions of AI'],
    skillsAttained: ['Critical thinking skills', 'Fundamental AI concepts through storytelling', 'Ethical reasoning about technology'],
    dateAdded: '2023-06-15T11:30:00Z',
    addedBy: '2',
    averageRating: 4.6,
    reviewCount: 48,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1581089781785-603411fa81e5?q=80&w=2670&auto=format&fit=crop',
    viewCount: 843,
    likeCount: 256,
    shareCount: 87,
    saveCount: 142,
    commentCount: 32
  },
  
  // Interactive Tools & Apps
  {
    id: '8',
    title: 'Teachable Machine (Google)',
    description: 'Teachable Machine is a user-friendly, web-based tool developed by Google that allows individuals, including children, to train their own Artificial Intelligence (AI) models using simple inputs like images, sounds, and poses. It provides an intuitive way to understand how machine learning works without requiring any coding knowledge.',
    url: 'https://teachablemachine.withgoogle.com/',
    ageRanges: ['8-10', '11-13', '14-17'],
    resourceType: 'interactive_tool',
    format: 'Interactive Tool',
    cost: 'free',
    keyFeatures: ['Very easy to use with a visual interface', 'Real-time feedback as the AI model is being trained', 'No coding required'],
    learningOutcomes: ['Grasp fundamental machine learning concepts', 'Create and interact with AI models', 'Understand the training process of AI'],
    skillsAttained: ['Practical experience in data analysis', 'Basics of machine learning model training', 'Understanding how AI learns from examples'],
    dateAdded: '2023-10-01T10:30:00Z',
    addedBy: '2',
    averageRating: 4.7,
    reviewCount: 24,
    featuredResource: true,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2670&auto=format&fit=crop',
    viewCount: 1250,
    likeCount: 348,
    shareCount: 89,
    saveCount: 167,
    commentCount: 32
  },
  {
    id: '9',
    title: 'Cognimates (MIT)',
    description: 'Cognimates is a project from MIT that integrates robotics and Artificial Intelligence (AI) learning with the visual programming language Scratch. It allows children to program virtual and physical robots and even train their own AI models within the familiar Scratch environment.',
    url: 'https://hackidemia.github.io/cognimates-website/home/',
    ageRanges: ['8-10', '11-13'],
    resourceType: 'interactive_tool',
    format: 'Course/Tool',
    cost: 'free',
    keyFeatures: ['Visual programming with Scratch', 'Interactive tools for robot control and AI model training', 'Hands-on ML experiments'],
    learningOutcomes: ['Fundamental concepts in AI and robotics', 'Experimentation with programming and AI', 'Creating AI-powered applications'],
    skillsAttained: ['Coding skills through Scratch', 'Problem-solving by designing robot behaviors', 'AI model design and training'],
    dateAdded: '2023-09-28T13:10:00Z',
    addedBy: '3',
    averageRating: 4.4,
    reviewCount: 22,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1599687266725-0d4e8e0ed2ad?q=80&w=2670&auto=format&fit=crop',
    viewCount: 542,
    likeCount: 121,
    shareCount: 43,
    saveCount: 78,
    commentCount: 15
  },
  {
    id: '10',
    title: 'TensorFlow Playground',
    description: 'TensorFlow Playground is an interactive web tool designed for older kids and teenagers to visualize and experiment with neural networks, a fundamental concept in deep learning and Artificial Intelligence. It allows users to tweak various parameters and observe the effects on the network\'s learning process in real-time.',
    url: 'https://playground.tensorflow.org',
    ageRanges: ['14-17'],
    resourceType: 'interactive_tool',
    format: 'Interactive Tool',
    cost: 'free',
    keyFeatures: ['Real-time visual feedback showing neural network learning', 'Highly interactive adjustment of network architecture', 'Browser-based with no installation required'],
    learningOutcomes: ['Better intuition for core AI concepts', 'Understanding of neural networks and deep learning', 'Insight into how parameters affect learning'],
    skillsAttained: ['Model training and optimization', 'Foundational understanding of machine learning principles', 'Neural network functionality'],
    dateAdded: '2023-11-20T08:40:00Z',
    addedBy: '1',
    averageRating: 4.1,
    reviewCount: 17,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1677442135968-6bd86a41e5fa?q=80&w=2670&auto=format&fit=crop',
    viewCount: 704,
    likeCount: 154,
    shareCount: 67,
    saveCount: 112,
    commentCount: 21
  },
  {
    id: '11',
    title: 'Buddy.ai',
    description: 'Buddy.ai is an AI-powered voice-based learning assistant designed to help young children practice and improve their language skills through engaging conversations. The interactive AI chatbot provides a fun and supportive environment for language learning.',
    url: 'https://buddy.ai/en/',
    ageRanges: ['5-7', '8-10'],
    resourceType: 'ai_tool',
    format: 'AI Tool',
    cost: 'freemium',
    keyFeatures: ['Interactive AI chatbot responding to child\'s voice', 'Voice recognition for pronunciation feedback', 'Fun language-learning games'],
    learningOutcomes: ['Improved speaking and comprehension skills', 'Enhanced language acquisition through interactive practice', 'Confidence in verbal communication'],
    skillsAttained: ['Communication skills', 'Language skills including vocabulary and grammar', 'Pronunciation through AI feedback'],
    dateAdded: '2023-10-22T09:15:00Z',
    addedBy: '1',
    averageRating: 4.7,
    reviewCount: 31,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?q=80&w=2670&auto=format&fit=crop',
    viewCount: 925,
    likeCount: 287,
    shareCount: 134,
    saveCount: 203,
    commentCount: 28
  },
  
  // AI-Powered Games & Simulations
  {
    id: '12',
    title: 'Quick, Draw!',
    description: 'Quick, Draw! is a fun and engaging online game developed by Google that challenges users to draw a given object within 20 seconds, while an Artificial Intelligence (AI) tries to guess what it is. This game provides a playful introduction to how AI recognizes patterns and learns from user input.',
    url: 'https://quickdraw.withgoogle.com/',
    ageRanges: ['5-7', '8-10', '11-13', '14-17'],
    resourceType: 'game',
    format: 'Game',
    cost: 'free',
    keyFeatures: ['Highly interactive and easy to play for all ages', 'Fun way to see AI in action', 'Visual learning of pattern recognition'],
    learningOutcomes: ['Basic understanding of how AI recognizes objects', 'Insight into pattern matching algorithms', 'Appreciation for AI capabilities and limitations'],
    skillsAttained: ['Enhanced creativity through drawing', 'Pattern recognition by observing AI feedback', 'Understanding visual input for AI'],
    dateAdded: '2023-08-12T14:30:00Z',
    addedBy: '2',
    averageRating: 4.6,
    reviewCount: 29,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop',
    viewCount: 1430,
    likeCount: 567,
    shareCount: 256,
    saveCount: 345,
    commentCount: 38
  },
  {
    id: '13',
    title: 'AI Dungeon',
    description: 'AI Dungeon is an innovative text-based adventure game that uses Artificial Intelligence (AI) to generate dynamic and unpredictable storylines based on the player\'s input. It allows for a highly immersive and creative role-playing experience where the AI acts as a Dungeon Master, responding to user actions in unexpected ways.',
    url: 'https://aidungeon.io/',
    ageRanges: ['11-13', '14-17'],
    resourceType: 'game',
    format: 'Game',
    cost: 'freemium',
    keyFeatures: ['Interactive storytelling with AI adapting to player choices', 'Endless and unique adventure each time', 'Creative expression through narrative'],
    learningOutcomes: ['Experience AI\'s ability to generate narrative', 'Understanding of AI in creative storytelling', 'Exploration of narrative AI capabilities'],
    skillsAttained: ['Enhanced creativity through storytelling', 'Decision-making as choices influence story progression', 'Language skills through interactive dialogue'],
    dateAdded: '2023-09-05T14:20:00Z',
    addedBy: '3',
    averageRating: 4.3,
    reviewCount: 22,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=2574&auto=format&fit=crop',
    viewCount: 567,
    likeCount: 123,
    shareCount: 45,
    saveCount: 87,
    commentCount: 19
  },
  {
    id: '14',
    title: 'RoboRunner (MIT Media Lab)',
    description: 'RoboRunner is a game developed by the MIT Media Lab where children take on the role of training an Artificial Intelligence (AI) powered virtual robot to navigate through various obstacles. By providing feedback and rewards, players teach the AI how to successfully complete the challenges.',
    url: 'https://www.media.mit.edu/groups/personal-robots/overview/',
    ageRanges: ['8-10', '11-13'],
    resourceType: 'game',
    format: 'Game',
    cost: 'free',
    keyFeatures: ['Hands-on AI training with direct influence on robot behavior', 'Problem-solving tasks to optimize AI training', 'Visual learning of reinforcement concepts'],
    learningOutcomes: ['Understanding of how AI makes decisions based on training', 'Insight into reinforcement learning', 'Appreciation for iterative improvement in AI'],
    skillsAttained: ['AI training through effective feedback', 'Logical thinking for training strategy', 'Understanding of machine learning principles'],
    dateAdded: '2023-07-10T09:15:00Z',
    addedBy: '1',
    averageRating: 4.2,
    reviewCount: 19,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2670&auto=format&fit=crop',
    viewCount: 823,
    likeCount: 219,
    shareCount: 78,
    saveCount: 132,
    commentCount: 27
  },
  
  // YouTube Channels & Video Resources
  {
    id: '15',
    title: 'SciShow Kids',
    description: 'SciShow Kids is a popular YouTube channel that creates fun and engaging science videos specifically for younger children. While not exclusively focused on AI, they often cover related topics and can provide an accessible introduction to scientific concepts relevant to AI in an age-appropriate manner.',
    url: 'https://www.youtube.com/@SciShowKids',
    ageRanges: ['5-7', '8-10'],
    resourceType: 'video',
    format: 'Video',
    cost: 'free',
    keyFeatures: ['Engaging videos with simple explanations', 'Content designed for younger viewers', 'Visual learning of scientific concepts'],
    learningOutcomes: ['Foundational understanding of basic scientific principles', 'Introduction to technology concepts', 'Curiosity about how things work'],
    skillsAttained: ['Curiosity about science', 'Basic scientific vocabulary', 'Understanding of fundamental concepts'],
    dateAdded: '2023-11-03T09:20:00Z',
    addedBy: '1',
    averageRating: 4.5,
    reviewCount: 18,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2669&auto=format&fit=crop',
    viewCount: 756,
    likeCount: 189,
    shareCount: 65,
    saveCount: 98,
    commentCount: 22
  },
  {
    id: '16',
    title: 'Khan Academy AI',
    description: 'Khan Academy offers interactive lessons that explain the fundamentals of Artificial Intelligence (AI) in a way that is accessible and engaging for young learners. Their videos and activities are designed to build a strong foundational understanding of AI concepts.',
    url: 'https://www.khanacademy.org/',
    ageRanges: ['5-7', '8-10'],
    resourceType: 'online_course',
    format: 'Course',
    cost: 'free',
    keyFeatures: ['Engaging activities to reinforce learning', 'Age-appropriate content for elementary school', 'Progressive learning path'],
    learningOutcomes: ['Solid introduction to basic AI concepts', 'Foundation for further exploration', 'Understanding of technology applications'],
    skillsAttained: ['Problem-solving through interactive exercises', 'Foundational knowledge about AI', 'Digital literacy'],
    dateAdded: '2023-11-14T16:20:00Z',
    addedBy: '2',
    averageRating: 4.3,
    reviewCount: 19,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2606&auto=format&fit=crop',
    viewCount: 389,
    likeCount: 87,
    shareCount: 32,
    saveCount: 64,
    commentCount: 11
  },
  {
    id: '17',
    title: 'AI Education For All',
    description: 'This YouTube channel is specifically dedicated to making Artificial Intelligence (AI) education accessible to kids and beginners. The channel provides content that covers AI basics, offers hands-on tutorials, and explores real-world applications of AI in an easy-to-understand format.',
    url: 'https://www.youtube.com/@AIEducationForAll',
    ageRanges: ['8-10', '11-13', '14-17'],
    resourceType: 'video',
    format: 'Video',
    cost: 'free',
    keyFeatures: ['Focus on AI fundamentals', 'Hands-on tutorials for practical learning', 'Real-world examples of AI applications'],
    learningOutcomes: ['Foundational understanding of AI concepts', 'Practical knowledge of AI applications', 'Insight into AI\'s role in various fields'],
    skillsAttained: ['AI basics', 'Practical skills through tutorials', 'Understanding of AI in industry'],
    dateAdded: '2023-08-30T10:00:00Z',
    addedBy: '3',
    averageRating: 4.5,
    reviewCount: 15,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2606&auto=format&fit=crop',
    viewCount: 475,
    likeCount: 98,
    shareCount: 42,
    saveCount: 67,
    commentCount: 14
  },
  {
    id: '18',
    title: 'Google\'s AI Experiments',
    description: 'This YouTube channel showcases a collection of AI-powered experiments and interactive tools developed by Google. It provides a visual and engaging way for older kids and teenagers to see AI in action and understand its potential through practical demonstrations.',
    url: 'https://experiments.withgoogle.com/',
    ageRanges: ['11-13', '14-17'],
    resourceType: 'video',
    format: 'Video',
    cost: 'free',
    keyFeatures: ['Hands-on AI experiments viewers can try', 'Visual learning of AI capabilities', 'Real-world AI applications through innovative projects'],
    learningOutcomes: ['Understanding of real-world AI applications', 'Insight into AI development processes', 'Appreciation for cutting-edge AI technology'],
    skillsAttained: ['Insights into AI development', 'Understanding AI functionalities', 'Practical application knowledge'],
    dateAdded: '2023-09-05T14:20:00Z',
    addedBy: '3',
    averageRating: 4.3,
    reviewCount: 22,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=2574&auto=format&fit=crop',
    viewCount: 567,
    likeCount: 123,
    shareCount: 45,
    saveCount: 87,
    commentCount: 19
  },
  
  // Hands-on AI Projects & Activities
  {
    id: '19',
    title: 'Build a Chatbot (Scratch & Dialogflow)',
    description: 'This project involves creating your own Artificial Intelligence (AI) powered chatbot. Using visual programming tools like Scratch (for younger learners) or platforms like Google Dialogflow (for more advanced features), participants can learn the basics of natural language processing and build interactive conversational agents.',
    url: 'https://scratch.mit.edu/',
    ageRanges: ['8-10', '11-13', '14-17'],
    resourceType: 'activity',
    format: 'Activity',
    cost: 'free',
    keyFeatures: ['Highly interactive with immediate feedback', 'Educational introduction to natural language processing', 'Progressive difficulty options'],
    learningOutcomes: ['Understanding of how AI chatbots work', 'Practical experience building conversational AI', 'Insight into natural language processing'],
    skillsAttained: ['Coding skills (especially with Scratch)', 'Natural language processing principles', 'Conversational AI design'],
    dateAdded: '2023-10-25T14:50:00Z',
    addedBy: '3',
    averageRating: 4.8,
    reviewCount: 34,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=2671&auto=format&fit=crop',
    viewCount: 934,
    likeCount: 278,
    shareCount: 109,
    saveCount: 184,
    commentCount: 42
  },
  {
    id: '20',
    title: 'AI Art Generator (DALL·E & Deep Dream)',
    description: 'These tools allow users to explore the creative potential of Artificial Intelligence (AI) by generating images from text prompts (like DALL·E) or by applying artistic styles to uploaded photos (like Deep Dream Generator). These activities provide a fun and visual way to understand how AI can be used in creative fields.',
    url: 'https://openai.com/dall-e-2',
    ageRanges: ['5-7', '8-10', '11-13', '14-17'],
    resourceType: 'ai_tool',
    format: 'AI Tool',
    cost: 'freemium',
    keyFeatures: ['Creative generation of unique visuals', 'Highly interactive with immediate visual feedback', 'Exploration of AI\'s creative capabilities'],
    learningOutcomes: ['Understanding of AI in art creation', 'Knowledge of how machine learning models interpret visuals', 'Appreciation for AI\'s creative applications'],
    skillsAttained: ['Enhanced creativity through experimentation', 'Understanding of AI in artistic expression', 'Visual pattern recognition'],
    dateAdded: '2023-08-15T13:20:00Z',
    addedBy: '2',
    averageRating: 4.5,
    reviewCount: 26,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=2670&auto=format&fit=crop',
    viewCount: 612,
    likeCount: 145,
    shareCount: 52,
    saveCount: 94,
    commentCount: 23
  },
  {
    id: '21',
    title: 'AI4K12 Initiative',
    description: 'The AI4K12 Initiative provides a wealth of free Artificial Intelligence (AI) focused learning resources, including a variety of hands-on projects, comprehensive lesson plans, and engaging activities suitable for different age groups within the K-12 range. These materials are designed to introduce fundamental AI concepts in a practical and accessible way.',
    url: 'https://ai4k12.org/',
    ageRanges: ['8-10', '11-13', '14-17'],
    resourceType: 'curriculum',
    format: 'Curriculum',
    cost: 'free',
    keyFeatures: ['Wide range of hands-on AI experiments', 'Classroom-friendly learning materials', 'Age-appropriate activities across grades'],
    learningOutcomes: ['Solid understanding of AI concepts', 'Knowledge of real-world AI applications', 'Framework for ethical AI consideration'],
    skillsAttained: ['Fundamental AI concepts through active learning', 'Ethical AI considerations', 'Problem-solving through projects'],
    dateAdded: '2023-08-30T10:00:00Z',
    addedBy: '3',
    averageRating: 4.5,
    reviewCount: 15,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2606&auto=format&fit=crop',
    viewCount: 475,
    likeCount: 98,
    shareCount: 42,
    saveCount: 67,
    commentCount: 14
  },
  
  // AI Camps & Live Classes
  {
    id: '22',
    title: 'iD Tech AI Camp',
    description: 'iD Tech offers specialized AI and coding bootcamps designed for older kids and teenagers. These intensive programs provide hands-on experience with AI concepts, often involving advanced projects in areas like machine learning and data science. Camps may be held online or in-person.',
    url: 'https://www.idtech.com/',
    ageRanges: ['11-13', '14-17'],
    resourceType: 'camp',
    format: 'Camp',
    cost: 'paid',
    keyFeatures: ['Both online and in-person learning options', 'Advanced AI projects for in-depth experience', 'Expert instructors from the field'],
    learningOutcomes: ['Advanced AI skills through intensive learning', 'Completed projects for portfolio development', 'Foundation for future studies or career'],
    skillsAttained: ['Programming skills relevant to AI', 'Data science principles', 'Project development and presentation'],
    dateAdded: '2023-11-14T16:20:00Z',
    addedBy: '2',
    averageRating: 4.3,
    reviewCount: 19,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2606&auto=format&fit=crop',
    viewCount: 389,
    likeCount: 87,
    shareCount: 32,
    saveCount: 64,
    commentCount: 11
  },
  {
    id: '23',
    title: 'Create & Learn Webinars',
    description: 'Create & Learn offers live online discussions and interactive courses on Artificial Intelligence (AI) suitable for both kids and parents. These sessions are often led by expert instructors and include engaging projects to make learning practical and accessible.',
    url: 'https://www.create-learn.us/',
    ageRanges: ['5-7', '8-10', '11-13', '14-17'],
    resourceType: 'online_course',
    format: 'Course',
    cost: 'freemium',
    keyFeatures: ['Expert-led instruction from industry professionals', 'Interactive projects for applied learning', 'Parent-child learning opportunities'],
    learningOutcomes: ['Practical AI skills through guided projects', 'Understanding of current AI developments', 'Foundation for further exploration'],
    skillsAttained: ['Coding skills relevant to AI', 'Project management abilities', 'Collaborative learning'],
    dateAdded: '2023-11-20T08:40:00Z',
    addedBy: '1',
    averageRating: 4.1,
    reviewCount: 17,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1677442135968-6bd86a41e5fa?q=80&w=2670&auto=format&fit=crop',
    viewCount: 704,
    likeCount: 154,
    shareCount: 67,
    saveCount: 112,
    commentCount: 21
  },
  {
    id: '24',
    title: 'Teens in AI Hackathons & Webinars',
    description: 'Teens in AI is a global initiative that organizes live AI hackathons, mentorship programs, and workshops specifically for teenagers. These events provide opportunities for hands-on AI project development, collaboration, and learning from experts in the field.',
    url: 'https://teensinai.com/',
    ageRanges: ['14-17'],
    resourceType: 'activity',
    format: 'Activity',
    cost: 'free',
    keyFeatures: ['Hands-on AI project development through hackathons', 'Mentorship from AI professionals', 'Workshops covering various AI topics'],
    learningOutcomes: ['Experience building AI solutions for real problems', 'Understanding of AI development lifecycle', 'Networking within the AI community'],
    skillsAttained: ['AI development through real projects', 'Teamwork and collaboration', 'Coding skills in AI context'],
    dateAdded: '2023-07-10T09:15:00Z',
    addedBy: '1',
    averageRating: 4.2,
    reviewCount: 19,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2670&auto=format&fit=crop',
    viewCount: 823,
    likeCount: 219,
    shareCount: 78,
    saveCount: 132,
    commentCount: 27
  }
];

export const mockReviews: Review[] = [
  {
    id: '101',
    resourceId: '8',
    userId: '3',
    username: 'ai_parent',
    rating: 5,
    comment: 'My kids loved this platform! Teachable Machine made AI concepts so accessible and fun.',
    datePosted: '2023-10-15T09:30:00Z',
  },
  {
    id: '102',
    resourceId: '8',
    userId: '1',
    username: 'parent123',
    rating: 4,
    comment: 'Great tool, though some sections were a bit advanced for my 9-year-old. Perfect with some parental guidance.',
    datePosted: '2023-10-18T14:45:00Z',
  },
  {
    id: '103',
    resourceId: '1',
    userId: '3',
    username: 'ai_parent',
    rating: 5,
    comment: 'Excellent courses! The live instruction really helps keep my child engaged with AI learning.',
    datePosted: '2023-09-20T11:15:00Z',
  },
  {
    id: '104',
    resourceId: '15',
    userId: '1',
    username: 'parent123',
    rating: 4,
    comment: 'SciShow Kids has wonderful AI explainers that my 6-year-old can understand and enjoy.',
    datePosted: '2023-11-07T16:30:00Z',
  },
  {
    id: '105',
    resourceId: '22',
    userId: '3',
    username: 'ai_parent',
    rating: 5,
    comment: 'The iD Tech camp was worth every penny! My daughter learned so much about AI in just one week.',
    datePosted: '2023-08-30T10:00:00Z',
  },
];

// Helper functions for working with mock data
export const getResourceById = (id: string): Resource | undefined => {
  return mockResources.find(resource => resource.id === id);
};

export const getReviewsForResource = (resourceId: string): Review[] => {
  return mockReviews.filter(review => review.resourceId === resourceId);
};

export const getRecentResources = (count: number = 4): Resource[] => {
  return [...mockResources]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, count);
};

export const getTopRatedResources = (count: number = 4): Resource[] => {
  return [...mockResources]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, count);
};

export const getFeaturedResources = (count: number = 3): Resource[] => {
  return mockResources.filter(r => r.featuredResource).slice(0, count);
};

export const filterResources = (filters: {
  ageRanges?: AgeRange[];
  resourceTypes?: ResourceType[];
  costTypes?: CostType[];
  minRating?: number;
  recentlyAdded?: boolean;
  searchQuery?: string;
}): Resource[] => {
  let filtered = [...mockResources];
  
  // Filter by age ranges
  if (filters.ageRanges && filters.ageRanges.length > 0) {
    filtered = filtered.filter(resource => 
      resource.ageRanges.some(age => filters.ageRanges?.includes(age))
    );
  }
  
  // Filter by resource types
  if (filters.resourceTypes && filters.resourceTypes.length > 0) {
    filtered = filtered.filter(resource => 
      filters.resourceTypes?.includes(resource.resourceType)
    );
  }
  
  // Filter by cost types
  if (filters.costTypes && filters.costTypes.length > 0) {
    filtered = filtered.filter(resource => 
      filters.costTypes?.includes(resource.cost)
    );
  }
  
  // Filter by minimum rating
  if (filters.minRating !== undefined) {
    filtered = filtered.filter(resource => 
      resource.averageRating >= filters.minRating
    );
  }
  
  // Filter by recently added (last 30 days)
  if (filters.recentlyAdded) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    filtered = filtered.filter(resource => 
      new Date(resource.dateAdded) >= thirtyDaysAgo
    );
  }
  
  // Filter by search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(resource => 
      resource.title.toLowerCase().includes(query) || 
      resource.description.toLowerCase().includes(query)
    );
  }
  
  return filtered;
};
