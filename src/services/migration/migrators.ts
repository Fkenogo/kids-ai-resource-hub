
import { createOne } from '@/services/backend/firestoreDb';
import { convertProductToDbFormat, convertResourceToDbFormat } from './converters';
import { mockProducts } from '@/data/shoppingData';

const resourceSeeds = [
  {
    id: 'res_teachable_machine',
    title: 'Google Teachable Machine',
    description: 'A beginner-friendly tool for kids to train image, sound, and pose models without coding.',
    url: 'https://teachablemachine.withgoogle.com/',
    ageRanges: ['8-10', '11-13', '14-17'],
    resourceType: 'interactive_tool',
    format: 'Interactive Tool',
    cost: 'free',
    learningOutcomes: ['Model training basics', 'Classification concepts', 'Experimentation'],
    skillsAttained: ['Critical thinking', 'Data awareness'],
    keyFeatures: ['Browser-based', 'No setup', 'Easy demos'],
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200',
    averageRating: 4.8,
    reviewCount: 12,
    featuredResource: true,
    dateAdded: '2024-01-15T09:00:00.000Z',
  },
  {
    id: 'res_quick_draw',
    title: 'Google Quick, Draw!',
    description: 'A playful game where kids see how AI recognizes sketches in real time.',
    url: 'https://quickdraw.withgoogle.com/',
    ageRanges: ['5-7', '8-10', '11-13'],
    resourceType: 'game',
    format: 'Game',
    cost: 'free',
    learningOutcomes: ['Pattern recognition', 'AI prediction basics'],
    skillsAttained: ['Creativity', 'Observation'],
    keyFeatures: ['Fast rounds', 'Kid-friendly UI', 'Instant feedback'],
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200',
    averageRating: 4.6,
    reviewCount: 8,
    featuredResource: true,
    dateAdded: '2024-01-16T09:00:00.000Z',
  },
  {
    id: 'res_codeorg_ai',
    title: 'Code.org AI Foundations',
    description: 'Structured AI learning modules for kids with interactive lessons and projects.',
    url: 'https://code.org/',
    ageRanges: ['8-10', '11-13', '14-17'],
    resourceType: 'online_course',
    format: 'Course',
    cost: 'free',
    learningOutcomes: ['AI concepts', 'Responsible AI', 'Project thinking'],
    skillsAttained: ['Problem solving', 'Computational thinking'],
    keyFeatures: ['Curriculum tracks', 'Teacher resources'],
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200',
    averageRating: 4.7,
    reviewCount: 10,
    featuredResource: false,
    dateAdded: '2024-01-18T09:00:00.000Z',
  },
];

export async function runFullMigration() {
  await migrateResourceData();
  await migrateProductData();
}

export async function migrateResourceData() {
  const actorId = 'system';
  await Promise.all(
    resourceSeeds.map(async (resource) => {
      const converted = convertResourceToDbFormat(resource, actorId);
      await createOne('resources', { ...converted, id: resource.id, updated_at: new Date().toISOString() }, resource.id);
    }),
  );
}

export async function migrateProductData() {
  await Promise.all(
    mockProducts.map(async (product) => {
      const converted = convertProductToDbFormat(product);
      await createOne('products', { ...converted, id: product.id, updated_at: new Date().toISOString() }, product.id);
    }),
  );
}
