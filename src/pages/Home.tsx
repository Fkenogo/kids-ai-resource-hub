
import { Layout } from '@/components/Layout';
import { useResources } from '@/hooks/useSupabaseData';
import { mapDbResourceToResource } from '@/utils/resourceTransform';
import EnhancedHeroSection from '../components/EnhancedHeroSection';
import FeaturedResourcesSection from './home/FeaturedResourcesSection';
import TopRatedResourcesSection from './home/TopRatedResourcesSection';
import RecentlyAddedSection from './home/RecentlyAddedSection';
import AgeRangeQuickFiltersSection from './home/AgeRangeQuickFiltersSection';
import LatestBlogPostsSection from './home/LatestBlogPostsSection';
import CallToActionSection from './home/CallToActionSection';

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

  // Recently added resources - last 3 only
  const recentResources = [...dbResources]
    .sort((a, b) =>
      new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    )
    .slice(0, 3);

  // Most popular resources - top 3 by view count
  const mostPopularResources = [...dbResources]
    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
    .slice(0, 3);

  return (
    <Layout>
      <EnhancedHeroSection />
      <div className="space-y-16 md:space-y-20">
        <FeaturedResourcesSection featuredResources={featuredResources} />
        <TopRatedResourcesSection topRatedResources={mostPopularResources} />
        <RecentlyAddedSection recentResources={recentResources} />
        <AgeRangeQuickFiltersSection />
        <LatestBlogPostsSection />
      </div>
      <CallToActionSection />
    </Layout>
  );
};

export default Home;
