
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
import { mapDbResourceToResource } from '@/utils/resourceTransform';
import EnhancedHeroSection from '../components/EnhancedHeroSection';
import FeaturedResourcesSection from './home/FeaturedResourcesSection';
import TopRatedResourcesSection from './home/TopRatedResourcesSection';
import RecentlyAddedSection from './home/RecentlyAddedSection';
import NewResourcesSection from './home/NewResourcesSection';
import AgeRangeQuickFiltersSection from './home/AgeRangeQuickFiltersSection';
import LatestBlogPostsSection from './home/LatestBlogPostsSection';
import CallToActionSection from './home/CallToActionSection';

const Home = () => {
  const { data: dbResourcesRaw = [], isLoading, error } = useResources();

  const dbResources = Array.isArray(dbResourcesRaw)
    ? dbResourcesRaw.map(mapDbResourceToResource).filter(Boolean)
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

  // Recently added resources - last 6 only
  const recentResources = [...dbResources]
    .sort((a, b) =>
      new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    )
    .slice(0, 6);

  // Get the newest resources (last 8 added resources for new section)
  const newResources = [...dbResources]
    .sort((a, b) =>
      new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    )
    .slice(0, 8);

  // Most popular resources - top 3 by view count
  const mostPopularResources = [...dbResources]
    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
    .slice(0, 3);

  const featuredBlogPosts = getFeaturedBlogPosts(2);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-lg text-muted-foreground">Loading resources...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <EnhancedHeroSection />
      <div className="enhanced-section">
        <FeaturedResourcesSection featuredResources={featuredResources} />
      </div>
      <div className="enhanced-section">
        <NewResourcesSection newResources={newResources} />
      </div>
      <div className="enhanced-section">
        <TopRatedResourcesSection topRatedResources={mostPopularResources} />
      </div>
      <div className="enhanced-section">
        <RecentlyAddedSection recentResources={recentResources} />
      </div>
      <div className="enhanced-section">
        <AgeRangeQuickFiltersSection />
      </div>
      <div className="enhanced-section">
        <LatestBlogPostsSection featuredBlogPosts={featuredBlogPosts} />
      </div>
      <CallToActionSection />
    </Layout>
  );
};

export default Home;
