import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ResourceGrid } from '@/components/ResourceGrid';
import { BlogGrid } from '@/components/BlogGrid';
import { Button } from '@/components/ui/button';
import { useResources } from '@/hooks/useSupabaseData';
import { getFeaturedBlogPosts } from '@/data/blogData';
import { Badge } from '@/components/ui/badge';
import { m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import HeroSection from './home/HeroSection';
import FeaturedResourcesSection from './home/FeaturedResourcesSection';
import AllResourcesSection from './home/AllResourcesSection';
import TopRatedResourcesSection from './home/TopRatedResourcesSection';
import RecentlyAddedSection from './home/RecentlyAddedSection';
import AgeRangeQuickFiltersSection from './home/AgeRangeQuickFiltersSection';
import LatestBlogPostsSection from './home/LatestBlogPostsSection';
import CallToActionSection from './home/CallToActionSection';

const mapDbResourceToResource = (r: any): import('@/types').Resource => ({
  id: r.id,
  title: r.title,
  description: r.description,
  url: r.url,
  ageRanges: r.age_ranges,
  resourceType: r.resource_type,
  format: r.format ?? undefined,
  cost: r.cost,
  learningOutcomes: r.learning_outcomes ?? undefined,
  skillsAttained: r.skills_attained ?? undefined,
  keyFeatures: r.key_features ?? undefined,
  dateAdded: r.created_at,
  addedBy: r.added_by,
  averageRating: r.average_rating ?? 0,
  reviewCount: r.review_count ?? 0,
  featuredResource: r.is_featured ?? false,
  imageUrl: r.image_url ?? undefined,
  viewCount: r.view_count ?? 0,
  likeCount: r.like_count ?? 0,
  shareCount: r.share_count ?? 0,
  saveCount: r.save_count ?? 0,
  commentCount: r.comment_count ?? 0,
});

const Home = () => {
  const { data: dbResourcesRaw = [], isLoading, error } = useResources();
  if (error) console.error("Home: resource query error", error);

  const dbResources = Array.isArray(dbResourcesRaw)
    ? dbResourcesRaw.map(mapDbResourceToResource)
    : [];

  // Find Teachable Machine resource by title (case-insensitive, fallback to url if needed)
  const teachableMachine = dbResources.find(
    r =>
      r.title &&
      r.title.toLowerCase().includes("teachable machine") &&
      r.url === "https://teachablemachine.withgoogle.com/"
  );

  // Featured resources, max 3, always include Teachable Machine first if available
  let featuredResources = dbResources.filter(r => r.featuredResource);

  // Insert Teachable Machine at the front if not already featured and resource exists
  if (teachableMachine) {
    const alreadyInFeatured = featuredResources.some(r => r.id === teachableMachine.id);
    if (!alreadyInFeatured) {
      featuredResources = [teachableMachine, ...featuredResources];
    }
  }

  // Limit to 3
  featuredResources = featuredResources.slice(0, 3);

  // All resources except featured
  const nonFeaturedResources = dbResources.filter(
    r => !featuredResources.some(fr => fr.id === r.id)
  );

  const recentResources = [...dbResources]
    .sort((a, b) =>
      new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    )
    .slice(0, 6);
  const topRatedResources = [...dbResources]
    .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
    .slice(0, 6);

  const featuredBlogPosts = getFeaturedBlogPosts(2);
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Layout>
      <HeroSection />
      <FeaturedResourcesSection featuredResources={featuredResources} />
      <AllResourcesSection nonFeaturedResources={nonFeaturedResources} />
      <TopRatedResourcesSection topRatedResources={topRatedResources} />
      <RecentlyAddedSection recentResources={recentResources} />
      <AgeRangeQuickFiltersSection />
      <LatestBlogPostsSection featuredBlogPosts={featuredBlogPosts} />
      <CallToActionSection />
    </Layout>
  );
};

export default Home;
