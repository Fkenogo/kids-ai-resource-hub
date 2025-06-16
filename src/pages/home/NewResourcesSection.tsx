
import { ResourceGrid } from "@/components/ResourceGrid";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { m } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Props {
  newResources: any[];
}

const NewResourcesSection = ({ newResources }: Props) => (
  <section className="py-20 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-blue-600" />
          <span className="text-blue-600 font-semibold">New Additions</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
          Latest AI Learning Resources
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our newest collection of AI learning platforms and tools for kids
        </p>
      </m.div>
      
      <m.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <ResourceGrid resources={newResources} columns={4} />
      </m.div>
      
      <m.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center mt-8"
      >
        <Button 
          variant="outline" 
          size="lg"
          className="hover-glow hover-lift"
          asChild
        >
          <Link to="/resources">Explore All Resources</Link>
        </Button>
      </m.div>
    </div>
  </section>
);

export default NewResourcesSection;
