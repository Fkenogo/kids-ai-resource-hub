import admin from 'firebase-admin';

const getEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing env var: ${key}`);
  }
  return value;
};

const initAdmin = () => {
  if (admin.apps.length > 0) return admin.app();

  const projectId = getEnv('FIREBASE_PROJECT_ID');
  const clientEmail = getEnv('FIREBASE_CLIENT_EMAIL');
  const privateKey = getEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n');

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    projectId,
  });
};

const now = new Date().toISOString();

const profiles = [
  {
    id: 'system',
    email: 'system@kids-ai-resources.local',
    username: 'system',
    display_name: 'Kids AI Resources Team',
    avatar_url: null,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: now,
  },
  {
    id: 'u_parent_1',
    email: 'parent1@example.com',
    username: 'parent_explorer',
    display_name: 'Parent Explorer',
    avatar_url: null,
    created_at: '2024-01-05T00:00:00.000Z',
    updated_at: now,
  },
  {
    id: 'u_teacher_1',
    email: 'teacher1@example.com',
    username: 'ai_teacher',
    display_name: 'AI Teacher',
    avatar_url: null,
    created_at: '2024-01-06T00:00:00.000Z',
    updated_at: now,
  },
];

const resources = [
  {
    id: 'res_teachable_machine',
    title: 'Google Teachable Machine',
    description: 'A beginner-friendly tool for kids to train image, sound, and pose models without coding.',
    url: 'https://teachablemachine.withgoogle.com/',
    age_ranges: ['8-10', '11-13', '14-17'],
    resource_type: 'interactive_tool',
    format: 'Interactive Tool',
    cost: 'free',
    learning_outcomes: ['Model training basics', 'Classification concepts', 'Experimentation'],
    skills_attained: ['Critical thinking', 'Data awareness'],
    key_features: ['Browser-based', 'No setup', 'Easy demos'],
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200',
    added_by: 'system',
    average_rating: 4.8,
    review_count: 12,
    is_featured: true,
    is_approved: true,
    view_count: 0,
    like_count: 0,
    share_count: 0,
    save_count: 0,
    comment_count: 0,
    created_at: '2024-01-15T09:00:00.000Z',
    updated_at: now,
  },
  {
    id: 'res_quick_draw',
    title: 'Google Quick, Draw!',
    description: 'A playful game where kids see how AI recognizes sketches in real time.',
    url: 'https://quickdraw.withgoogle.com/',
    age_ranges: ['5-7', '8-10', '11-13'],
    resource_type: 'game',
    format: 'Game',
    cost: 'free',
    learning_outcomes: ['Pattern recognition', 'AI prediction basics'],
    skills_attained: ['Creativity', 'Observation'],
    key_features: ['Fast rounds', 'Kid-friendly UI', 'Instant feedback'],
    image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200',
    added_by: 'system',
    average_rating: 4.6,
    review_count: 8,
    is_featured: true,
    is_approved: true,
    view_count: 0,
    like_count: 0,
    share_count: 0,
    save_count: 0,
    comment_count: 0,
    created_at: '2024-01-16T09:00:00.000Z',
    updated_at: now,
  },
  {
    id: 'res_codeorg_ai',
    title: 'Code.org AI Foundations',
    description: 'Structured AI learning modules for kids with interactive lessons and projects.',
    url: 'https://code.org/',
    age_ranges: ['8-10', '11-13', '14-17'],
    resource_type: 'online_course',
    format: 'Course',
    cost: 'free',
    learning_outcomes: ['AI concepts', 'Responsible AI', 'Project thinking'],
    skills_attained: ['Problem solving', 'Computational thinking'],
    key_features: ['Curriculum tracks', 'Teacher resources'],
    image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200',
    added_by: 'system',
    average_rating: 4.7,
    review_count: 10,
    is_featured: false,
    is_approved: true,
    view_count: 0,
    like_count: 0,
    share_count: 0,
    save_count: 0,
    comment_count: 0,
    created_at: '2024-01-18T09:00:00.000Z',
    updated_at: now,
  },
  {
    id: 'res_scishow_ai',
    title: 'SciShow Kids: AI Explainers',
    description: 'Kid-friendly videos introducing AI ideas with examples from daily life.',
    url: 'https://www.youtube.com/@SciShowKids',
    age_ranges: ['5-7', '8-10'],
    resource_type: 'video',
    format: 'Video',
    cost: 'free',
    learning_outcomes: ['Core AI vocabulary', 'Real-world AI awareness'],
    skills_attained: ['Curiosity', 'Discussion skills'],
    key_features: ['Short videos', 'Visual explanations'],
    image_url: 'https://images.unsplash.com/photo-1603354350317-6f7aaa5911c5?w=1200',
    added_by: 'system',
    average_rating: 4.5,
    review_count: 5,
    is_featured: false,
    is_approved: true,
    view_count: 0,
    like_count: 0,
    share_count: 0,
    save_count: 0,
    comment_count: 0,
    created_at: '2024-01-19T09:00:00.000Z',
    updated_at: now,
  },
  {
    id: 'res_scratch_ai',
    title: 'Scratch AI Projects',
    description: 'Creative coding projects where kids build simple AI-inspired experiences in Scratch.',
    url: 'https://scratch.mit.edu/',
    age_ranges: ['8-10', '11-13', '14-17'],
    resource_type: 'activity',
    format: 'Activity',
    cost: 'free',
    learning_outcomes: ['Block coding', 'Logic', 'Interactive design'],
    skills_attained: ['Creativity', 'Iteration'],
    key_features: ['Project gallery', 'Community sharing'],
    image_url: 'https://images.unsplash.com/photo-1584697964358-3e14ca57658b?w=1200',
    added_by: 'system',
    average_rating: 4.7,
    review_count: 9,
    is_featured: true,
    is_approved: true,
    view_count: 0,
    like_count: 0,
    share_count: 0,
    save_count: 0,
    comment_count: 0,
    created_at: '2024-01-20T09:00:00.000Z',
    updated_at: now,
  },
  {
    id: 'res_ai4k12',
    title: 'AI4K12 Guidelines',
    description: 'Framework and resources to guide age-appropriate AI education in schools and at home.',
    url: 'https://ai4k12.org/',
    age_ranges: ['11-13', '14-17'],
    resource_type: 'curriculum',
    format: 'Curriculum',
    cost: 'free',
    learning_outcomes: ['AI literacy', 'Ethics in AI'],
    skills_attained: ['Research', 'Responsible technology use'],
    key_features: ['Teaching framework', 'Classroom alignment'],
    image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200',
    added_by: 'system',
    average_rating: 4.4,
    review_count: 3,
    is_featured: false,
    is_approved: true,
    view_count: 0,
    like_count: 0,
    share_count: 0,
    save_count: 0,
    comment_count: 0,
    created_at: '2024-01-21T09:00:00.000Z',
    updated_at: now,
  },
];

const resourceReviews = [
  {
    id: 'rev_tm_1',
    resource_id: 'res_teachable_machine',
    user_id: 'u_parent_1',
    rating: 5,
    comment: 'Excellent starter tool for kids to understand AI models.',
    helpful_count: 0,
    is_verified_purchase: false,
    created_at: '2024-01-22T10:00:00.000Z',
    updated_at: now,
  },
  {
    id: 'rev_scratch_1',
    resource_id: 'res_scratch_ai',
    user_id: 'u_teacher_1',
    rating: 4,
    comment: 'Great for creative projects and class demonstrations.',
    helpful_count: 0,
    is_verified_purchase: false,
    created_at: '2024-01-23T10:00:00.000Z',
    updated_at: now,
  },
];

const resourceComments = [
  {
    id: 'com_tm_1',
    resource_id: 'res_teachable_machine',
    user_id: 'u_teacher_1',
    content: 'Try this with a webcam demo in class, kids love it.',
    like_count: 0,
    is_pinned: false,
    parent_comment_id: null,
    created_at: '2024-01-24T10:00:00.000Z',
    updated_at: now,
  },
];

const blogPosts = [
  {
    id: 'blog_welcome',
    title: 'Welcome to Kids AI Resources',
    slug: 'welcome-to-kids-ai-resources',
    excerpt: 'A practical guide to discovering curated AI learning resources for children.',
    content: '<h1>Welcome</h1><p>We help families and educators find age-appropriate AI learning resources.</p>',
    category: 'Announcements',
    tags: ['Welcome', 'Getting Started'],
    image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200',
    read_time: 3,
    view_count: 0,
    is_featured: true,
    is_published: true,
    author_id: 'system',
    created_at: '2024-01-15T10:00:00.000Z',
    updated_at: now,
    published_at: '2024-01-15T10:00:00.000Z',
  },
  {
    id: 'blog_parent_support',
    title: 'How Parents Can Support AI Learning at Home',
    slug: 'how-parents-can-support-ai-learning-at-home',
    excerpt: 'Simple, practical ways to help kids learn AI responsibly and creatively.',
    content: '<h1>Support at Home</h1><p>Use hands-on tools, encourage questions, and keep learning fun.</p>',
    category: 'Parent Guides',
    tags: ['Parents', 'AI Education'],
    image_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200',
    read_time: 5,
    view_count: 0,
    is_featured: true,
    is_published: true,
    author_id: 'system',
    created_at: '2024-01-20T10:00:00.000Z',
    updated_at: now,
    published_at: '2024-01-20T10:00:00.000Z',
  },
  {
    id: 'blog_benefits_early_ai',
    title: 'Benefits of Learning AI at a Young Age',
    slug: 'benefits-of-learning-ai-at-a-young-age',
    excerpt: 'Why early AI literacy improves problem solving, creativity, and future readiness.',
    content: '<h1>Why Start Early</h1><p>Early AI learning builds confidence in STEM and critical thinking.</p>',
    category: 'Learning Resources',
    tags: ['Benefits', 'STEM'],
    image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200',
    read_time: 4,
    view_count: 0,
    is_featured: false,
    is_published: true,
    author_id: 'system',
    created_at: '2024-01-25T10:00:00.000Z',
    updated_at: now,
    published_at: '2024-01-25T10:00:00.000Z',
  },
];

const blogComments = [
  {
    id: 'blog_com_1',
    post_id: 'blog_parent_support',
    author_id: 'u_parent_1',
    content: 'Very helpful tips. We started with short weekly AI sessions.',
    is_approved: true,
    like_count: 0,
    parent_comment_id: null,
    created_at: '2024-01-26T10:00:00.000Z',
    updated_at: now,
  },
];

const communityPosts = [
  {
    id: 'post_1',
    title: 'Best first AI activity for 8-year-olds?',
    content: 'Looking for a 30-minute intro activity that is fun and hands-on.',
    category: 'getting-started',
    author_id: 'u_parent_1',
    tags: ['beginner', 'age-8'],
    images: [],
    view_count: 0,
    like_count: 0,
    reply_count: 1,
    is_sticky: false,
    is_locked: false,
    last_activity: '2024-01-27T10:00:00.000Z',
    created_at: '2024-01-27T09:00:00.000Z',
    updated_at: now,
  },
];

const communityReplies = [
  {
    id: 'reply_1',
    post_id: 'post_1',
    content: 'Try Quick, Draw! first, then discuss how the AI is guessing.',
    author_id: 'u_teacher_1',
    parent_reply_id: null,
    like_count: 0,
    is_solution: false,
    created_at: '2024-01-27T10:00:00.000Z',
    updated_at: now,
  },
];

const products = [
  {
    id: 'prod_ai_kit',
    title: 'AI for Kids Learning Kit',
    description: 'Hands-on starter kit with activities and guided lessons.',
    short_description: 'Starter AI kit for kids',
    category: 'kits',
    price: 89.99,
    original_price: 129.99,
    price_type: 'one-time',
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200',
    rating: 4.8,
    review_count: 127,
    in_stock: true,
    stock_count: 50,
    seller: 'AI Learning Co.',
    is_affiliate: false,
    age_range: '8-10',
    tags: ['beginner', 'interactive'],
    features: ['Books', 'Activities', 'Parent Guide'],
    requirements: [],
    is_bestseller: true,
    is_featured: true,
    created_at: '2024-01-15T12:00:00.000Z',
    updated_at: now,
  },
  {
    id: 'prod_teachable_course',
    title: 'Teachable Machine Course',
    description: 'Video-led course on machine learning fundamentals for kids.',
    short_description: 'Course on Teachable Machine',
    category: 'courses',
    price: 49.99,
    price_type: 'one-time',
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200',
    rating: 4.6,
    review_count: 89,
    in_stock: true,
    seller: 'TechEd Academy',
    is_affiliate: true,
    affiliate_url: 'https://example.com/affiliate',
    age_range: '11-13',
    tags: ['machine-learning'],
    features: ['Video lessons', 'Downloads'],
    requirements: [],
    is_bestseller: false,
    is_featured: false,
    created_at: '2024-01-18T12:00:00.000Z',
    updated_at: now,
  },
];

const collectionSeeds = {
  profiles,
  resources,
  resource_reviews: resourceReviews,
  resource_comments: resourceComments,
  blog_posts: blogPosts,
  blog_comments: blogComments,
  community_posts: communityPosts,
  community_replies: communityReplies,
  products,
};

const seedCollection = async (db, collectionName, docs, wipeFirst = false) => {
  const collectionRef = db.collection(collectionName);

  if (wipeFirst) {
    const snapshot = await collectionRef.get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    if (!snapshot.empty) {
      await batch.commit();
    }
  }

  const batch = db.batch();
  docs.forEach((docData) => {
    const docRef = collectionRef.doc(String(docData.id));
    batch.set(docRef, docData, { merge: true });
  });
  await batch.commit();
};

const getCollectionCount = async (db, collectionName) => {
  const snap = await db.collection(collectionName).count().get();
  return snap.data().count;
};

const main = async () => {
  initAdmin();
  const db = admin.firestore();

  const wipe = process.argv.includes('--wipe');
  console.log(`Starting Firestore seed (${wipe ? 'wipe+seed' : 'upsert seed'})...`);

  for (const [collectionName, docs] of Object.entries(collectionSeeds)) {
    await seedCollection(db, collectionName, docs, wipe);
    console.log(`Seeded ${collectionName}: ${docs.length} docs`);
  }

  console.log('Verifying counts...');
  for (const collectionName of Object.keys(collectionSeeds)) {
    const count = await getCollectionCount(db, collectionName);
    console.log(` - ${collectionName}: ${count}`);
  }

  console.log('Seed complete.');
};

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
