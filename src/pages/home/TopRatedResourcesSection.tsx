
import { ResourceGrid } from "@/components/ResourceGrid";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { m } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { Resource } from "@/types";

interface Props {
  topRatedResources: Resource[];
}

const TopRatedResourcesSection = ({ topRatedResources }: Props) => (
  <section className="py-8 md:py-10 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-6 md:mb-8"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <TrendingUp className="h-5 w-5 text-orange-600" />
          <span className="text-orange-600 font-semibold text-sm">Trending</span>
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold gradient-text mb-3">
          Most Popular
        </h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          The most viewed and loved AI learning resources by our community
        </p>
      </m.div>
      
      <m.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <ResourceGrid resources={topRatedResources} columns={3} />
      </m.div>
      
      <m.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center mt-4 md:mt-6"
      >
        <Button 
          variant="outline" 
          size="lg"
          className="hover-glow hover-lift"
          asChild
        >
          <Link to="/resources">View All Resources</Link>
        </Button>
      </m.div>
    </div>
  </section>
);

export default TopRatedResourcesSection;
