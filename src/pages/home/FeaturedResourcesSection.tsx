
import { ResourceGrid } from "@/components/ResourceGrid";

interface Props {
  featuredResources: any[];
}

const FeaturedResourcesSection = ({ featuredResources }: Props) => (
  <section className="bg-secondary/50 py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold">Featured Resources</h2>
      </div>
      <ResourceGrid resources={featuredResources} columns={3} />
    </div>
  </section>
);

export default FeaturedResourcesSection;
