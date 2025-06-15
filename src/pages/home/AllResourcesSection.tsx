
import { ResourceGrid } from "@/components/ResourceGrid";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Props {
  nonFeaturedResources: any[];
}

const AllResourcesSection = ({ nonFeaturedResources }: Props) => (
  <section className="py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold">All Resources</h2>
        <Button variant="outline" asChild>
          <Link to="/resources">View All</Link>
        </Button>
      </div>
      <ResourceGrid resources={nonFeaturedResources} columns={3} />
    </div>
  </section>
);

export default AllResourcesSection;
